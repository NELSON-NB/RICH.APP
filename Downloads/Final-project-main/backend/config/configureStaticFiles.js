import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure and export static file middleware
export const configureStaticFiles = (app) => {
    const uploadsDirectory = path.join(__dirname, '../uploads');
    app.use('/uploads', express.static(uploadsDirectory));
};
  
 