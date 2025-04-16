import pool from '../config/db.js';

const pendingStudentModel = {
  async addStudent({
    email,
    name,
    student_id,
    session,
    department,
    batch,
    hall_name,
    mobile_number,
  }) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO pending_students (email, name, student_id, session, department, batch, hall_name, mobile_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          email,
          name,
          student_id,
          session || null,
          department || null,
          batch || null,
          hall_name || null,
          mobile_number || null,
        ]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  },

  async findStudentByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM pending_students WHERE email = ?',
        [email]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async findStudentByStudentId(student_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM pending_students WHERE student_id = ?',
        [student_id]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async getAllStudents() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM pending_students');
      return rows;
    } finally {
      connection.release();
    }
  },

  async deleteStudent(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM pending_students WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

export default pendingStudentModel;