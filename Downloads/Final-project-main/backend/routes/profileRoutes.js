import express from 'express';
import multer from 'multer';
import { uploadImage, updateImage, removeImage, getUserImage, updateProfile, getProfile } from '../controllers/profileController.js';
import userAuth from '../middleware/userAuth.js';
import { uploadConfig } from '../config/uploadConfig.js';

const profileRouter = express.Router();
const upload = multer(uploadConfig);

// Get user profile image
profileRouter.get('/image', userAuth, getUserImage);

// Upload new profile image
profileRouter.post('/upload', userAuth, upload.single('profileImage'), uploadImage);

// Update existing profile image
profileRouter.put('/update', userAuth, upload.single('profileImage'), updateImage);

// Remove profile image
profileRouter.delete('/remove', userAuth, removeImage);

// Get user profile (name, email, image)
profileRouter.get('/profile', userAuth, getProfile);

// Update user profile (name & email)
profileRouter.put('/profile', userAuth, updateProfile);

// Upload/update profile image
profileRouter.put('/profile-image', userAuth, upload.single('profileImage'), updateProfile);


export default profileRouter;