import React, { useState, useEffect } from 'react';
import { MessageCircle, Edit3, Trash2, Send, Book, Users, Calendar, Heart, ArrowLeft } from 'lucide-react';
import { API_URL } from "../../api.js";

const BookClubForum = () => {
  // Books data from backend
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBook, setSelectedBook] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [currentUser] = useState({
    id: 1,
    name: "Nelson Beaudouin",
    avatar: "NB",
    color: "bg-purple-500"
  });

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/books`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Load comments for selected book
  useEffect(() => {
    if (selectedBook) {
      const fetchComments = async () => {
        try {
          const response = await fetch(`${API_URL}/comments/${selectedBook._id}`);
          if (response.ok) {
            const data = await response.json();
            setComments(prev => ({ ...prev, [selectedBook._id]: data }));
          }
        } catch (err) {
          console.error("Failed to load comments", err);
        }
      };

      fetchComments();
    }
  }, [selectedBook]);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const addComment = async (bookId) => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have authentication
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: bookId,
          text: newComment.trim()
        })
      });

      const result = await response.json();
      if (response.ok) {
          const newComment = result.comment || result;

          if (!newComment || !newComment._id || !newComment.text) {
            console.warn("Comment format not valid:", newComment);
            return;
          }
        // Add the new comment to the state
        setComments(prev => ({
          ...prev,
          [bookId]: [newComment, ...(prev[bookId] || [])]
        }));
        setNewComment('');
      } else {
        console.error("Failed to post comment:", result.message);
        alert("Failed to post comment. Please try again.");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Error posting comment. Please check your connection.");
    }
  };

  const deleteComment = async (bookId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
           'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setComments(prev => ({
          ...prev,
          [bookId]: prev[bookId].filter(comment => comment.id !== commentId)
        }));
      } else {
        console.error("Failed to delete comment");
        alert("Failed to delete comment. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Error deleting comment. Please check your connection.");
    }
  };

  const startEdit = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  const saveEdit = async (bookId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
           'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: editText
        })
      });

      if (response.ok) {
        setComments(prev => ({
          ...prev,
          [bookId]: prev[bookId].map(comment =>
            comment.id === commentId
              ? { ...comment, text: editText, edited: true }
              : comment
          )
        }));
        setEditingComment(null);
        setEditText('');
      } else {
        console.error("Failed to update comment");
        alert("Failed to update comment. Please try again.");
      }
    } catch (err) {
      console.error("Error updating comment:", err);
      alert("Error updating comment. Please check your connection.");
    }
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const likeComment = (bookId, commentId) => {
    setComments(prev => ({
      ...prev,
      [bookId]: prev[bookId].map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    }));
  };

  // Book selection view
  if (!selectedBook) {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">📚 IUC University Book Club Forum</h1>
              <p className="text-gray-600 text-lg">Join the discussion and share your thoughts on our current reads</p>
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-gray-600">Loading books...</span>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-100 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">📚 IUC University Book Club Forum</h1>
              <p className="text-gray-600 text-lg">Join the discussion and share your thoughts on our current reads</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">📚 IUC University Book Club Forum</h1>
            <p className="text-gray-600 text-lg">Join the discussion and share your thoughts on our current reads</p>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No books available</h3>
              <p className="text-gray-500">Check back later for new book discussions!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map(book => (
                <div
                  key={book._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => setSelectedBook(book)}
                >
                  <div className={`h-48 ${book.coverColor || 'bg-gradient-to-br from-blue-500 to-purple-600'} rounded-t-2xl flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-yellow-200 bg-opacity-20"></div>
                    <Book className="text-white w-16 h-16 z-10" />
                    <div className="absolute bottom-4 left-4 text-slate-400 z-10">
                      <h3 className="font-bold text-lg leading-tight">{book.title}</h3>
                      <p className="text-sm opacity-90">{book.author}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{comments[book._id]?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{[...new Set((comments[book._id] || []).map(c => c.userId))].length}</span>
                        </div>
                      </div>
                    </div>
                    
                    {book.readingDeadline && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Due: {new Date(book.readingDeadline).toLocaleDateString()}</span>
                      </div>
                    )}

                    <button className="w-full bg-gradient-to-r from-green-500 to-yellow-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                      Join Discussion
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Book discussion view
  const bookComments = comments[selectedBook._id] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setSelectedBook(null)}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Books</span>
          </button>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className={`w-20 h-28 ${selectedBook.coverColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Book className="text-white w-8 h-8" />
              </div>
              <div className="flex-grow">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedBook.title}</h1>
                <p className="text-gray-600 mb-4">by {selectedBook.author}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{bookComments.length} {bookComments.length === 1 ? 'comment' : 'comments'}</span>

                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{[...new Set(bookComments.map(c => c.userId))].length} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(selectedBook.readingDeadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Comment Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-start space-x-4">
            <div className={`w-10 h-10 ${currentUser.color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
              {currentUser.avatar}
            </div>
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this book..."
                className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows="3"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => addComment(selectedBook._id)}
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {bookComments.map(comment => (
            <div key={comment.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 ${comment.userColor} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                  {comment.userAvatar}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-800">{comment.userName}</span>
                    <span className="text-gray-500 text-sm">{formatTimestamp(comment.timestamp)}</span>
                    {comment.edited && <span className="text-gray-400 text-xs">(edited)</span>}
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        rows="3"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => saveEdit(selectedBook._id, comment.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 mb-3 leading-relaxed">{comment.text}</p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => likeComment(selectedBook._id, comment.id)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{comment.likes}</span>
                        </button>
                        
                        {comment.userId === currentUser.id && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEdit(comment)}
                              className="text-gray-500 hover:text-blue-600 transition-colors"
                              title="Edit comment"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteComment(selectedBook._id, comment.id)}
                              className="text-gray-500 hover:text-red-600 transition-colors"
                              title="Delete comment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {bookComments.length === 0 && (
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No discussions yet</h3>
              <p className="text-gray-500">Be the first to share your thoughts about this book!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookClubForum;