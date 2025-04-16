import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import pendingStudentModel from '../models/pendingStudentModel.js';
import pendingRegistrationModel from '../models/pendingRegistrationModel.js';

const JWT_SECRET = 'your-secret-key'; // Match auth.js

export const register = async (req, res) => {
  const {
    email,
    password,
    name,
    student_id,
    session,
    department,
    batch,
    hall_name,
    mobile_number,
  } = req.body;
  try {
    // Validate required fields
    if (!email || !password || !name || !student_id) {
      return res.status(400).send({ error: 'Email, password, name, and student ID are required' });
    }

    // Check if email is already registered
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).send({ error: 'Email already registered' });
    }

    // Check against pre-added student data
    const pendingStudent = await pendingStudentModel.findStudentByEmail(email) ||
                         await pendingStudentModel.findStudentByStudentId(student_id);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (pendingStudent) {
      // If student data matches, directly add to users
      await userModel.createUser({
        email,
        password: hashedPassword,
        name,
        student_id,
        session,
        department,
        batch,
        hall_name,
        mobile_number,
        role: 'user',
      });
      res.status(201).send({ message: 'Registration successful' });
    } else {
      // If no match, send to pending_registrations
      await pendingRegistrationModel.createRegistration({
        email,
        password: hashedPassword,
        name,
        student_id,
        session,
        department,
        batch,
        hall_name,
        mobile_number,
      });
      res.status(201).send({ message: 'Registration submitted for admin verification' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).send({ error: 'Registration failed, check input data' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Validate payload
  if (!email || !password) {
    console.log('Missing fields:', { email, password });
    return res.status(400).send({ error: 'Email and password are required' });
  }

  try {
    // Find user
    console.log('Attempting login for:', email);
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    // Check password
    console.log('User found:', { id: user.id, email: user.email, role: user.role });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Login successful:', email);
    res.send({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ error: 'Login failed' });
  }
};


