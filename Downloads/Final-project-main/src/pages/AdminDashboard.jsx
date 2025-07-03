import React, { useState, useEffect } from 'react';

import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Book, 
  Users, 
  MessageCircle, 
  Calendar,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { API_URL } from '../api.js';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [currentView, setCurrentView] = useState('dashboard');
  

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    pages: '',
    publishedYear: '',
    isbn: '',
    coverColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
    readingDeadline: '',
    status: 'upcoming'
  });

  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Biography', 'History', 'Self-Help'];
  const coverColors = [
    'bg-gradient-to-br from-blue-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-red-500',
    'bg-gradient-to-br from-green-500 to-teal-600',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
    'bg-gradient-to-br from-purple-500 to-indigo-600',
    'bg-gradient-to-br from-cyan-500 to-blue-500',
    'bg-gradient-to-br from-rose-500 to-pink-600',
    'bg-gradient-to-br from-emerald-500 to-green-600'
  ];

  // Fetch books from backend on mount

 
    

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error('Failed to fetch books');
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };
    fetchBooks();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      genre: '',
      description: '',
      pages: '',
      publishedYear: '',
      isbn: '',
      coverColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
      readingDeadline: '',
      status: 'upcoming'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addBook = async () => {
    if (!formData.title || !formData.author) {
      alert('Please fill in required fields (Title and Author)');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Failed to add book');
        return;
      }

      const newBook = await res.json();
      setBooks(prev => [...prev, newBook]);
      setIsAddingBook(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add book', error);
      alert('Failed to add book, see console for details.');
    }
  };

  const startEdit = (book) => {
    setEditingBook(book._id || book.id);  // depends on backend field (_id or id)
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description || '',
      pages: book.pages?.toString() || '',
      publishedYear: book.publishedYear?.toString() || '',
      isbn: book.isbn || '',
      coverColor: book.coverColor || 'bg-gradient-to-br from-blue-500 to-purple-600',
      readingDeadline: book.readingDeadline || '',
      status: book.status || 'upcoming'
    });
  };

  const saveEdit = async () => {
    if (!formData.title || !formData.author) {
      alert('Please fill in required fields (Title and Author)');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/books/${editingBook}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Failed to update book');
        return;
      }

      const updatedBook = await res.json();
      setBooks(prev => prev.map(book => (book._id === editingBook || book.id === editingBook) ? updatedBook : book));
      setEditingBook(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update book', error);
      alert('Failed to update book, see console for details.');
    }
  };

const deleteBook = async (bookId) => {
  if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in as an admin to delete books.');
      return;
    }

    const res = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(`Failed to delete book: ${errorData.message || 'Unknown error'}`);
      return;
    }

    // Update frontend state
    setBooks(prev => prev.filter(book => (book._id || book.id) !== bookId));
  } catch (error) {
    console.error('Failed to delete book', error);
    alert('Failed to delete book, see console for details.');
  }
};

  const cancelEdit = () => {
    setEditingBook(null);
    setIsAddingBook(false);
    resetForm();
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre === 'all' || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'current': return '📖';
      case 'upcoming': return '⏳';
      case 'completed': return '✅';
      default: return '📚';
    }
  };

  // Dashboard Statistics
  const stats = {
    totalBooks: books.length,
    currentBooks: books.filter(b => b.status === 'current').length,
    upcomingBooks: books.filter(b => b.status === 'upcoming').length,
    completedBooks: books.filter(b => b.status === 'completed').length,
    totalMembers: Math.max(...books.map(b => b.memberCount || 0), 0),
    totalDiscussions: books.reduce((sum, b) => sum + (b.discussionCount || 0), 0)
  };

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Admin Dashboard</h1>
              <p className="text-gray-600">Manage your university book club</p>
            </div>
            <button
              onClick={() => setCurrentView('books')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Book className="w-5 h-5" />
              <span>Manage Books</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Books</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalBooks}</p>
                </div>
                <Book className="w-12 h-12 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Readers</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalMembers}</p>
                </div>
                <Users className="w-12 h-12 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Discussions</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalDiscussions}</p>
                </div>
                <MessageCircle className="w-12 h-12 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Current Books</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.currentBooks}</p>
                </div>
                <BarChart3 className="w-12 h-12 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Status Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-4xl mb-2">📖</div>
                <h3 className="font-semibold text-gray-800">Current Reading</h3>
                <p className="text-2xl font-bold text-green-600">{stats.currentBooks}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-4xl mb-2">⏳</div>
                <h3 className="font-semibold text-gray-800">Upcoming</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.upcomingBooks}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="font-semibold text-gray-800">Completed</h3>
                <p className="text-2xl font-bold text-gray-600">{stats.completedBooks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Dashboard
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Book Management</h1>
              <p className="text-gray-600">Add, edit, and manage your book collection</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingBook(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Book</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="all">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {(isAddingBook || editingBook) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="current">Current Reading</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Number of pages"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Published Year</label>
                  <input
                    type="number"
                    name="publishedYear"
                    value={formData.publishedYear}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Publication year"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="ISBN number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reading Deadline</label>
                  <input
                    type="date"
                    name="readingDeadline"
                    value={formData.readingDeadline}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Brief description of the book"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Color</label>
                <div className="grid grid-cols-4 gap-3">
                  {coverColors.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, coverColor: color }))}
                      className={`h-12 rounded-lg ${color} ${formData.coverColor === color ? 'ring-4 ring-blue-500' : ''} transition-all`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-8 pt-6 border-t">
                <button
                  onClick={editingBook ? saveEdit : addBook}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingBook ? 'Save Changes' : 'Add Book'}</span>
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div key={book._id || book.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className={`h-48 ${book.coverColor} rounded-t-2xl flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-yellow-200 t bg-opacity-20"></div>
                <Book className=" text-white w-16 h-16 z-10" />
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                    {getStatusIcon(book.status)} {book.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white z-10">
                  <h3 className="font-bold text-lg leading-tight">{book.title}</h3>
                  <p className="text-sm opacity-90">{book.author}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <span>{book.genre}</span>
                  <span>{book.pages} pages</span>
                </div>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{book.discussionCount || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{book.memberCount || 0}</span>
                  </div>
                </div>

                {book.readingDeadline && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Due: {new Date(book.readingDeadline).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(book)}
                    className="flex-1 bg-blue-400 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteBook(book._id || book.id)}
                    className="flex-1 bg-red-400 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">
              {searchTerm || filterGenre !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first book to the collection'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
