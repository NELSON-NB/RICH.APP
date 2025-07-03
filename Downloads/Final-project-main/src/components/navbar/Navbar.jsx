import React, { useState } from 'react'
import { BookOpen, Users, Calendar, Star, MessageCircle, Coffee, Award, ArrowRight, Menu, X, Heart, Quote, LogOut, User } from 'lucide-react';
import ProfileInfo from '../cards/ProfileInfo'
import { Link, useNavigate } from 'react-router'
import Searchbar from '../search/Searchbar'
import { FaBars, FaFacebookMessenger, FaSquareFacebook } from 'react-icons/fa6'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // You can get this from your auth context/state
  const navigate = useNavigate();
  
  // Mock user data - replace with actual user data from your auth system
  const user = {
    name: "Nelson Beaudouin",
    email: "ngoufack@gmail.com",
    avatar: "/src/assets/user-avatar.png" // fallback to default if no avatar
  };

  const handleLogout = () => {
    // Clear user session/token from localStorage or your auth system
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Update login state
    setIsLoggedIn(false);
    
    // Close menus
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    
    // Redirect to login page or home
    navigate('/'); // or wherever you want to redirect after logout
    
    // Optional: Show logout success message
    // toast.success('Logged out successfully');
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    navigate('/dashboard');
  };
  
  return (
    <>
      <div>
        <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <img src="/src/assets/IUC.jpg" alt="" className='h-14 w-14'/>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                    IUC BOOK CLUB
                  </h1>
                  <p className="text-xs text-gray-600">IUC Book Club Community</p>
                </div>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <button className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer">
                  <Link to={'/home'}>Home</Link>
                </button>
                <button className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer">
                  <Link to={'/booklist'}>Current Books</Link>
                </button>
                <button className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer">
                  <Link to={'/events'}>Events</Link>
                </button>
                <a href="#about" className="text-gray-700 hover:text-green-600 font-medium transition-colors">About</a>
                
                {/* User Authentication Section */}
                {isLoggedIn ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <button 
                          onClick={handleProfileClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button className="bg-gradient-to-r from-green-600 to-yellow-200 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    <Link to={'/jointclub'}>Join Us</Link>
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
                <button className="block px-4 py-2 text-gray-700 font-medium transition-colors hover:bg-amber-50 cursor-pointer rounded-lg">
                  <Link to={'/'}>Home</Link>
                </button>
                <button className="block px-4 py-2 text-gray-700 font-medium transition-colors hover:bg-amber-50 cursor-pointer rounded-lg">
                  <Link to={'/booklist'}>Current Books</Link>
                </button>
                <button className="block px-4 py-2 text-gray-700 font-medium transition-colors hover:bg-amber-50 cursor-pointer rounded-lg">
                  <Link to={'/events'}>Events</Link>
                </button>
                <a href="#about" className="block px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg">About</a>
                
                {/* Mobile User Section */}
                {isLoggedIn ? (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button 
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button className="w-full text-left px-4 py-2 bg-gradient-to-r from-green-600 to-yellow-200 text-white rounded-lg font-semibold">
                    <Link to={'/jointclub'}>Join Us</Link>
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}

export default Navbar