import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import eventRouter from './routes/eventRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import cronJobs from './config/cronJob.js';
import profileRouter from './routes/profileRoutes.js';
import { configureStaticFiles } from './config/configureStaticFiles.js';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3001", // MUST MATCH frontend URL
    credentials: true,  // Allow credentials (cookies)
}));

// Configure static file serving
configureStaticFiles(app);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error", err));

app.get("/", (req, res) => {
    res.json({ error: false, message: "Hello Bryan" });
});

app.use('/auth', authRouter);
app.use('/event', eventRouter);
app.use('/admin', adminRouter);
app.use('/profile', profileRouter);
 
console.log("Cron jobs initialized.");

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});