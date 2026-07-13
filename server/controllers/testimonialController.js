import * as testimonialModel from '../models/testimonialModel.js';

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel.getAllTestimonials();
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Server error fetching testimonials' });
  }
};

export const getTestimonial = async (req, res) => {
  try {
    const testimonial = await testimonialModel.getTestimonialById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Server error fetching testimonial' });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const newId = await testimonialModel.createTestimonial(req.body);
    res.status(201).json({ message: 'Testimonial created successfully', id: newId });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Server error creating testimonial' });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const affectedRows = await testimonialModel.updateTestimonial(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ message: 'Testimonial updated successfully' });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Server error updating testimonial' });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const affectedRows = await testimonialModel.deleteTestimonial(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Server error deleting testimonial' });
  }
};
