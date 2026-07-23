import express from 'express';
import { 
  getBooks, 
  getBook, 
  createBook, 
  updateBook, 
  deleteBook 
} from '../controllers/bookController.js';
import { upload } from './uploadRoutes.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', createBook);
router.put('/:id', 
  (req, res, next) => {
    req.params.folder = 'books'; // Sets the upload path to uploads/books
    next();
  },
  upload.fields([
    { name: 'cover1', maxCount: 1 },
    { name: 'cover2', maxCount: 1 }
  ]), 
  updateBook
);
router.delete('/:id', deleteBook);

export default router;
