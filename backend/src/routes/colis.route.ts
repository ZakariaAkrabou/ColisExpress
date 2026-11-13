import { Router } from 'express';
import { ColisController } from '../controllers/colis.controller';

const router = Router();

router.post('/', ColisController.createColis);
router.get('/', ColisController.getAllColis);
router.get('/:id', ColisController.getColisById);
router.put('/:id', ColisController.updateColis);
router.delete('/:id', ColisController.deleteColis);

export default router;
export { router as colisRouter };

