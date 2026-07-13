import pool from '../config/db.js';

export const getAllTeamMembers = async () => {
  const [rows] = await pool.query('SELECT * FROM team_contacts ORDER BY created_at DESC');
  return rows;
};

export const getTeamMemberById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM team_contacts WHERE id = ?', [id]);
  return rows[0];
};

export const createTeamMember = async (data) => {
  const { name, designation, phone, email, photo } = data;
  const [result] = await pool.query(
    'INSERT INTO team_contacts (name, designation, phone, email, photo) VALUES (?, ?, ?, ?, ?)',
    [name, designation, phone, email, photo]
  );
  return result.insertId;
};

export const updateTeamMember = async (id, data) => {
  const { name, designation, phone, email, photo } = data;
  const [result] = await pool.query(
    'UPDATE team_contacts SET name = ?, designation = ?, phone = ?, email = ?, photo = ? WHERE id = ?',
    [name, designation, phone, email, photo, id]
  );
  return result.affectedRows;
};

export const deleteTeamMember = async (id) => {
  const [result] = await pool.query('DELETE FROM team_contacts WHERE id = ?', [id]);
  return result.affectedRows;
};
