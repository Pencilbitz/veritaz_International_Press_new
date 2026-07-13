import db from '../config/db.js';

export const getAllConferences = async () => {
  const [rows] = await db.query('SELECT * FROM conferences');
  return rows;
};

export const getConferenceById = async (id) => {
  const [rows] = await db.query('SELECT * FROM conferences WHERE id = ?', [id]);
  return rows[0];
};

// exact database column layout mapping
export const allowedFields = [
  'id', 'conferenceCategory', 'conferencename', 'conferencetitle', 'isbn', 
  'type', 'about', 'dates', 'conferencestatus', 'conferencesecurity', 
  'conferencevalidity', 'registerlink', 'poster', 'brochuredownload', 
  'proceedingsdownload', 'listenerparticipation', 'certificatesdownload', 
  'topics', 'fees', 'bankdetails', 'speakers', 'organizingcommittee', 
  'advisorycommittee', 'globalexperts', 'contact'
];

export const createConference = async (data) => {
  const filteredData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      if (data[field] === '' || data[field] === null) {
        filteredData[field] = null;
      } else {
        filteredData[field] = typeof data[field] === 'object' 
          ? JSON.stringify(data[field]) 
          : data[field];
      }
    }
  });

  const keys = Object.keys(filteredData);
  if (keys.length === 0) throw new Error("No valid fields provided for insertion");

  const fields = keys.join(', ');
  const placeholders = keys.map(() => '?').join(', ');
  const values = Object.values(filteredData);

  const query = `INSERT INTO conferences (${fields}) VALUES (${placeholders})`;
  const [result] = await db.query(query, values);
  return result.insertId;
};

export const updateConference = async (id, data) => {
  const filteredData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      if (data[field] === '' || data[field] === null) {
        filteredData[field] = null;
      } else {
        filteredData[field] = typeof data[field] === 'object' 
          ? JSON.stringify(data[field]) 
          : data[field];
      }
    }
  });

  const keys = Object.keys(filteredData);
  if (keys.length === 0) return 0;

  const fields = keys.map(key => `${key} = ?`).join(', ');
  const values = Object.values(filteredData);

  const query = `UPDATE conferences SET ${fields} WHERE id = ?`;
  const [result] = await db.query(query, [...values, id]);
  return result.affectedRows;
};

export const deleteConference = async (id) => {
  const [result] = await db.query('DELETE FROM conferences WHERE id = ?', [id]);
  return result.affectedRows;
};