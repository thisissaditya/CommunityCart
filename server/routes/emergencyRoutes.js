import express from 'express';
import { getEmergencyContacts, triggerSOS } from '../controllers/emergencyController.js';

const router = express.Router();

router.get('/', getEmergencyContacts);
router.post('/sos', triggerSOS);

export default router;
