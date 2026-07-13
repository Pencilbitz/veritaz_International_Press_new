import db from '../config/db.js';

export const getAllEvents = async () => {
  const [rows] = await db.query('SELECT * FROM events ORDER BY date ASC');
  return rows;
};

export const getEventById = async (id) => {
  const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
  return rows[0];
};

export const createEvent = async (data) => {
  const fields = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  const query = `INSERT INTO events (${fields}) VALUES (${placeholders})`;
  const [result] = await db.query(query, values);
  return result.insertId;
};

export const updateEvent = async (id, data) => {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), id];

  const query = `UPDATE events SET ${fields} WHERE id = ?`;
  const [result] = await db.query(query, values);
  return result.affectedRows;
};

export const deleteEvent = async (id) => {
  const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
  return result.affectedRows;
};

export const deleteMultipleEvents = async (ids) => {
  if (!ids || ids.length === 0) return 0;
  const [result] = await db.query('DELETE FROM events WHERE id IN (?)', [ids]);
  return result.affectedRows;
};
