import pendingStudentModel from '../models/pendingStudentModel.js';
import pendingRegistrationModel from '../models/pendingRegistrationModel.js';
import userModel from '../models/userModel.js';

export const addStudent = async (req, res) => {
  const {
    email,
    name,
    student_id,
    session,
    department,
    batch,
    hall_name,
    mobile_number,
  } = req.body;
  try {
    const existingStudent = await pendingStudentModel.findStudentByEmail(email) ||
                            await pendingStudentModel.findStudentByStudentId(student_id);
    if (existingStudent) {
      return res.status(400).send({ error: 'Student email or ID already exists' });
    }

    await pendingStudentModel.addStudent({
      email,
      name,
      student_id,
      session,
      department,
      batch,
      hall_name,
      mobile_number,
    });
    res.status(201).send({ message: 'Student added successfully' });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send({ error: 'Failed to add student' });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await pendingStudentModel.getAllStudents();
    res.send(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send({ error: 'Failed to fetch students' });
  }
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await pendingStudentModel.deleteStudent(id);
    if (!deleted) {
      return res.status(404).send({ error: 'Student not found' });
    }
    res.send({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send({ error: 'Failed to delete student' });
  }
};

export const getPendingRegistrations = async (req, res) => {
  try {
    const registrations = await pendingRegistrationModel.getPendingRegistrations();
    res.send(registrations);
  } catch (error) {
    console.error('Error fetching pending registrations:', error);
    res.status(500).send({ error: 'Failed to fetch pending registrations' });
  }
};

export const getRegistrationById = async (req, res) => {
  const { id } = req.params;
  try {
    const registration = await pendingRegistrationModel.findRegistrationById(id);
    if (!registration) {
      return res.status(404).send({ error: 'Registration not found' });
    }
    res.send(registration);
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).send({ error: 'Failed to fetch registration' });
  }
};

export const verifyRegistration = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  try {
    const registration = await pendingRegistrationModel.findRegistrationById(id);
    if (!registration) {
      return res.status(404).send({ error: 'Registration not found' });
    }

    if (action === 'approve') {
      await userModel.createUser({
        email: registration.email,
        password: registration.password,
        name: registration.name,
        student_id: registration.student_id,
        session: registration.session,
        department: registration.department,
        batch: registration.batch,
        hall_name: registration.hall_name,
        mobile_number: registration.mobile_number,
        role: 'user',
      });
      await pendingRegistrationModel.updateRegistrationStatus(id, 'approved');
    } else if (action === 'reject') {
      await pendingRegistrationModel.updateRegistrationStatus(id, 'rejected');
    } else {
      return res.status(400).send({ error: 'Invalid action' });
    }

    res.send({ message: `Registration ${action}d successfully` });
  } catch (error) {
    console.error('Error verifying registration:', error);
    res.status(500).send({ error: 'Failed to verify registration' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers('user'); // Filter for role = 'user'
    res.send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ error: 'Failed to fetch users' });
  }
};