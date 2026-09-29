import express from 'express';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/prescription', upload.single('prescription'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // req.file.path contains the URL to the Cloudinary image
    res.status(200).json({
      success: true,
      message: 'Prescription uploaded successfully',
      url: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
