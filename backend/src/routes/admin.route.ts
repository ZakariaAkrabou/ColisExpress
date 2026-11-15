import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();


router.use(protect);


router.use(restrictTo('admin')); 

router.get('/users', AdminController.getAllUsers);
router.post('/users', AdminController.createRamasseur);
router.patch('/users/:id/toggle', AdminController.toggleUserStatus);
router.patch('/users/:id/force-logout', AdminController.forceLogout); 
router.delete('/users/:id', AdminController.deleteUser);

export default router;