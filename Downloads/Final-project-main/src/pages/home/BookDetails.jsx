import React,{useState} from 'react'
import { Star, MessageCircle, ThumbsUp, ThumbsDown, User, Calendar, BookOpen, Users } from 'lucide-react';
import Navbar from '../../components/navbar/Navbar';
import { Link } from 'react-router';


const BookDetails = () => {
  const [book] = useState({
    id: 1,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop",
    description: "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life. But when she chooses unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself. Why her? Why now? Monique is not exactly on top of the world. Her husband has left her, and her career has stagnated. Regardless of why Evelyn has selected her to write her biography, Monique is determined to use this opportunity to jumpstart her career.",
    pages: 400,
    publishedDate: "2017-06-13",
    genre: ["Fiction", "Historical Fiction", "Romance"],
    isbn: "978-1501161933",
    rating: 4.5,
    totalRatings: 234,
    currentReaders: 45,
    discussionDeadline: "2024-02-15"
  });

  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "Nelson Beaudouin",
      avatar: "NB",
      rating: 5,
      date: "2024-01-15",
      content: "Absolutely captivating! The storytelling is masterful and Evelyn's character development throughout the decades is phenomenal. I couldn't put it down.",
      likes: 12,
      dislikes: 1,
      helpful: true
    },
    {
      id: 2,
      user: "Michael Rodriguez",
      avatar: "MR",
      rating: 4,
      date: "2024-01-10",
      content: "Great character study with beautiful prose. The dual timeline worked really well. Some parts felt a bit slow, but overall a solid read.",
      likes: 8,
      dislikes: 2,
      helpful: false
    },
    {
      id: 3,
      user: "Emma Johnson",
      avatar: "EJ",
      rating: 5,
      date: "2024-01-08",
      content: "This book completely exceeded my expectations. The themes of love, ambition, and sacrifice are handled with such nuance. Highly recommend!",
      likes: 15,
      dislikes: 0,
      helpful: true
    }
  ]);

  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Chapter 1-5 Discussion: First Impressions",
      author: "Book Club Moderator",
      date: "2024-01-20",
      replies: 23,
      lastActivity: "2 hours ago",
      pinned: true,
      content: "What are your initial thoughts on Evelyn's character? How do you think her past will unfold?"
    },
    {
      id: 2,
      title: "Historical Context: Hollywood in the 1950s-60s",
      author: "Sarah Chen",
      date: "2024-01-18",
      replies: 15,
      lastActivity: "1 day ago",
      pinned: false,
      content: "Let's discuss the historical backdrop and how it influences the story..."
    },
    {
      id: 3,
      title: "Character Analysis: Monique Grant",
      author: "Michael Rodriguez",
      date: "2024-01-16",
      replies: 8,
      lastActivity: "3 days ago",
      pinned: false,
      content: "What do you think about Monique as our narrator? Is she reliable?"
    }
  ]);

  const [newReview, setNewReview] = useState({ rating: 5, content: '' });
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [activeTab, setActiveTab] = useState('overview');

  const handleReviewSubmit = (e) => {
    if (newReview.content.trim()) {
      const review = {
        id: reviews.length + 1,
        user: "Nelson Beaudouin",
        avatar: "NB",
        rating: newReview.rating,
        date: new Date().toISOString().split('T')[0],
        content: newReview.content,
        likes: 0,
        dislikes: 0,
        helpful: false
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, content: '' });
    }
  };

  const handleDiscussionSubmit = (e) => {
    if (newDiscussion.title.trim() && newDiscussion.content.trim()) {
      const discussion = {
        id: discussions.length + 1,
        title: newDiscussion.title,
        author: "You",
        date: new Date().toISOString().split('T')[0],
        replies: 0,
        lastActivity: "Just now",
        pinned: false,
        content: newDiscussion.content
      };
      setDiscussions([discussion, ...discussions]);
      setNewDiscussion({ title: '', content: '' });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const renderRatingInput = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          i < newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
        }`}
        onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
      />
    ));
  };
  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
    {/* Header Section */}
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-shrink-0">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-64 h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
        
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{renderStars(Math.floor(book.rating))}</div>
            <span className="text-lg font-semibold">{book.rating}</span>
            <span className="text-gray-500">({book.totalRatings} reviews)</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">{book.pages} pages</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Published {book.publishedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">{book.currentReaders} reading</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">Due: {book.discussionDeadline}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Genres:</h3>
            <div className="flex flex-wrap gap-2">
              {book.genre.map((g, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Link to={'/disscustion'}>Join Discussion</Link>
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Add to Reading List
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Navigation Tabs */}
    <div className="bg-white rounded-lg shadow-md mb-8">
      <div className="flex border-b">
        {['overview', 'reviews', 'discussions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Book Description</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{book.description}</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Book Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">ISBN:</span> {book.isbn}</div>
                  <div><span className="font-medium">Pages:</span> {book.pages}</div>
                  <div><span className="font-medium">Published:</span> {book.publishedDate}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Reading Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Club Members Reading</span>
                    <span className="font-medium">{book.currentReaders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500">Discussion deadline: {book.discussionDeadline}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
            </div>

            {/* Add Review Form */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-1">{renderRatingInput()}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Share your thoughts about this book..."
                  />
                </div>
                <button
                  onClick={handleReviewSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{review.user}</h4>
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{review.content}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                          <ThumbsUp className="w-4 h-4" />
                          {review.likes}
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
                          <ThumbsDown className="w-4 h-4" />
                          {review.dislikes}
                        </button>
                        {review.helpful && (
                          <span className="text-green-600 text-xs font-medium">Helpful</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Discussion Threads</h2>
            </div>

            {/* Create Discussion Form */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Start a New Discussion</h3>
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Discussion Title</label>
                  <input
                    type="text"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What would you like to discuss?"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Provide some context or questions to get the discussion started..."
                  />
                </div>
                <button
                  onClick={handleDiscussionSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Discussion
                </button>
              </div>
            </div>

            {/* Discussion Threads */}
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className={`border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer ${
                    discussion.pinned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {discussion.pinned && (
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                            Pinned
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">{discussion.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3">{discussion.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {discussion.author}
                        </span>
                        <span>{discussion.date}</span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {discussion.replies} replies
                        </span>
                        <span>Last activity: {discussion.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
    </div>
  </div>
    </>
  );
}

export default BookDetails