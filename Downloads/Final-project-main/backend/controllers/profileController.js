import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.models.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../uploads/profiles');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Get user's profile image
 */
export const getUserImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.profileImage) {
      return res.status(404).json({ success: false, message: 'No profile image found' });
    }

    return res.status(200).json({
      success: true,
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error('Error fetching profile image:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile image'
    });
  }
};

/**
 * Upload new profile image
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      // Remove uploaded file if user doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If user already has an image, remove it
    if (user.profileImage && user.profileImage.startsWith('/uploads/profiles/')) {
      const oldImagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Ensure the profile image is updated for the specific user
    const imagePath = `/uploads/profiles/${req.file.filename}`;
    user.profileImage = imagePath; // Save the image URL specific to the user
    await user.save();


    return res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      profileImage: imagePath
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    // Remove uploaded file in case of error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while uploading profile image'
    });
  }
};

/**
 * Update existing profile image
 */
export const updateImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      // Remove uploaded file if user doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If user already has an image, remove it
    if (user.profileImage && user.profileImage.startsWith('/uploads/profiles/')) {
      const oldImagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Set the new profile image path
    const imagePath = `/uploads/profiles/${req.file.filename}`;
    user.profileImage = imagePath;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      profileImage: imagePath
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    // Remove uploaded file in case of error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while updating profile image'
    });
  }
};

/**
 * Remove profile image
 */
export const removeImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If user has an image, remove the file
    if (user.profileImage && user.profileImage.startsWith('/uploads/profiles/')) {
      const imagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Remove image reference from user
    user.profileImage = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile image removed successfully'
    });
  } catch (error) {
    console.error('Error removing profile image:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while removing profile image'
    });
  }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { userName, email, bio } = req.body;
        
        // Find user
        let user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Handle profile image upload
        if (req.file) {
            // If user already has a profile image, delete the old one
            if (user.profileImage) {
                const oldImagePath = path.join(__dirname, '../uploads/profile', path.basename(user.profileImage));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            
            // Set new profile image path
            user.profileImage = `/uploads/profile/${req.file.filename}`;
        }
        
        // Update user fields if provided
        if (userName) user.userName = userName;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;
        
        // Save updated user
        await user.save();
        
        // Return updated user without sensitive fields
        const updatedUser = await User.findById(req.user.id).select('-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt');
        
        return res.status(200).json({ success: true, data: updatedUser, message: 'Profile updated successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
