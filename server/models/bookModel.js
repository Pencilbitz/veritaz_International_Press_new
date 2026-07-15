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
  console.log("Data received in model:", data);

  // 1. Guard clause: Handle empty data object gracefully
  if (!data || Object.keys(data).length === 0) {
    console.log("Update skipped: No fields provided to update.");
    return 0; // Return 0 affected rows since nothing changed
  }

  const fields = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(", ");

  console.log("Generated fields:", fields);

  const values = [...Object.values(data), id];

  const query = `UPDATE books SET ${fields} WHERE id = ?`;

  console.log("SQL:", query);
  console.log("Values:", values);

  const [result] = await db.query(query, values);
  return result.affectedRows;
};

export const deleteBook = async (id) => {
  const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
  return result.affectedRows;
};
