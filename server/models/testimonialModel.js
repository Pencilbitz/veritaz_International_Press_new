import db from '../config/db.js';

export const getAllTestimonials = async () => {
  const [rows] = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC');
  return rows;
};

export const getTestimonialById = async (id) => {
  const [rows] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);
  return rows[0];
};

export const createTestimonial = async (data) => {
  const fields = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  const query = `INSERT INTO testimonials (${fields}) VALUES (${placeholders})`;
  const [result] = await db.query(query, values);
  return result.insertId;
};

export const updateTestimonial = async (id, data) => {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), id];

  const query = `UPDATE testimonials SET ${fields} WHERE id = ?`;
  const [result] = await db.query(query, values);
  return result.affectedRows;
};

export const deleteTestimonial = async (id) => {
  const [result] = await db.query('DELETE FROM testimonials WHERE id = ?', [id]);
  return result.affectedRows;
};
