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
        // users: await User.find({}),
        // locations: await Location.find({}),
        // clients: await Client.find({}),
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

  static async restoreBackup(userId: string, fileId: string) {
    let zipPath = '';
    let extractPath = '';

    try {
    
      const auth = await BackupAuth.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!auth) throw new Error('Google Drive is not connected.');

      const oauth2Client = createOAuthClient();
      oauth2Client.setCredentials({ refresh_token: auth.refreshToken });
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

    
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const res = await drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      zipPath = path.join(tempDir, `restore_${Date.now()}.zip`);
      const dest = fs.createWriteStream(zipPath);
      
      await new Promise((resolve, reject) => {
        res.data
          .on('end', () => resolve(true))
          .on('error', (err: any) => reject(err))
          .pipe(dest);
      });


      const zip = new AdmZip(zipPath);
      extractPath = path.join(tempDir, `extract_${Date.now()}`);
      zip.extractAllTo(extractPath, true);

      const files = fs.readdirSync(extractPath);
      const jsonFile = files.find(f => f.endsWith('.json'));
      if (!jsonFile) throw new Error('No JSON file found in the backup ZIP.');

      const jsonData = fs.readFileSync(path.join(extractPath, jsonFile), 'utf-8');
      const data = JSON.parse(jsonData);

     
      
      // if (data.users && data.users.length > 0) {
      //   const ops = data.users.map((u: any) => ({
      //     updateOne: { filter: { _id: u._id }, update: { $set: u }, upsert: true }
      //   }));
      //   await User.bulkWrite(ops);
      // }

      // if (data.locations && data.locations.length > 0) {
      //   const ops = data.locations.map((l: any) => ({
      //     updateOne: { filter: { _id: l._id }, update: { $set: l }, upsert: true }
      //   }));
      //   await Location.bulkWrite(ops);
      // }

      // if (data.clients && data.clients.length > 0) {
      //   const ops = data.clients.map((c: any) => ({
      //     updateOne: { filter: { _id: c._id }, update: { $set: c }, upsert: true }
      //   }));
      //   await Client.bulkWrite(ops);
      // }

      if (data.colis && data.colis.length > 0) {
        const ops = data.colis.map((c: any) => ({
          updateOne: { filter: { _id: c._id }, update: { $set: c }, upsert: true }
        }));
        await Colis.bulkWrite(ops);
      }

      return { message: 'Backup restored successfully', restoredAt: new Date() };

    } catch (error: any) {
      throw new Error(`Restore failed: ${error.message}`);
    } finally {
     
      if (zipPath && fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
      if (extractPath && fs.existsSync(extractPath)) {
        fs.rmSync(extractPath, { recursive: true, force: true });
      }
    }
  }

   static async resetDatabase(userId: string) {
    try {
      await this.createBackup(userId);

    
      // await Location.deleteMany({});
      // await Client.deleteMany({});
      await Colis.deleteMany({});
      
    

      return { message: 'All data has been backed up and successfully reset.' };
    } catch (error: any) {
      throw new Error(`Reset failed (Backup was not completed): ${error.message}`);
    }
  }

  static async importFromLocalZip(userId: string, zipPath: string) {
    let extractPath = '';
    try {
      
      const zip = new AdmZip(zipPath);
      extractPath = path.join(process.cwd(), 'temp', `extract_${Date.now()}`);
      zip.extractAllTo(extractPath, true);

      
      const files = fs.readdirSync(extractPath);
      const jsonFile = files.find(f => f.endsWith('.json'));
      if (!jsonFile) throw new Error('No JSON file found in the uploaded ZIP.');

     
      const jsonData = fs.readFileSync(path.join(extractPath, jsonFile), 'utf-8');
      const data = JSON.parse(jsonData);

   
      // if (data.users && data.users.length > 0) {
      //   const ops = data.users.map((u: any) => ({
      //     updateOne: { filter: { _id: u._id }, update: { $set: u }, upsert: true }
      //   }));
      //   await User.bulkWrite(ops);
      // }

      // if (data.locations && data.locations.length > 0) {
      //   const ops = data.locations.map((l: any) => ({
      //     updateOne: { filter: { _id: l._id }, update: { $set: l }, upsert: true }
      //   }));
      //   await Location.bulkWrite(ops);
      // }

      // if (data.clients && data.clients.length > 0) {
      //   const ops = data.clients.map((c: any) => ({
      //     updateOne: { filter: { _id: c._id }, update: { $set: c }, upsert: true }
      //   }));
      //   await Client.bulkWrite(ops);
      // }

      if (data.colis && data.colis.length > 0) {
        const ops = data.colis.map((c: any) => ({
          updateOne: { filter: { _id: c._id }, update: { $set: c }, upsert: true }
        }));
        await Colis.bulkWrite(ops);
      }

      return { message: 'Data imported successfully from uploaded file' };

    } catch (error: any) {
      throw new Error(`Import failed: ${error.message}`);
    } finally {
      
      if (extractPath && fs.existsSync(extractPath)) {
        fs.rmSync(extractPath, { recursive: true, force: true });
      }
      
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
      }
    }
  }

}