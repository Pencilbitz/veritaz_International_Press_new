import db from './config/db.js';

async function runMigration() {
  try {
    await db.query(`
      ALTER TABLE conferences 
      ADD COLUMN brochure VARCHAR(500), 
      ADD COLUMN conferenceProceeding VARCHAR(500), 
      ADD COLUMN qrCode VARCHAR(500), 
      ADD COLUMN image VARCHAR(500), 
      ADD COLUMN certificateTracks JSON, 
      ADD COLUMN verificationDetails JSON, 
      ADD COLUMN keynoteSpeakers JSON, 
      ADD COLUMN organizingCommittee JSON, 
      ADD COLUMN advisoryCommittee JSON, 
      ADD COLUMN globalExperts JSON, 
      ADD COLUMN contact JSON
    `);
    console.log('Columns successfully added to DB.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
runMigration();
