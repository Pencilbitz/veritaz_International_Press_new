import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import conferenceRoutes from './routes/conferenceRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import inquiriesRoutes from './routes/inquiriesRoutes.js';
import importRoutes from './routes/importRoutes.js';
import teamRoutes from './routes/teamRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets')));


// Routes
app.use('/api/conferences', conferenceRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/import', importRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/inquiries', inquiriesRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('PencilBitz API Server is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
