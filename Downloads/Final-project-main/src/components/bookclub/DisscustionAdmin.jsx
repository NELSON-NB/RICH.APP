import React, { useState, useEffect }  from 'react'
import { 
    MessageCircle, Heart, Clock, User, Plus, Send, BookOpen, Star,
    Shield, Eye, EyeOff, Trash2, Flag, AlertTriangle, Settings,
    UserX, MessageSquare, Pin, Lock, Unlock, Archive, Volume2, VolumeX,
    CheckCircle, XCircle, Edit, MoreHorizontal, Ban, Crown
  } from 'lucide-react';

const DisscustionAdmin = () => {
    const [currentUser, setCurrentUser] = useState({
        id: 1,
        name: "Admin User",
        role: "admin", // admin, moderator, member
        permissions: ["delete", "edit", "pin", "ban", "moderate"]
      });
    
      const [posts, setPosts] = useState([
        {
          id: 1,
          title: "What did you think of the ending of 'The Seven Husbands of Evelyn Hugo'?",
          content: "I just finished reading and I'm still processing that twist! The way Taylor Jenkins Reid revealed Evelyn's true love story was absolutely masterful. What were your thoughts on the ending?",
          author: "Sarah M.",
          authorId: 2,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 12,
          comments: [
            {
              id: 1,
              content: "I was completely shocked! I had to go back and reread certain parts with this new perspective. The clues were there all along but so subtly woven in.",
              author: "Mike K.",
              authorId: 3,
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
              likes: 5,
              flagged: false,
              hidden: false
            },
            {
              id: 2,
              content: "The ending made me appreciate the entire book on a different level. It's definitely one I want to reread now knowing what I know!",
              author: "Emma L.",
              authorId: 4,
              timestamp: new Date(Date.now() - 30 * 60 * 1000),
              likes: 3,
              flagged: false,
              hidden: false
            }
          ],
          category: "Current Read",
          featured: true,
          pinned: false,
          locked: false,
          hidden: false,
          flagged: false,
          reports: []
        },
        {
          id: 2,
          title: "Book suggestions for next month?",
          content: "Looking for our next book club pick! I'm hoping for something in the mystery/thriller genre. What are your recommendations?",
          author: "Alex R.",
          authorId: 5,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          likes: 8,
          comments: [
            {
              id: 3,
              content: "I highly recommend 'The Thursday Murder Club' by Richard Osman. It's cozy mystery with great characters!",
              author: "Jennifer W.",
              authorId: 6,
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
              likes: 6,
              flagged: false,
              hidden: false
            }
          ],
          category: "Suggestions",
          pinned: false,
          locked: false,
          hidden: false,
          flagged: false,
          reports: []
        },
        {
          id: 3,
          title: "This book club is terrible and the moderators are biased!",
          content: "I can't believe how poorly this club is run. The book selections are awful and the discussions are boring. This is a waste of time!",
          author: "Angry Reader",
          authorId: 7,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 0,
          comments: [],
          category: "General",
          pinned: false,
          locked: false,
          hidden: false,
          flagged: true,
          reports: [
            {
              id: 1,
              reporterId: 8,
              reporterName: "Concerned Member",
              reason: "Inappropriate content",
              description: "This post is unnecessarily hostile and disruptive to the community",
              timestamp: new Date(Date.now() - 30 * 60 * 1000)
            }
          ]
        }
      ]);
    
      const [users, setUsers] = useState([
        { id: 2, name: "Sarah M.", role: "member", status: "active", joinDate: new Date(2024, 0, 15) },
        { id: 3, name: "Mike K.", role: "member", status: "active", joinDate: new Date(2024, 1, 3) },
        { id: 4, name: "Emma L.", role: "moderator", status: "active", joinDate: new Date(2023, 11, 20) },
        { id: 5, name: "Alex R.", role: "member", status: "active", joinDate: new Date(2024, 2, 8) },
        { id: 6, name: "Jennifer W.", role: "member", status: "active", joinDate: new Date(2024, 1, 28) },
        { id: 7, name: "Angry Reader", role: "member", status: "warning", joinDate: new Date(2024, 3, 1) },
        { id: 8, name: "Concerned Member", role: "member", status: "active", joinDate: new Date(2024, 0, 10) }
      ]);
    
      const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
      const [newComment, setNewComment] = useState({});
      const [showNewPostForm, setShowNewPostForm] = useState(false);
      const [selectedCategory, setSelectedCategory] = useState('All');
      const [showModerationPanel, setShowModerationPanel] = useState(false);
      const [selectedPost, setSelectedPost] = useState(null);
      const [showUserManagement, setShowUserManagement] = useState(false);
      const [reportModal, setReportModal] = useState({ show: false, postId: null, commentId: null });
    
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
    
      const hasPermission = (permission) => {
        return currentUser.permissions.includes(permission) || currentUser.role === 'admin';
      };
    
      const handleCreatePost = () => {
        if (newPost.title.trim() && newPost.content.trim()) {
          const post = {
            id: posts.length + 1,
            title: newPost.title,
            content: newPost.content,
            author: currentUser.name,
            authorId: currentUser.id,
            timestamp: new Date(),
            likes: 0,
            comments: [],
            category: newPost.category,
            featured: false,
            pinned: false,
            locked: false,
            hidden: false,
            flagged: false,
            reports: []
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
            author: currentUser.name,
            authorId: currentUser.id,
            timestamp: new Date(),
            likes: 0,
            flagged: false,
            hidden: false
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
    
      // Moderation Functions
      const handlePinPost = (postId) => {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, pinned: !post.pinned }
            : post
        ));
      };
    
      const handleLockPost = (postId) => {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, locked: !post.locked }
            : post
        ));
      };
    
      const handleHidePost = (postId) => {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, hidden: !post.hidden }
            : post
        ));
      };
    
      const handleDeletePost = (postId) => {
        if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
          setPosts(posts.filter(post => post.id !== postId));
        }
      };
    
      const handleDeleteComment = (postId, commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
          setPosts(posts.map(post => 
            post.id === postId 
              ? { ...post, comments: post.comments.filter(comment => comment.id !== commentId) }
              : post
          ));
        }
      };
    
      const handleHideComment = (postId, commentId) => {
        setPosts(posts.map(post => 
          post.id === postId 
            ? {
                ...post, 
                comments: post.comments.map(comment =>
                  comment.id === commentId
                    ? { ...comment, hidden: !comment.hidden }
                    : comment
                )
              }
            : post
        ));
      };
    
      const handleBanUser = (userId) => {
        if (window.confirm('Are you sure you want to ban this user?')) {
          setUsers(users.map(user => 
            user.id === userId 
              ? { ...user, status: 'banned' }
              : user
          ));
        }
      };
    
      const handleWarnUser = (userId) => {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, status: 'warning' }
            : user
        ));
      };
    
      const handlePromoteUser = (userId) => {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, role: user.role === 'member' ? 'moderator' : 'member' }
            : user
        ));
      };
    
      const handleResolveReport = (postId, reportId) => {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                reports: post.reports.filter(report => report.id !== reportId),
                flagged: post.reports.filter(report => report.id !== reportId).length > 0
              }
            : post
        ));
      };
    
      const filteredPosts = selectedCategory === 'All' 
        ? posts.filter(post => !post.hidden || hasPermission('moderate'))
        : posts.filter(post => post.category === selectedCategory && (!post.hidden || hasPermission('moderate')));
    
      const flaggedPosts = posts.filter(post => post.flagged);
      const totalReports = posts.reduce((sum, post) => sum + post.reports.length, 0);
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
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
          <div className="flex items-center space-x-3">
            {hasPermission('moderate') && (
              <>
                <button
                  onClick={() => setShowUserManagement(!showUserManagement)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Users</span>
                </button>
                <button
                  onClick={() => setShowModerationPanel(!showModerationPanel)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors relative"
                >
                  <Shield className="h-4 w-4" />
                  <span>Moderation</span>
                  {totalReports > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalReports}
                    </span>
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Discussion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Moderation Panel */}
      {showModerationPanel && hasPermission('moderate') && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-red-600" />
            Moderation Dashboard
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Flagged Posts</p>
                  <p className="text-2xl font-bold text-red-900">{flaggedPosts.length}</p>
                </div>
                <Flag className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending Reports</p>
                  <p className="text-2xl font-bold text-yellow-900">{totalReports}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-900">{users.filter(u => u.status === 'active').length}</p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {flaggedPosts.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Flagged Content</h4>
              <div className="space-y-2">
                {flaggedPosts.map(post => (
                  <div key={post.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-900">{post.title}</p>
                        <p className="text-sm text-red-700">by {post.author} • {post.reports.length} report(s)</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleHidePost(post.id)}
                          className="text-orange-600 hover:text-orange-800 p-1"
                          title="Hide Post"
                        >
                          <EyeOff className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete Post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Management Panel */}
      {showUserManagement && hasPermission('moderate') && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-purple-600" />
            User Management
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'moderator' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                        {user.role === 'moderator' && <Shield className="h-3 w-3 mr-1" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.id !== currentUser.id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePromoteUser(user.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title={user.role === 'member' ? 'Promote to Moderator' : 'Demote to Member'}
                          >
                            <Crown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleWarnUser(user.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Issue Warning"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Ban User"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
          <div key={post.id} className={`bg-white rounded-lg shadow-lg overflow-hidden ${
            post.featured ? 'ring-2 ring-yellow-400' : ''
          } ${post.hidden ? 'opacity-50 border-2 border-red-300' : ''}`}>
            {post.featured && (
              <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-200">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">Featured Discussion</span>
                </div>
              </div>
            )}

            {post.pinned && (
              <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Pin className="h-4 w-4" />
                  <span className="text-sm font-medium">Pinned Post</span>
                </div>
              </div>
            )}

            {post.flagged && hasPermission('moderate') && (
              <div className="bg-red-50 px-4 py-2 border-b border-red-200">
                <div className="flex items-center space-x-2 text-red-800">
                  <Flag className="h-4 w-4" />
                  <span className="text-sm font-medium">Flagged Content ({post.reports.length} reports)</span>
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
                    {post.locked && (
                      <span className="flex items-center space-x-1 text-xs text-gray-500">
                        <Lock className="h-3 w-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{post.content}</p>
                </div>
                
                {/* Moderation Actions */}
                {hasPermission('moderate') && (
                  <div className="ml-4 flex flex-col space-y-1">
                    <button
                      onClick={() => handlePinPost(post.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        post.pinned ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-400'
                      }`}
                      title={post.pinned ? 'Unpin Post' : 'Pin Post'}
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleLockPost(post.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        post.locked ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-400'
                      }`}
                      title={post.locked ? 'Unlock Post' : 'Lock Post'}
                    >
                      {post.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleHidePost(post.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        post.hidden ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-400'
                      }`}
                      title={post.hidden ? 'Show Post' : 'Hide Post'}
                    >
                      {post.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
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
                    <span>{post.comments.filter(c => !c.hidden).length}</span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Comments ({post.comments.filter(c => !c.hidden || hasPermission('moderate')).length})
                </h4>
                
                {/* Existing Comments */}
                <div className="space-y-3 mb-4">
                  {post.comments
                    .filter(comment => !comment.hidden || hasPermission('moderate'))
                    .map(comment => (
                    <div key={comment.id} className={`bg-gray-50 rounded-lg p-4 ${comment.hidden ? 'opacity-50 border-2 border-red-200' : ''}`}>
                      {comment.hidden && hasPermission('moderate') && (
                        <div className="bg-red-50 px-2 py-1 rounded mb-2">
                          <span className="text-xs text-red-600 font-medium">Hidden Comment</span>
                        </div>
                      )}
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
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleLikeComment(post.id, comment.id)}
                            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Heart className="h-3 w-3" />
                            <span>{comment.likes}</span>
                          </button>
                          {hasPermission('moderate') && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleHideComment(post.id, comment.id)}
                                className={`p-1 rounded transition-colors ${
                                  comment.hidden ? 'text-orange-600 hover:text-orange-800' : 'text-gray-400 hover:text-gray-600'
                                }`}
                                title={comment.hidden ? 'Show Comment' : 'Hide Comment'}
                              >
                                {comment.hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                              </button>
                              <button
                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete Comment"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                {!post.locked && (
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
                )}
                
                {post.locked && (
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <Lock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">This discussion has been locked by moderators.</p>
                  </div>
                )}
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

  );
};

export default DisscustionAdmin