// AuthContext.js - Create this file for global auth state management
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.ACCESS_TOKEN_SECRET || 'http://localhost:8000';

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsLoggedIn(true);
        localStorage.setItem('userData', JSON.stringify(userData.user));
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        setIsLoggedIn(true);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login after successful registration
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        setIsLoggedIn(true);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        await fetch('http://localhost:8000/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUserProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:8000/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('userData', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// authUtils.js - Create this file for API utility functions
export const authAPI = {
  // Set up axios or fetch defaults
  baseURL: process.env.ACCESS_TOKEN_SECRETL || 'http://localhost:8000',

  // Get auth headers
  getAuthHeaders: () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  },

  // Make authenticated requests
  makeAuthenticatedRequest: async (url, options = {}) => {
    const response = await fetch(`${authAPI.baseURL}${url}`, {
      ...options,
      headers: {
        ...authAPI.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/';
      return null;
    }

    return response;
  },

  // User profile endpoints
  getUserProfile: async () => {
    const response = await authAPI.makeAuthenticatedRequest('/dashboard');
    return response ? await response.json() : null;
  },

  updateUserProfile: async (profileData) => {
    const response = await authAPI.makeAuthenticatedRequest('/dashboard', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response ? await response.json() : null;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${authAPI.baseURL}/users/profile/picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return response ? await response.json() : null;
  },
};

// Backend API Routes Example (for your reference)
/*

Expected Backend Endpoints:

POST /api/auth/register
Body: { email, password, firstName, lastName, username }
Response: { success: true, token: "jwt_token", user: {...} }

POST /api/auth/login  
Body: { email, password }
Response: { success: true, token: "jwt_token", user: {...} }

GET /api/auth/verify
Headers: { Authorization: "Bearer jwt_token" }
Response: { success: true, user: {...} }

POST /api/auth/logout
Headers: { Authorization: "Bearer jwt_token" }
Response: { success: true, message: "Logged out successfully" }

GET /api/auth/me (alternative to verify)
Headers: { Authorization: "Bearer jwt_token" }
Response: { success: true, user: {...} }

PUT /api/users/profile
Headers: { Authorization: "Bearer jwt_token" }
Body: { firstName, lastName, email, bio, etc. }
Response: { success: true, user: {...} }

POST /api/users/profile/picture
Headers: { Authorization: "Bearer jwt_token" }
Body: FormData with file
Response: { success: true, profilePicture: "url", user: {...} }

Expected User Object Structure:
{
  id: "user_id",
  email: "user@example.com", 
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  profilePicture: "https://example.com/profile.jpg",
  bio: "User bio",
  joinedAt: "2024-01-01T00:00:00.000Z",
  isActive: true
}

*/