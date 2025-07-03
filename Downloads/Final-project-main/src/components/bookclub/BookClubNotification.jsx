import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  BookOpen,
  MessageCircle,
  Calendar,
  X,
  Settings,
  Check
} from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { API_URL } from "../../api.js";

const BookClubNotifications = () => {
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // 🔌 Connect to WebSocket
  useEffect(() => {
    socketRef.current = io(`${API_URL}`);

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected to server');
    });

    socketRef.current.on('newBook', (book) => {
      console.log('📥 Received newBook event:', book);
      const newNotification = {
        id: Date.now(),
        type: 'announcement',
        title: `New Book: ${book.title}`,
        message: `Author: ${book.author}`,
        timestamp: new Date(),
        read: false,
        priority: 'high',
      };
      setNotifications(prev => [newNotification, ...prev]);
      setIsOpen(true);
      toast.success(`📚 New Book: ${book.title}`);
    });

    socketRef.current.on('newComment', ({ bookId, comment }) => {
      console.log('💬 Received newComment event:', comment);
      const newNotification = {
        id: Date.now(),
        type: 'message',
        title: `New Comment on Book ${bookId}`,
        message: `${comment.userName}: ${comment.text}`,
        timestamp: new Date(),
        read: false,
        priority: 'medium',
      };
      setNotifications(prev => [newNotification, ...prev]);
      setIsOpen(true);
      toast(`💬 ${comment.userName}: ${comment.text}`);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // 🔔 Ask for Notification Permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // ✔️ Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // ✔️ Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ❌ Delete notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // 🎯 Return an icon based on type
  const getIcon = (type) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'announcement':
        return <BookOpen className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // 🎯 Return color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  // 🕐 Format time display
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // ✅ Return UI
  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute top-16 right-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Book Club Updates</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm opacity-90">{unreadCount} unread</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-30 transition-all"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                console.log("🔔 Rendering notification:", notification),
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getIcon(notification.type)}
                        <span className={`font-medium text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </span>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{formatTime(notification.timestamp)}</span>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Mark read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => {}}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Notification Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookClubNotifications;

