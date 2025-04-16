// adminRoutes.js
import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import {
  addStudent,
  getStudents,
  deleteStudent,
  getPendingRegistrations,
  getRegistrationById,
  verifyRegistration,
  getAllUsers, // Add new import
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/students', verifyToken, isAdmin, addStudent);
router.get('/students', verifyToken, isAdmin, getStudents);
router.delete('/students/:id', verifyToken, isAdmin, deleteStudent);
router.get('/verify', verifyToken, isAdmin, getPendingRegistrations);
router.get('/verify/:id', verifyToken, isAdmin, getRegistrationById);
router.post('/verify/:id', verifyToken, isAdmin, verifyRegistration);
router.get('/users', verifyToken, isAdmin, getAllUsers); // New route

export default router;