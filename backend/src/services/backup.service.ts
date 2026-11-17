import { createOAuthClient, SCOPES } from '../utils/googleClient';
import { BackupAuth } from '../models/backup.model';
import { google } from 'googleapis';
import mongoose from 'mongoose';

export class BackupService {
 
  static async getAuthUrl(adminId: string) {
    const oauth2Client = createOAuthClient();
    
    
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', 
      scope: SCOPES,
      state: adminId, 
    });

    return url;
  }


  static async handleCallback(code: string, adminId: string) {
    const oauth2Client = createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      throw new Error('No refresh token received. Try revoking access and authorizing again.');
    }

    await BackupAuth.findOneAndUpdate(
      { adminId },
      { refreshToken: tokens.refresh_token },
      { upsert: true, new: true }
    );

    return { message: 'Google Drive connected successfully' };
  }


  static async isConnected(adminId: string) {
    const auth = await BackupAuth.findOne({ adminId });
    return !!auth;
  }

  
}