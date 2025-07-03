import React, { useState, useEffect } from 'react'
import { MessageCircle, Heart, Clock, User, Plus, Send, BookOpen, Star } from 'lucide-react';
import Navbar from '../navbar/Navbar';

const Disscustion = () => {
    const [posts, setPosts] = useState([
        {
          id: 1,
          title: "What did you think of the ending of 'The Seven Husbands of Evelyn Hugo'?",
          content: "I just finished reading and I'm still processing that twist! The way Taylor Jenkins Reid revealed Evelyn's true love story was absolutely masterful. What were your thoughts on the ending?",
          author: "Sarah M.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 12,
          comments: [
            {
              id: 1,
              content: "I was completely shocked! I had to go back and reread certain parts with this new perspective. The clues were there all along but so subtly woven in.",
              author: "Mike K.",
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
              likes: 5
            },
            {
              id: 2,
              content: "The ending made me appreciate the entire book on a different level. It's definitely one I want to reread now knowing what I know!",
              author: "Emma L.",
              timestamp: new Date(Date.now() - 30 * 60 * 1000),
              likes: 3
            }
          ],
          category: "Current Read",
          featured: true
        },
        {
          id: 2,
          title: "Book suggestions for next month?",
          content: "Looking for our next book club pick! I'm hoping for something in the mystery/thriller genre. What are your recommendations?",
          author: "Alex R.",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          likes: 8,
          comments: [
            {
              id: 3,
              content: "I highly recommend 'The Thursday Murder Club' by Richard Osman. It's cozy mystery with great characters!",
              author: "Jennifer W.",
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
              likes: 6
            }
          ],
          category: "Suggestions"
        },
        {
          id: 3,
          title: "Character development in 'Educated' - Tara's transformation",
          content: "I'm halfway through Tara Westover's memoir and I'm amazed by her journey. The way she describes her internal conflict between family loyalty and education is so powerful. Anyone else finding this as impactful as I am?",
          author: "David C.",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          likes: 15,
          comments: [],
          category: "Analysis"
        }
      ]);
    
      const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
      const [newComment, setNewComment] = useState({});
      const [showNewPostForm, setShowNewPostForm] = useState(false);
      const [selectedCategory, setSelectedCategory] = useState('All');
    
      const categories = ['All', 'Current Read', 'Suggestions', 'Analysis', 'General', 'Events'];
    
      const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
    
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
      };
    
      const handleCreatePost = () => {
        if (newPost.title.trim() && newPost.content.trim()) {
          const post = {
            id: posts.length + 1,
            title: newPost.title,
            content: newPost.content,
            author: "You",
            timestamp: new Date(),
            likes: 0,
            comments: [],
            category: newPost.category,
            featured: false
          };
          setPosts([post, ...posts]);
          setNewPost({ title: '', content: '', category: 'General' });
          setShowNewPostForm(false);
        }
      };
    
      const handleAddComment = (postId) => {
        const commentText = newComment[postId];
        if (commentText && commentText.trim()) {
          const comment = {
            id: Date.now(),
            content: commentText,
            author: "You",
            timestamp: new Date(),
            likes: 0
          };
          
          setPosts(posts.map(post => 
            post.id === postId 
              ? { ...post, comments: [...post.comments, comment] }
              : post
          ));
          
          setNewComment({ ...newComment, [postId]: '' });
        }
      };
    
      const handleLikePost = (postId) => {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes + 1 }
            : post
        ));
      };
    
      const handleLikeComment = (postId, commentId) => {
        setPosts(posts.map(post => 
          post.id === postId 
            ? {
                ...post, 
                comments: post.comments.map(comment =>
                  comment.id === commentId
                    ? { ...comment, likes: comment.likes + 1 }
                    : comment
                )
              }
            : post
        ));
      };
    
      const filteredPosts = selectedCategory === 'All' 
        ? posts 
        : posts.filter(post => post.category === selectedCategory);
    
  return (
    <>
    <Navbar/>
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    {/* Header */}
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book Club Forum</h1>
            <p className="text-gray-600">Discuss, share, and connect with fellow readers</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Discussion</span>
        </button>
      </div>
    </div>

    {/* Category Filter */}
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>

    {/* New Post Form */}
    {showNewPostForm && (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Start a New Discussion</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="What would you like to discuss?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="Share your thoughts, questions, or insights..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCreatePost}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Post Discussion
            </button>
            <button
              onClick={() => setShowNewPostForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Posts List */}
    <div className="space-y-6">
      {filteredPosts.map(post => (
        <div key={post.id} className={`bg-white rounded-lg shadow-lg overflow-hidden ${post.featured ? 'ring-2 ring-yellow-400' : ''}`}>
          {post.featured && (
            <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-200">
              <div className="flex items-center space-x-2 text-yellow-800">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">Featured Discussion</span>
              </div>
            </div>
          )}
          
          <div className="p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    post.category === 'Current Read' ? 'bg-green-100 text-green-800' :
                    post.category === 'Suggestions' ? 'bg-blue-100 text-blue-800' :
                    post.category === 'Analysis' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-700 leading-relaxed">{post.content}</p>
              </div>
            </div>

            {/* Post Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeAgo(post.timestamp)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Comments ({post.comments.length})
              </h4>
              
              {/* Existing Comments */}
              <div className="space-y-3 mb-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-800 mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{comment.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(comment.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLikeComment(post.id, comment.id)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors ml-4"
                      >
                        <Heart className="h-3 w-3" />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newComment[post.id] || ''}
                  onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {filteredPosts.length === 0 && (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
        <p className="text-gray-600 mb-4">Be the first to start a discussion in this category!</p>
        <button
          onClick={() => setShowNewPostForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Start Discussion
        </button>
      </div>
    )}
  </div>
    </>
  );
};

export default Disscustion