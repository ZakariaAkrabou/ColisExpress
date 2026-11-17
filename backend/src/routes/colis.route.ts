import { Router } from 'express';
import { ColisController } from '../controllers/colis.controller';

const router = Router();

router.post('/', ColisController.createColis);
router.get('/', ColisController.getAllColis);

// Specific action routes placed BEFORE /:id to prevent route shadowing
router.delete('/bulk', ColisController.deleteColisBulk);
router.delete('/all', ColisController.deleteAllColis);

router.get('/:id', ColisController.getColisById);
router.put('/:id', ColisController.updateColis);
router.delete('/:id', ColisController.deleteColis);

export default router;
export { router as colisRouter };

