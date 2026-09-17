import express from 'express';
import { getEvents, registerEventAttendee } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/:id/register', registerEventAttendee);

export default router;
