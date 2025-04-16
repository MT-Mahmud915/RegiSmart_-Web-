import pool from '../config/db.js';

const pendingRegistrationModel = {
  async createRegistration({
    email,
    password,
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
        'INSERT INTO pending_registrations (email, password, name, student_id, session, department, batch, hall_name, mobile_number, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          email,
          password,
          name,
          student_id || null,
          session || null,
          department || null,
          batch || null,
          hall_name || null,
          mobile_number || null,
          'pending',
        ]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  },

  async findRegistrationById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM pending_registrations WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async getPendingRegistrations() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM pending_registrations WHERE status = ?',
        ['pending']
      );
      return rows;
    } finally {
      connection.release();
    }
  },

  async updateRegistrationStatus(id, status) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'UPDATE pending_registrations SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  },

  async deleteRegistration(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM pending_registrations WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

export default pendingRegistrationModel;