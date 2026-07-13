import express from 'express';
import { importData } from '../controllers/importController.js';

const router = express.Router();

router.post('/', importData);

export default router;
