import db from '../config/db.js';

export const getAllBooks = async () => {
  const [rows] = await db.query('SELECT * FROM books ORDER BY created_at DESC');
  return rows;
};

export const getBookById = async (id) => {
  const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
  return rows[0];
};

export const createBook = async (data) => {
  const fields = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  const query = `INSERT INTO books (${fields}) VALUES (${placeholders})`;
  const [result] = await db.query(query, values);
  return result.insertId;
};

export const updateBook = async (id, data) => {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), id];

  const query = `UPDATE books SET ${fields} WHERE id = ?`;
  const [result] = await db.query(query, values);
  return result.affectedRows;
};

export const deleteBook = async (id) => {
  const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
  return result.affectedRows;
};
