import * as bookModel from '../models/bookModel.js';

export const getBooks = async (req, res) => {
  try {
    const books = await bookModel.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Server error fetching books' });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await bookModel.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Server error fetching book' });
  }
};

export const createBook = async (req, res) => {
  try {
    const newId = await bookModel.createBook(req.body);
    res.status(201).json({ message: 'Book created successfully', id: newId });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Server error creating book' });
  }
};

export const updateBook = async (req, res) => {
  try {
    // 1. Gather all text fields parsed by Multer
    const updateData = { ...req.body };

    // 2. Gather files if any were uploaded
    if (req.files) {
      if (req.files.cover1) {
        // Construct path format matching your server's static files setup: e.g. "uploads/books/filename.jpg"
        updateData.cover1 = `uploads/books/${req.files.cover1[0].filename}`;
      }
      if (req.files.cover2) {
        updateData.cover2 = `uploads/books/${req.files.cover2[0].filename}`;
      }
    }

    console.log("Parsed update payload:", updateData);

    // 3. Forward the complete payload to the database model
    const affectedRows = await bookModel.updateBook(req.params.id, updateData);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error updating book" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const affectedRows = await bookModel.deleteBook(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Server error deleting book' });
  }
};
