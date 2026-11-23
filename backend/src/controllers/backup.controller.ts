import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { BackupService } from '../services/backup.service';

export class BackupController {
    static async getAuthUrl(req: AuthRequest, res: Response): Promise<void> {
        try {

            const adminId = req.user!.id.toString();

            const url = await BackupService.getAuthUrl(adminId);
            res.status(200).json({ authUrl: url });
        } catch (error: any) {
            res.status(500).json({ message: 'Error generating auth URL', error: error.message });
        }
    }


    static async googleCallback(req: Request, res: Response): Promise<void> {
        try {
            const { code, state } = req.query;

            if (!code || typeof code !== 'string' || !state || typeof state !== 'string') {
                res.status(400).json({ message: 'Missing code or state parameter' });
                return;
            }

            const result = await BackupService.handleCallback(code, state);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: 'Error during Google callback', error: error.message });
        }
    }

    static async getStatus(req: AuthRequest, res: Response): Promise<void> {
        try {

            const adminId = req.user!.id.toString();

            const connected = await BackupService.isConnected(adminId);
            res.status(200).json({ connected });
        } catch (error: any) {
            res.status(500).json({ message: 'Error checking status', error: error.message });
        }
    }

    static async createBackup(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id.toString();
            const log = await BackupService.createBackup(userId);
            res.status(200).json({ message: 'Backup created and uploaded successfully', data: log });
        } catch (error: any) {
            res.status(500).json({ message: 'Backup failed', error: error.message });
        }
    }

    static async getHistory(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id.toString();
            const history = await BackupService.getBackupHistory(userId);
            res.status(200).json({ data: history });
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching history', error: error.message });
        }
    }

    static async restore(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id.toString();
            const { fileId } = req.body;

            if (!fileId) {
                res.status(400).json({ message: 'fileId is required' });
                return;
            }

            const result = await BackupService.restoreBackup(userId, fileId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: 'Restore failed', error: error.message });
        }
    }

    static async reset(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id.toString();
            const result = await BackupService.resetDatabase(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: 'Reset failed', error: error.message });
        }
    }

    static async importFile(req: AuthRequest, res: Response): Promise<void> {
    try {
   
      if (!req.file) {
        res.status(400).json({ message: 'Please upload a ZIP file.' });
        return;
      }

      const userId = req.user!.id.toString();
      const zipPath = req.file.path; 

      const result = await BackupService.importFromLocalZip(userId, zipPath);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Import failed', error: error.message });
    }
  }
}