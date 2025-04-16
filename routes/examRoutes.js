import express from 'express';
import {
  registerExam,
  processPayment,
  getAdmitCard,
  deleteAdmitCard,
} from '../controllers/examController.js';
import { verifyToken } from '../middleware/auth.js'; // Updated to auth.js and verifyToken

const router = express.Router();

router.post('/register', verifyToken, registerExam); // Changed to /register for consistency
router.post('/payment', verifyToken, processPayment);
router.get('/admit-card', verifyToken, getAdmitCard);
router.delete('/admit-card/:id', verifyToken, deleteAdmitCard);

export default router;