import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Check, X, Mail, Phone } from 'lucide-react';

const RSVPApp = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Tech Conference 2025",
      date: "2025-07-15",
      time: "09:00",
      location: "Convention Center, Downtown",
      description: "Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.",
      maxAttendees: 100,
      rsvps: [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", status: "attending" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "098-765-4321", status: "attending" },
        { id: 3, name: "Bob Wilson", email: "bob@example.com", phone: "555-123-4567", status: "maybe" }
      ]
    },
    {
      id: 2,
      title: "Summer Networking Mixer",
      date: "2025-06-20",
      time: "18:00",
      location: "Rooftop Lounge, City Plaza",
      description: "Casual networking event with drinks, appetizers, and great conversations.",
      maxAttendees: 50,
      rsvps: [
        { id: 4, name: "Alice Johnson", email: "alice@example.com", phone: "444-555-6666", status: "attending" }
      ]
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRSVPForm, setShowRSVPForm] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    maxAttendees: 50
  });

  const [rsvpForm, setRSVPForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'attending'
  });

  const createEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location || !newEvent.description) {
      return;
    }
    const event = {
      ...newEvent,
      id: Date.now(),
      rsvps: []
    };
    setEvents([...events, event]);
    setNewEvent({ title: '', date: '', time: '', location: '', description: '', maxAttendees: 50 });
    setShowCreateForm(false);
  };

  const submitRSVP = () => {
    if (!rsvpForm.name || !rsvpForm.email || !rsvpForm.phone) {
      return;
    }
    const rsvp = {
      ...rsvpForm,
      id: Date.now()
    };
    
    setEvents(events.map(event => 
      event.id === selectedEvent.id 
        ? { ...event, rsvps: [...event.rsvps, rsvp] }
        : event
    ));
    
    setRSVPForm({ name: '', email: '', phone: '', status: 'attending' });
    setShowRSVPForm(false);
    setSelectedEvent(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'attending': return 'bg-green-100 text-green-800';
      case 'maybe': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'attending': return <Check className="w-4 h-4" />;
      case 'maybe': return <Clock className="w-4 h-4" />;
      case 'declined': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Event RSVP System
          </h1>
          <p className="text-gray-600 text-lg">Manage your events and track RSVPs with ease</p>
        </div>

        {/* Create Event Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Event
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{formatTime(event.time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{event.rsvps.length} / {event.maxAttendees} RSVPs</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowRSVPForm(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    RSVP
                  </button>
                  <button
                    onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {selectedEvent?.id === event.id ? 'Hide' : 'View'}
                  </button>
                </div>
              </div>

              {/* RSVP List */}
              {selectedEvent?.id === event.id && (
                <div className="border-t bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">RSVPs ({event.rsvps.length})</h4>
                  {event.rsvps.length === 0 ? (
                    <p className="text-gray-500 text-sm">No RSVPs yet</p>
                  ) : (
                    <div className="space-y-2">
                      {event.rsvps.map(rsvp => (
                        <div key={rsvp.id} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800">{rsvp.name}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  <span>{rsvp.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{rsvp.phone}</span>
                                </div>
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(rsvp.status)}`}>
                              {getStatusIcon(rsvp.status)}
                              {rsvp.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create Event Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Event</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                    <input
                      type="text"
                      required
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        required
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newEvent.maxAttendees}
                      onChange={(e) => setNewEvent({...newEvent, maxAttendees: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={createEvent}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Create Event
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RSVP Modal */}
        {showRSVPForm && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">RSVP for Event</h2>
                <p className="text-gray-600 mb-6">{selectedEvent.title}</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={rsvpForm.name}
                      onChange={(e) => setRSVPForm({...rsvpForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={rsvpForm.email}
                      onChange={(e) => setRSVPForm({...rsvpForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={rsvpForm.phone}
                      onChange={(e) => setRSVPForm({...rsvpForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Response</label>
                    <select
                      value={rsvpForm.status}
                      onChange={(e) => setRSVPForm({...rsvpForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="attending">Attending</option>
                      <option value="maybe">Maybe</option>
                      <option value="declined">Cannot Attend</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={submitRSVP}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Submit RSVP
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRSVPForm(false);
                        setSelectedEvent(null);
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RSVPApp;