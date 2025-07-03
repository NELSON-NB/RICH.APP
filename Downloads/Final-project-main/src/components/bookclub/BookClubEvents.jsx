import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen, Plus, Edit2, Trash2, Eye, Filter, Search } from 'lucide-react';
import Navbar from '../navbar/Navbar';
import { API_URL } from '../../api';

const BookClubEvents = () => {
  const [events, setEvents] = useState([]);
  const [books, setBooks] = useState([]); // ✅ Added missing books state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch events from database
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/events`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      console.log('Fetched events:', data);
      
      // Ensure each event has currentAttendees property
      const eventsWithDefaults = data.map(event => ({
        ...event,
        currentAttendees: event.currentAttendees || 0,
        maxAttendees: event.maxAttendees || 20
      }));
      
      setEvents(eventsWithDefaults);
    } catch (err) {
      console.error("Error loading events", err);
      setEvents([]);
    }
  };

  // Fetch books from database
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books`);
      const data = await response.json();
      console.log('Fetched books for events:', data);
      if (data.success) {
        setBooks(data.books);
      } else {
        console.error('Failed to fetch books:', data.message);
        setBooks([]); // ✅ Set empty array on failure
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setBooks([]); // ✅ Set empty array on error
    }
  };

  // Fetch events and books on component mount
  useEffect(() => {
    fetchEvents();
    fetchBooks();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    book: '',
    author: '',
    date: '',
    time: '',
    location: '',
    type: 'in-person',
    maxAttendees: 20,
    description: '',
    hostName: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      book: '',
      author: '',
      date: '',
      time: '',
      location: '',
      type: 'in-person',
      maxAttendees: 20,
      description: '',
      hostName: ''
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.book || !formData.author ||
        !formData.date || !formData.time || !formData.location ||
        !formData.hostName) {
      alert('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to create or edit events');
      return;
    }

    const url = editingEvent ?
      `${API_URL}/events/${editingEvent._id}` : // ✅ Using _id consistently
      `${API_URL}/events/create`;
    const method = editingEvent ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit event');
      }

      console.log('Event saved successfully:', data);
      alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');

      // Refresh event list after creating/editing
      fetchEvents();
      setShowCreateForm(false);
      setEditingEvent(null);
      resetForm();
      // ✅ Removed setSelectedBookForEvent call
    } catch (err) {
      console.error('Error submitting event:', err);
      alert(err.message || 'There was a problem submitting the event.');
    }
  };

  const handleDelete = async (_id) => {
    const token = localStorage.getItem('token');
    console.log(localStorage.getItem('token'));
    try {
      const res = await fetch(`${API_URL}/events/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert('Failed to delete event');
    }
  };

  const handleJoinEvent = async (_id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to join events');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/events/${_id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to join event');
      }

      console.log('Successfully joined event:', data);
      alert('Successfully joined the event!');
      fetchEvents();
    } catch (err) {
      console.error('Error joining event:', err);
      alert(err.message || 'Failed to join event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      book: event.book,
      author: event.author,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      maxAttendees: event.maxAttendees,
      description: event.description,
      hostName: event.hostName,
    });
    setShowCreateForm(true);
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto p-6  mt-6 bg-gradient-to-br from-green-100 via-yellow-50 to-red-100 ">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {editingEvent ? 'Edit Event' : 'Create New Book Club Event'}
          </h2>
          <button
            onClick={() => {
              setShowCreateForm(false);
              setEditingEvent(null);
              resetForm();
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Events
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host Name</label>
              <input
                type="text"
                value={formData.hostName}
                onChange={(e) => setFormData({...formData, hostName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
              <input
                type="text"
                value={formData.book}
                onChange={(e) => setFormData({...formData, book: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder={formData.type === 'virtual' ? 'Zoom, Discord, etc.' : 'Address or venue name'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
              <input
                type="number"
                value={formData.maxAttendees}
                onChange={(e) => setFormData({...formData, maxAttendees: parseInt(e.target.value)})}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what attendees can expect from this event..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setEditingEvent(null);
                resetForm();
              }}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-green-100 via-yellow-50 to-red-100">
        <div className="mb-6">
          <button
            onClick={() => setSelectedEvent(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Events
          </button>
          <div className="bg-gradient-to-r from-green-200 to-yellow-100 text-white p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-2">{selectedEvent.title}</h1>
            <p className="text-blue-100">Hosted by {selectedEvent.hostName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Book Details
              </h3>
              <p className="text-lg font-medium">{selectedEvent.book}</p>
              <p className="text-gray-600">by {selectedEvent.author}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Event Details
              </h3>
              <div className="space-y-2">
                <p><strong>Date:</strong> {formatDate(selectedEvent.date)}</p>
                <p><strong>Time:</strong> {formatTime(selectedEvent.time)}</p>
                <p className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-500" /> {selectedEvent.location}</p>
                <p><strong>Type:</strong> <span className="capitalize">{selectedEvent.type}</span></p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Attendance
              </h3>
              <div className="flex items-center justify-between">
                <span>{selectedEvent.currentAttendees} / {selectedEvent.maxAttendees} attendees</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{width: `${(selectedEvent.currentAttendees / selectedEvent.maxAttendees) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
            </div>

            <div className="space-y-3">
              {selectedEvent.currentAttendees < selectedEvent.maxAttendees && (
                <button
                  onClick={() => handleJoinEvent(selectedEvent._id)} // ✅ Using _id
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Join This Event
                </button>
              )}
              <button
                onClick={() => handleEdit(selectedEvent)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Event
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedEvent._id); // ✅ Using _id
                  setSelectedEvent(null);
                }}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto p-6 min-h-screen min-w-screen bg-gradient-to-br from-green-100 via-red-50 to-yellow-100">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Club Events</h1>
            <p className="text-gray-600 mt-1">Manage and join book club discussions</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events, books, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="in-person">In-Person</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">No events found</h3>
          <p className="text-gray-400">Create your first book club event to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"> {/* ✅ Using _id */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600">by {event.hostName}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    event.type === 'virtual' ? 'bg-green-100 text-green-800' :
                    event.type === 'hybrid' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {event.type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="font-medium">{event.book}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{formatTime(event.time)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{event.currentAttendees}/{event.maxAttendees}</span>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{width: `${(event.currentAttendees / event.maxAttendees) * 100}%`}}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-gray-50 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)} // ✅ Using _id
                    className="bg-red-50 text-red-700 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default BookClubEvents;