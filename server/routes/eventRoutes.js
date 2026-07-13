import express from 'express';
import { 
  getEvents, 
  getEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  deleteMultipleEvents
} from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', createEvent);
router.post('/bulk-delete', deleteMultipleEvents);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
