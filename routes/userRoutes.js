import express from 'express';
import {
  getProfile,
  getDashboard,
  updateProfile,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js'; // Updated to auth.js and verifyToken

const router = express.Router();

router.get('/profile', verifyToken, getProfile);
router.get('/dashboard', verifyToken, getDashboard);
router.put('/profile', verifyToken, updateProfile);

export default router;