import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.query.folder || req.params.folder || 'misc';
    const uploadPath = path.join('uploads', folder);
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\\s+/g, '-')}`);
  }
});

export const upload = multer({ storage });
router.post('/:folder?', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const folder = req.query.folder || req.params.folder || 'misc';
  const folderPath = folder ? `${folder}/` : 'misc/';
  // Return the path that the client can use to access the image
  const filePath = `/uploads/${folderPath}${req.file.filename}`;
  res.status(200).json({ 
    message: 'File uploaded successfully', 
    url: filePath 
  });
});

export default router;
