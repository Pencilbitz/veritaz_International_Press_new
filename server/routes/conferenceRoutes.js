import express from 'express';
import { 
  getConferences, 
  getConference, 
  createConference, 
  updateConference, 
  deleteConference 
} from '../controllers/conferenceController.js';

const router = express.Router();

router.get('/', getConferences);
router.get('/:id', getConference);
router.post('/', createConference);
router.put('/:id', updateConference);
router.delete('/:id', deleteConference);

export default router;
