import pool from '../config/db.js';

const userModel = {
  async createUser({
    email,
    password,
    name,
    student_id,
    session,
    department,
    batch,
    hall_name,
    mobile_number,
    role = 'user',
  }) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO users (email, password, name, student_id, session, department, batch, hall_name, mobile_number, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
          role,
        ]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  },
  async getAllUsers(roleFilter = null) {
    const connection = await pool.getConnection();
    try {
      let query = 'SELECT id, email, name, student_id, session, department, batch, hall_name, mobile_number, role FROM users';
      const params = [];
      if (roleFilter) {
        query += ' WHERE role = ?';
        params.push(roleFilter);
      }
      const [rows] = await connection.execute(query, params);
      return rows;
    } finally {
      connection.release();
    }
  },
  async findUserByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async findUserById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async updateUserProfile(id, updates) {
    const connection = await pool.getConnection();
    try {
      const fieldsToUpdate = Object.entries(updates)
        .filter(([key, value]) => value !== undefined && value !== '' && key !== 'role')
        .map(([key, value]) => ({ key, value }));

      if (fieldsToUpdate.length === 0) {
        return false;
      }

      const setClause = fieldsToUpdate
        .map(({ key }) => `${key} = ?`)
        .join(', ');
      const values = fieldsToUpdate.map(({ value }) => value);
      values.push(id);

      const query = `UPDATE users SET ${setClause} WHERE id = ?`;
      const [result] = await connection.execute(query, values);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  },

  async countAdmins() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT COUNT(*) AS count FROM users WHERE role = ?',
        ['admin']
      );
      return rows[0].count;
    } finally {
      connection.release();
    }
  },
};

export default userModel;