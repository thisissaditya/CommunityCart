import express from 'express';
import { register, login, getDemoAccounts } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/demo-accounts', getDemoAccounts);

export default router;
