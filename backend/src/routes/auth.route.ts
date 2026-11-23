import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {protect} from "../middlewares/auth.middleware";

const router = Router();

router.post('/login', AuthController.login);
router.post('/logout', protect, AuthController.logout);
export default router;