import express from 'express';
import { getComplaints, createComplaint, updateComplaintStatus } from '../controllers/complaintController.js';

const router = express.Router();

router.get('/', getComplaints);
router.post('/', createComplaint);
router.patch('/:id', updateComplaintStatus);

export default router;
