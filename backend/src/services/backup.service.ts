import { createOAuthClient, SCOPES } from '../utils/googleClient';
import { BackupAuth, BackupLog } from '../models/backup.model';
import { User } from '../models/user.model';
import { Location } from '../models/location.model';
import { Client } from '../models/client.model';
import { Colis } from '../models/colis.model';

import { google } from 'googleapis';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { Readable } from 'stream';

export class BackupService {

  static async getAuthUrl(userId: string) {
    const oauth2Client = createOAuthClient();


    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: SCOPES,
      state: userId,
    });

    return url;
  }


  static async handleCallback(code: string, userId: string) {
    const oauth2Client = createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      throw new Error('No refresh token received. Try revoking access and authorizing again.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    await BackupAuth.findOneAndUpdate(
      { userId: userObjectId },
      { refreshToken: tokens.refresh_token },
      { upsert: true, new: true }
    );

    return { message: 'Google Drive connected successfully' };
  }


  static async isConnected(userId: string) {
    const auth = await BackupAuth.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    return !!auth;
  }

    static async createBackup(userId: string) {
    let filePath = '';
    let zipPath = '';

    try {
      
      const auth = await BackupAuth.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!auth) throw new Error('Google Drive is not connected.');

     
      const data = {
        users: await User.find({}),
        locations: await Location.find({}),
        clients: await Client.find({}),
        colis: await Colis.find({}),
        exportedAt: new Date(),
      };

    
      const jsonString = JSON.stringify(data, null, 2);
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `colisexpress_backup_${dateStr}.json`;
      filePath = path.join(tempDir, fileName);
      fs.writeFileSync(filePath, jsonString);

      const zip = new AdmZip();
      zip.addLocalFile(filePath);
      const zipFileName = `colisexpress_backup_${dateStr}.zip`;
      zipPath = path.join(tempDir, zipFileName);
      zip.writeZip(zipPath);

      const fileSize = fs.statSync(zipPath).size;

    
      const oauth2Client = createOAuthClient();
      oauth2Client.setCredentials({ refresh_token: auth.refreshToken });
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

     
      let folderId;
      const folderRes = await drive.files.list({
        q: "name='ColisExpress Backups' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'files(id)',
      });

      if (folderRes.data.files && folderRes.data.files.length > 0) {
        folderId = folderRes.data.files[0].id;
      } else {
        const folder = await drive.files.create({
          requestBody: { name: 'ColisExpress Backups', mimeType: 'application/vnd.google-apps.folder' },
          fields: 'id',
        });
        folderId = folder.data.id;
      }

      
      const fileBuffer = fs.readFileSync(zipPath);
      const bufferStream = new Readable();
      bufferStream.push(fileBuffer);
      bufferStream.push(null); 

      const fileMetadata = { name: zipFileName, parents: folderId ? [folderId] : [] };
      const media = { mimeType: 'application/zip', body: bufferStream };

      const driveResponse = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, size',
      });

      
      const log = await BackupLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        fileName: driveResponse.data.name || zipFileName,
        fileId: driveResponse.data.id || 'unknown-id',
        size: fileSize,
        status: 'success',
      });

      return log;

    } catch (error: any) {
    
      await BackupLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        fileName: `failed_backup_${new Date().toISOString()}`,
        fileId: 'none',
        size: 0,
        status: 'failed',
        errorMessage: error.message,
      }).catch(err => console.error("Could not save backup log:", err));

      throw new Error(`Backup failed: ${error.message}`);
      
    } finally {
      
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (zipPath && fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    }
  }

  static async getBackupHistory(userId: string) {
    return await BackupLog.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

}