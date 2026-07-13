import pool from '../config/db.js';

export const getAllInquiries = async () => {
  const [rows] = await pool.query('SELECT * FROM inquiries ORDER BY date DESC');
  return rows;
};

export const createInquiry = async (data) => {
  const { name, email, phone, message, formType } = data;
  const [result] = await pool.query(
    'INSERT INTO inquiries (name, email, phone, message, formType) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, message, formType || 'Contact Us']
  );
  return result.insertId;
};

export const updateInquiryStatus = async (id, status) => {
  const [result] = await pool.query(
    'UPDATE inquiries SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows;
};

export const deleteInquiry = async (id) => {
  const [result] = await pool.query('DELETE FROM inquiries WHERE id = ?', [id]);
  return result.affectedRows;
};
