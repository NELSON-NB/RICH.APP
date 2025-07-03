import React,{useState} from 'react'
import { 
  User, 
  BookOpen, 
  Users, 
  Calendar, 
  Star, 
  MessageCircle, 
  Clock, 
  TrendingUp,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  Edit3,
  Target,
  Award,
  Book,
  Heart,
  Eye,
  CheckCircle
} from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import BookClubNotifications from '../components/bookclub/BookClubNotification';
import { API_URL } from '../api.js';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState({
    name: "Nelson Beaudouin",
    email: "ngoufackbeaudouinnelson@gmail.com",
    avatar: "NB",
    joinDate: "September 2023",
    booksRead: 24,
    reviewsWritten: 18,
    clubsJoined: 3,
    readingStreak: 12,
    favoriteGenres: ["Fiction", "Mystery", "Sci-Fi"],
    readingGoal: 30,
    bio: "Literature student passionate about contemporary fiction and classic novels. Love discussing character development and narrative techniques!"
  });

  const handleProfileUpdate = async () => {
  try {
    const res = await fetch(`${API_URL}/users/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Include token if your route is protected
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Profile updated successfully");
    } else {
      alert(data.message || "Failed to update");
    }
  } catch (err) {
    console.error("Update error:", err);
    alert("Error updating profile");
  }
};


  const [readingLists, setReadingLists] = useState([
    {
      id: 1,
      name: "Currently Reading",
      books: [
        { id: 1, title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", progress: 65, dueDate: "2024-02-15" },
        { id: 2, title: "Project Hail Mary", author: "Andy Weir", progress: 30, dueDate: "2024-02-28" }
      ],
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      name: "Want to Read",
      books: [
        { id: 3, title: "The Thursday Murder Club", author: "Richard Osman", progress: 0, dueDate: null },
        { id: 4, title: "Klara and the Sun", author: "Kazuo Ishiguro", progress: 0, dueDate: null },
        { id: 5, title: "The Midnight Library", author: "Matt Haig", progress: 0, dueDate: null }
      ],
      color: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      name: "Completed",
      books: [
        { id: 6, title: "Where the Crawdads Sing", author: "Delia Owens", progress: 100, rating: 4 },
        { id: 7, title: "The Silent Patient", author: "Alex Michaelides", progress: 100, rating: 5 },
        { id: 8, title: "Educated", author: "Tara Westover", progress: 100, rating: 5 }
      ],
      color: "bg-purple-100 text-purple-800"
    }
  ]);

  const [clubActivities] = useState([
    {
      id: 1,
      type: "discussion",
      title: "New discussion in Contemporary Fiction Club",
      description: "Character Analysis: Evelyn Hugo - What makes her compelling?",
      time: "2 hours ago",
      club: "Contemporary Fiction Club",
      unread: true
    },
    {
      id: 2,
      type: "book_selected",
      title: "Next book selected for Mystery Lovers",
      description: "The Thursday Murder Club by Richard Osman - Discussion starts March 1st",
      time: "1 day ago",
      club: "Mystery Lovers",
      unread: true
    },
    {
      id: 3,
      type: "review",
      title: "Nelson Beaudouin reviewed 'Project Hail Mary'",
      description: "\"Absolutely brilliant sci-fi with heart and humor...\"",
      time: "3 days ago",
      club: "Sci-Fi Book Club",
      unread: false
    },
    {
      id: 4,
      type: "milestone",
      title: "Reading goal achievement!",
      description: "You've reached 80% of your yearly reading goal!",
      time: "1 week ago",
      club: null,
      unread: false
    }
  ]);

  const [clubs] = useState([
    {
      id: 1,
      name: "Contemporary Fiction Club",
      members: 45,
      currentBook: "The Seven Husbands of Evelyn Hugo",
      nextMeeting: "Feb 20, 2024",
      role: "Member",
      active: true
    },
    {
      id: 2,
      name: "Mystery Lovers",
      members: 32,
      currentBook: "The Thursday Murder Club",
      nextMeeting: "Mar 1, 2024",
      role: "Moderator",
      active: true
    },
    {
      id: 3,
      name: "Sci-Fi Book Club",
      members: 28,
      currentBook: "Project Hail Mary",
      nextMeeting: "Feb 25, 2024",
      role: "Member",
      active: false
    }
  ]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'discussion': return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'book_selected': return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'review': return <Star className="w-5 h-5 text-yellow-600" />;
      case 'milestone': return <Award className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (

    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                {user.avatar}
              </div>
              <div>
                <h1 className="text-xl font-semibold">Welcome back, {user.name}!</h1>
                <p className="text-gray-600 text-sm">Ready for your next great read?</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <BookClubNotifications className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: TrendingUp },
                { id: 'profile', name: 'Profile', icon: User },
                { id: 'reading-lists', name: 'Reading Lists', icon: BookOpen },
                { id: 'club-activities', name: 'Club Activities', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Books Read</p>
                    <p className="text-2xl font-bold text-gray-900">{user.booksRead}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +3 this month
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reading Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{user.readingStreak}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">days in a row</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reviews Written</p>
                    <p className="text-2xl font-bold text-gray-900">{user.reviewsWritten}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Average: 4.2★</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Book Clubs</p>
                    <p className="text-2xl font-bold text-gray-900">{user.clubsJoined}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Active clubs</p>
                </div>
              </div>
            </div>

            {/* Reading Goal Progress */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">2024 Reading Goal</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Edit Goal
                </button>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{user.booksRead} of {user.readingGoal} books</span>
                  <span>{Math.round((user.booksRead / user.readingGoal) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${(user.booksRead / user.readingGoal) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                You're {user.readingGoal - user.booksRead} books away from your goal! Keep it up! 📚
              </p>
            </div>

            {/* Recent Activity & Current Reading */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Reading */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Currently Reading</h3>
                <div className="space-y-4">
                  {readingLists[0].books.map((book) => (
                    <div key={book.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg">
                      <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{book.title}</h4>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{book.progress}% complete</span>
                            <span>Due: {book.dueDate}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {clubActivities.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                      {activity.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{user.bio}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {user.favoriteGenres.map((genre, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Books Read</label>
                    <p className="text-2xl font-bold text-gray-900">{user.booksRead}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reviews Written</label>
                    <p className="text-2xl font-bold text-gray-900">{user.reviewsWritten}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reading Lists Tab */}
        {activeTab === 'reading-lists' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Reading Lists</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Create List
              </button>
            </div>

            {readingLists.map((list) => (
              <div key={list.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{list.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${list.color}`}>
                      {list.books.length} books
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.books.map((book) => (
                    <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-3">
                        <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{book.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{book.author}</p>
                          
                          {book.progress !== undefined && book.progress < 100 && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{book.progress}%</span>
                                {book.dueDate && <span>Due: {book.dueDate}</span>}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full" 
                                  style={{ width: `${book.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {book.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              {renderStars(book.rating)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Club Activities Tab */}
        {activeTab === 'club-activities' && (
          <div className="space-y-8">
            {/* My Clubs */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">My Book Clubs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubs.map((club) => (
                  <div key={club.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{club.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        club.role === 'Moderator' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {club.role}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {club.members} members
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {club.currentBook}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Next: {club.nextMeeting}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className={`w-2 h-2 rounded-full ${club.active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Club
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Recent Activities</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {clubActivities.map((activity) => (
                  <div key={activity.id} className={`flex items-start gap-4 p-4 rounded-lg border ${
                    activity.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>{activity.time}</span>
                            {activity.club && (
                              <>
                                <span>•</span>
                                <span>{activity.club}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {activity.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Load More Activities
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  
    </>
    
  )
}

export default Dashboard