import React, { useState, useEffect, useMemo } from 'react';
import { Search, Book, Users, Filter, Star, Clock, User } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { API_URL } from '../api.js';


const BookClubApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
 const [books, setBooks] = useState([]);

      useEffect(() => {
        fetch(`${API_URL}/books`)
          .then(res => res.json())
          .then(data => {
            console.log('Fetched books:', data);
            setBooks(data);
          })
          .catch(err => console.error('Error fetching books:', err));
      }, []);


  
  const genres = [...new Set(books.map(book => book.genre))];
  const difficulties = ['easy', 'medium', 'challenging'];

  const filteredBooks = useMemo(() => {
  return books.filter(book => {
    const title = book.title?.toLowerCase() || '';
    const author = book.author?.toLowerCase() || '';
    const genre = book.genre?.toLowerCase() || '';
    const description = book.description?.toLowerCase() || '';

    const search = searchQuery.toLowerCase();

    const matchesSearch =
      title.includes(search) ||
      author.includes(search) ||
      genre.includes(search) ||
      description.includes(search);

    const matchesGenre = selectedGenre === 'all' || genre === selectedGenre.toLowerCase();
    const matchesDifficulty = selectedDifficulty === 'all' || book.difficulty === selectedDifficulty;

    return matchesSearch && matchesGenre && matchesDifficulty;
  });
}, [searchQuery, selectedGenre, selectedDifficulty, books]);


  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenreColor = (genre) => {
    const colors = {
      'Fiction': 'bg-blue-100 text-blue-800',
      'Non-Fiction': 'bg-purple-100 text-purple-800',
      'Classic': 'bg-amber-100 text-amber-800',
      'Contemporary': 'bg-teal-100 text-teal-800',
      'Memoir': 'bg-pink-100 text-pink-800',
      'Philosophy': 'bg-indigo-100 text-indigo-800',
      'Science': 'bg-cyan-100 text-cyan-800',
      'Self-Help': 'bg-lime-100 text-lime-800',
      'Psychology': 'bg-rose-100 text-rose-800'
    };
    return colors[genre] || 'bg-gray-100 text-gray-800';
  };

  return (
    
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-red-300 to-yellow-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/src/assets/IUC.jpg" alt="" className='h-14 w-14' />
            <h1 className="text-4xl font-bold text-gray-800">IUC University Book Club</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">Discover your next great read for meaningful discussions</p>
          
          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            <div className="bg-white rounded-lg px-6 py-4 shadow-md">
              <div className="text-2xl font-bold text-indigo-600">{books.length}</div>
              <div className="text-sm text-gray-600">Total Books</div>
            </div>
            <div className="bg-white rounded-lg px-6 py-4 shadow-md">
              <div className="text-2xl font-bold text-purple-600">{genres.length}</div>
              <div className="text-sm text-gray-600">Genres</div>
            </div>
            <div className="bg-white rounded-lg px-6 py-4 shadow-md">
              <div className="text-2xl font-bold text-pink-600">{filteredBooks.length}</div>
              <div className="text-sm text-gray-600">Showing</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search books, authors, or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">
                      {book.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <User className="h-4 w-4 mr-1" />
                      <span className="italic">{book.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{book.rating}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenreColor(book.genre)}`}>
                    {book.genre}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(book.difficulty)}`}>
                    {book.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {book.description}
                </p>

                {/* Discussion Topics */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Discussion Topics:</h4>
                  <div className="flex flex-wrap gap-1">
                    {book.discussionTopics.map(topic => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-4">
                    <span>{book.pages} pages</span>
                    <span>© {book.publishYear}</span>
                  </div>
                  <button>
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                    >
                      Read Book
                    </a>
                  </button>
                  
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Users className="h-5 w-5" />
            <span>Built for university book clubs everywhere</span>
          </div>
          
        </div>
       
      </div>
    </div>



 
    </>
  );
};

export default BookClubApp;