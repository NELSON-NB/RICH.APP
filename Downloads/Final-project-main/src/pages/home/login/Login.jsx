import React, {useState} from 'react'
import { BookOpen, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { API_URL } from '../../../api';



 




const Login = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    favoriteGenre: 'Fiction',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginForm.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(loginForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!loginForm.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = () => {
    const newErrors = {};
    
    if (!signupForm.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!signupForm.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!signupForm.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signupForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!signupForm.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(signupForm.password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (!signupForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!signupForm.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    ;

     
    if (!validateLoginForm()) return;
    
    setIsLoading(true);
    setMessage('');
    
     try {
      const res = await axios.post(`${API_URL}/login`, {
      email: loginForm.email,
      password: loginForm.password
    });

    const { token, user } = res.data;
    setMessageType('success');
    setMessage('Login successful! Redirecting...');


    setTimeout(() => {
      if (loginForm.password === "admin237") {
        navigate("/admin"); // special admin password
      } else {
        navigate("/dashboard"); // normal user route
      }
    }, 1500);

    localStorage.setItem('token', token);

    // Save token (for authenticated access)
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userEmail", loginForm.email);

    // Redirect (optional)
    setTimeout(() => {
      // Navigate to dashboard if needed
    }, 1500);
  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.message || "Login failed");
    setMessageType("error");
  } finally {
    setIsLoading(false);
  }
  };

  const handleSignup = async () => {
    if (!validateSignupForm()) return;
    
    setIsLoading(true);
    setMessage('');


     try {
    const res = await axios.post(`${API_URL}/create-account`, {
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      email: signupForm.email,
      phone: signupForm.phone,
      password: signupForm.password,
      favoriteGenre: signupForm.favoriteGenre
    });

    setMessage(res.data.message || "Account created successfully!");
    setMessageType("success");

    // Reset form + switch to login after a delay
    setTimeout(() => {
      setSignupForm({ ...initialSignupState });
      setIsLogin(true);
    }, 2000);

  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.message || "Signup failed");
    setMessageType("error");
  } finally {
    setIsLoading(false);
  }
    
    
  };

  const handleForgotPassword = () => {
    setMessage('Password reset instructions have been sent to your email.');
    setMessageType('info');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setMessage('');
    setMessageType('');
  };

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery/Thriller', 'Romance', 
    'Sci-Fi/Fantasy', 'Biography', 'Historical Fiction', 'Poetry', 'Other'
  ];
 
 
  return (
    <>
     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className=" p-4 rounded-2xl shadow-lg">
              <img src="/src/assets/IUC.jpg" alt="" className='h-30 w-30' />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-yellow-200 bg-clip-text text-transparent mb-2">
            IUC BOOK CLUB
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Welcome back to your literary community' : 'Join our community of book lovers'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                isLogin 
                  ? 'bg-gradient-to-r from-green-600 to-yellow-300 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-green-600 to-yellow-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              messageType === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/50'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/50'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-green-600 hover:text-yellow-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-yellow-200 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Demo Credentials */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <p className="text-sm text-amber-800 font-medium mb-2">Demo Credentials:</p>
                <p className="text-xs text-amber-700">Email: member@pageturners.com</p>
                <p className="text-xs text-amber-700">Password: password123</p>
              </div>
            </div>
          ) : (
            /* Signup Form */
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={signupForm.firstName}
                      onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                        errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/50'
                      }`}
                      placeholder="First name"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                      errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/50'
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/50'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white/50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Genre</label>
                <select
                  value={signupForm.favoriteGenre}
                  onChange={(e) => setSignupForm({...signupForm, favoriteGenre: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 bg-white/50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/50'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/50'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={signupForm.agreeToTerms}
                    onChange={(e) => setSignupForm({...signupForm, agreeToTerms: e.target.checked})}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeToTerms && <p className="text-red-600 text-sm mt-1">{errors.agreeToTerms}</p>}
              </div>

              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-yellow-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Switch Mode Link */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={switchMode}
                className="text-green-600 hover:text-yellow-700 font-semibold"
              >
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; 2025 IUC Book Club. All rights reserved.</p>
        </div>
      </div>
    </div>
    
    
    </>
  )
}

export default Login