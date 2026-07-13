import express from 'express';
import * as teamController from '../controllers/teamController.js';

const router = express.Router();

router.get('/', teamController.getTeamMembers);
router.get('/:id', teamController.getTeamMember);
router.post('/', teamController.createTeamMember);
router.put('/:id', teamController.updateTeamMember);
router.delete('/:id', teamController.deleteTeamMember);

export default router;
