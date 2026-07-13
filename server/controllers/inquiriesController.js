import * as inquiriesModel from '../models/inquiriesModel.js';

export const getInquiries = async (req, res) => {
  try {
    const inquiries = await inquiriesModel.getAllInquiries();
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Server error fetching inquiries' });
  }
};

export const createInquiry = async (req, res) => {
  try {
    const newId = await inquiriesModel.createInquiry(req.body);
    res.status(201).json({ message: 'Inquiry submitted successfully', id: newId });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    import('fs').then(fs => fs.writeFileSync('debug.log', JSON.stringify({ error: error.message, body: req.body })));
    res.status(500).json({ error: 'Server error creating inquiry: ' + error.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const affectedRows = await inquiriesModel.updateInquiryStatus(req.params.id, status);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json({ message: 'Inquiry status updated successfully' });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ error: 'Server error updating inquiry status' });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const affectedRows = await inquiriesModel.deleteInquiry(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Server error deleting inquiry' });
  }
};
