import express from 'express';
import * as inquiriesController from '../controllers/inquiriesController.js';

const router = express.Router();

router.get('/', inquiriesController.getInquiries);
router.post('/', inquiriesController.createInquiry);
router.put('/:id/status', inquiriesController.updateInquiryStatus);
router.delete('/:id', inquiriesController.deleteInquiry);

export default router;
