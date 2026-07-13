import express from 'express';
import { 
  getTestimonials, 
  getTestimonial, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '../controllers/testimonialController.js';

const router = express.Router();

router.get('/', getTestimonials);
router.get('/:id', getTestimonial);
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
