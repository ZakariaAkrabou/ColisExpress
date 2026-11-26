
import { Router } from 'express';
import { ColisController } from '../controllers/colis.controller';
import { upload } from '../middlewares/upload';

const router = Router();

// Multer must execute before the controller
router.post('/', upload.single('image'), ColisController.createColis);

router.get('/', ColisController.getAllColis);

router.delete('/bulk', ColisController.deleteColisBulk);
router.delete('/all', ColisController.deleteAllColis);

router.get('/:id', ColisController.getColisById);
router.put('/:id', ColisController.updateColis);
router.delete('/:id', ColisController.deleteColis);

export default router;
export { router as colisRouter };
