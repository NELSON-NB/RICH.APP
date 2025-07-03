import React, { useState, useEffect } from 'react'
import { BookOpen, Users, Calendar, Star, MessageCircle, Coffee, Award, ArrowRight, Menu, X, Heart, Quote } from 'lucide-react';
import { Link } from 'react-router';




const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const currentBooks = [
    {
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      genre: "Contemporary Fiction",
      rating: 4.8,
      description: "A captivating novel about a reclusive Hollywood icon who finally decides to tell her story.",
      discussionDate: "2025-06-25"
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      genre: "Self-Help",
      rating: 4.9,
      description: "An easy & proven way to build good habits & break bad ones.",
      discussionDate: "2025-07-15"
    },
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      genre: "Philosophy Fiction",
      rating: 4.7,
      description: "A novel about all the choices that go into a life well lived.",
      discussionDate: "2025-08-10"
    }
  ];

  const upcomingEvents = [
    {
      title: "Monthly Book Discussion",
      date: "June 25, 2025",
      time: "7:00 PM",
      location: "Central Library - Room 204",
      type: "discussion"
    },
    {
      title: "Author Meet & Greet",
      date: "July 8, 2025", 
      time: "6:30 PM",
      location: "BookHaven Café",
      type: "special"
    },
    {
      title: "Summer Reading Kickoff",
      date: "July 20, 2025",
      time: "3:00 PM", 
      location: "Riverside Park Pavilion",
      type: "social"
    }
  ];

  const testimonials = [
    {
      name: "Nelson Beaudouin",
      quote: "This book club has completely transformed my reading habits. I've discovered so many amazing books I never would have picked up on my own!",
      role: "Member since 2022"
    },
    {
      name: "James Rodriguez",
      quote: "The discussions are incredibly thoughtful and I love how everyone brings different perspectives. It's like having a literary salon in our own town.",
      role: "Member since 2021"
    },
    {
      name: "Emily Chen",
      quote: "Not only have I read more books than ever before, but I've also made some wonderful friendships. This community is truly special.",
      role: "Member since 2023"
    }
  ];

  const stats = [
    { number: "150+", label: "Active Members", icon: Users },
    { number: "48", label: "Books Read This Year", icon: BookOpen },
    { number: "4.9", label: "Average Rating", icon: Star },
    { number: "12", label: "Monthly Events", icon: Calendar }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBookIndex((prev) => (prev + 1) % currentBooks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  
  
  
  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <img src="/src/assets/IUC.jpg" alt="" className='h-14 w-14' />
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
              <a href="#home" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Home</a>
              <button className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer"><Link to={'/booklist'}>Current Books</Link></button>
              <button className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer"><Link to={'/events'}>Events</Link></button>
              <button className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer"><Link to={'/about'}>About</Link></button>
              
              
              
              <button 
                
                className="bg-gradient-to-r from-green-600 to-yellow-200 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Link to={'/jointclub'}>Join Us</Link>
              </button>
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
              <a href="#home" className="block px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg">Home</a>
              <button className="block px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg cursor-pointer"><Link to={'/booklist'}>Current Books</Link></button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg cursor-pointer"><Link to={'/events'}>Events</Link></button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg cursor-pointer"><Link to={'/about'}>About</Link></button>
              <button 
                
                className="w-full text-left px-4 py-2 bg-gradient-to-r from-green-600 to-yellow-200 text-white rounded-lg font-semibold"
              >
                <Link to={'/jointclub'}>Join Us</Link>
              </button>
            </div>
          )}
          
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Welcome to
                  <span className="block bg-gradient-to-r from-green-600 via-yellow-200 to-orange-200 bg-clip-text text-transparent">
                    IUC BOOK CLUB
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Where every page tells a story and every story builds a community. Join fellow book lovers in exploring literature, sharing insights, and creating lasting friendships.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Link to={'/chats'}>Join Chat</Link>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border-2 border-amber-600 text-amber-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-50 transition-colors">
                  Browse Books
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-br from-amber-200 to-orange-300 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-amber-700" />
                    </div>
                    <div className="h-24 bg-gradient-to-br from-red-200 to-pink-300 rounded-lg"></div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="h-24 bg-gradient-to-br from-orange-200 to-red-300 rounded-lg"></div>
                    <div className="h-32 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-lg flex items-center justify-center">
                      <Users className="h-12 w-12 text-amber-800" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Books Carousel */}
      <section id="books" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Currently Reading</h2>
            <p className="text-xl text-gray-600">Discover our featured selections and join the conversation</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentBookIndex * 100}%)` }}
              >
                {currentBooks.map((book, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-8 lg:p-12">
                      <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="order-2 lg:order-1 space-y-6">
                          <div>
                            <div className="inline-block bg-amber-200 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                              {book.genre}
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{book.title}</h3>
                            <p className="text-xl text-gray-700 mb-4">by {book.author}</p>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-5 w-5 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-gray-600 font-semibold">{book.rating}/5</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6">{book.description}</p>
                          </div>
                          
                          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-5 w-5 text-amber-600" />
                              <span className="font-semibold text-gray-900">Next Discussion</span>
                            </div>
                            <p className="text-gray-700">{new Date(book.discussionDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</p>
                          </div>
                        </div>

                        <div className="order-1 lg:order-2 flex justify-center">
                          <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl"></div>
                            <img 
                              src={book.cover} 
                              alt={book.title}
                              className="relative w-64 h-80 object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 gap-2">
              {currentBooks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBookIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentBookIndex ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Join us for these exciting literary gatherings</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className={`h-2 ${
                  event.type === 'discussion' ? 'bg-blue-500' :
                  event.type === 'special' ? 'bg-purple-500' : 'bg-green-500'
                }`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`p-2 rounded-lg ${
                      event.type === 'discussion' ? 'bg-blue-100' :
                      event.type === 'special' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {event.type === 'discussion' ? <MessageCircle className="h-5 w-5 text-blue-600" /> :
                       event.type === 'special' ? <Award className="h-5 w-5 text-purple-600" /> :
                       <Coffee className="h-5 w-5 text-green-600" />}
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      event.type === 'discussion' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'special' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {event.type === 'discussion' ? 'Discussion' :
                       event.type === 'special' ? 'Special Event' : 'Social'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <button className="mt-6 w-full bg-gradient-to-r from-green-600 to-yellow-200 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform group-hover:scale-105 transition-all duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Members Say</h2>
            <p className="text-xl text-gray-600">Hear from the heart of our community</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <Quote className="h-8 w-8 text-amber-600" />
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-yellow-200 to-orange-400">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Turn the Page?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join IUC book club today and become part of a community that celebrates the magic of books. 
            New adventures, lifelong friendships, and countless stories await you.
          </p>
          <button 
            
            className="bg-white text-amber-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <Heart className="h-5 w-5" />
            <Link to={'/jointclub'}>Join Our Book Club</Link>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <img src="/src/assets/IUC.jpg" alt="" className='h-14 w-14' />
                </div>
                <div>
                  <h3 className="text-xl font-bold">IUC Book Club </h3>
                  <p className="text-sm text-gray-400">Book Club Community</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Building connections through literature, one page at a time. Join our community of passionate readers and discover your next favorite book.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <Users className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#books" className="hover:text-white transition-colors">Current Books</a></li>
                <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>iucunivercity@gmail.com</li>
                <li>(+237) 123-BOOK</li>
                <li>123 Library Lane</li>
                <li>Douala, CMR 12345</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 IUC Book Club. Made with ❤️ for book lovers everywhere.</p>
          </div>
        </div>
      </footer>

      {/* Join Modal */}
      {joinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Join IUC Book Club</h2>
                <button 
                  onClick={() => setJoinModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Genre</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Mystery/Thriller</option>
                    <option>Romance</option>
                    <option>Sci-Fi/Fantasy</option>
                    <option>Biography</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">What You'll Get:</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Monthly book selections</li>
                    <li>• Discussion group access</li>
                    <li>• Special author events</li>
                    <li>• Reading recommendations</li>
                    <li>• Community of book lovers</li>
                  </ul>
                </div>
                
                <button 
                  onClick={() => setJoinModalOpen(false)}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Join IUC BookClub
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
      
     
    
      

    </>
  );
};

export default Home