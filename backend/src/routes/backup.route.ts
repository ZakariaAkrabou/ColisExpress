import { Router } from 'express';
import { BackupController } from '../controllers/backup.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();


router.get('/google/callback', BackupController.googleCallback);

router.get('/google/auth-url', protect, restrictTo('admin'), BackupController.getAuthUrl);
router.get('/google/status', protect, restrictTo('admin'), BackupController.getStatus);


//backup routes
router.post('/create', protect, restrictTo('admin'), BackupController.createBackup);
router.get('/history', protect, restrictTo('admin'), BackupController.getHistory);

export default router;