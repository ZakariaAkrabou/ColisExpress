import { Router } from 'express';
import { LocationController } from '../controllers/location.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect); 


router.post('/create', restrictTo('admin'), LocationController.create);
router.delete('/delete/:id', restrictTo('admin'), LocationController.delete);

router.get('/list', LocationController.getAll);

export default router;