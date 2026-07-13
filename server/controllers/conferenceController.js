import * as conferenceModel from '../models/conferenceModel.js';

// Helper function to safely parse potential JSON fields coming out of the DB
const parseConferenceFields = (conf) => {
  if (!conf) return conf;
  
  return {
    ...conf,
    topics: typeof conf.topics === 'string' ? JSON.parse(conf.topics || '[]') : conf.topics,
    dates: typeof conf.dates === 'string' ? JSON.parse(conf.dates || '{}') : conf.dates,
    fees: typeof conf.fees === 'string' ? JSON.parse(conf.fees || '{}') : conf.fees,
    bankdetails: typeof conf.bankdetails === 'string' ? JSON.parse(conf.bankdetails || '{}') : conf.bankdetails,
    speakers: typeof conf.speakers === 'string' ? JSON.parse(conf.speakers || '[]') : conf.speakers,
    organizingcommittee: typeof conf.organizingcommittee === 'string' ? JSON.parse(conf.organizingcommittee || '[]') : conf.organizingcommittee,
    advisorycommittee: typeof conf.advisorycommittee === 'string' ? JSON.parse(conf.advisorycommittee || '[]') : conf.advisorycommittee,
    globalexperts: typeof conf.globalexperts === 'string' ? JSON.parse(conf.globalexperts || '[]') : conf.globalexperts,
  };
};

export const getConferences = async (req, res) => {
  try {
    const conferences = await conferenceModel.getAllConferences();
    const parsedConferences = conferences.map(conf => parseConferenceFields(conf));
    res.status(200).json(parsedConferences);
  } catch (error) {
    console.error('Error fetching conferences:', error);
    res.status(500).json({ error: 'Server error fetching conferences' });
  }
};

export const getConference = async (req, res) => {
  try {
    let conference = await conferenceModel.getConferenceById(req.params.id);
    if (!conference) {
      return res.status(404).json({ message: 'Conference not found' });
    }

    res.status(200).json(parseConferenceFields(conference));
  } catch (error) {
    console.error('Error fetching conference:', error);
    res.status(500).json({ error: 'Server error fetching conference' });
  }
};

export const createConference = async (req, res) => {
  try {
    const newId = await conferenceModel.createConference(req.body);
    res.status(201).json({ message: 'Conference created successfully', id: newId });
  } catch (error) {
    console.error('Error creating conference:', error);
    // Dynamic import fallback for logging
    import('fs').then(mod => mod.default.writeFileSync('error.log', error.stack || error.message)).catch(() => {});
    res.status(500).json({ error: 'Server error creating conference', details: error.message });
  }
};

export const updateConference = async (req, res) => {
  try {
    const affectedRows = await conferenceModel.updateConference(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Conference not found' });
    }
    res.status(200).json({ message: 'Conference updated successfully' });
  } catch (error) {
    console.error('Error updating conference:', error);
    res.status(500).json({ error: 'Server error updating conference' });
  }
};

export const deleteConference = async (req, res) => {
  try {
    const affectedRows = await conferenceModel.deleteConference(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Conference not found' });
    }
    res.status(200).json({ message: 'Conference deleted successfully' });
  } catch (error) {
    console.error('Error deleting conference:', error);
    res.status(500).json({ error: 'Server error deleting conference' });
  }
};