import React, { useState, useEffect, useRef } from 'react';
import { Send, Book, Users, Clock } from 'lucide-react';

const BookClubChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Sarah Chen',
      message: 'Hey everyone! What did you think about Chapter 3?',
      timestamp: new Date(Date.now() - 3600000),
      avatar: 'SC'
    },
    {
      id: 2,
      user: 'Mike Johnson',
      message: 'The plot twist was incredible! I didn\'t see it coming at all.',
      timestamp: new Date(Date.now() - 3000000),
      avatar: 'MJ'
    },
    {
      id: 3,
      user: 'Emma Davis',
      message: 'Same here! The author really knows how to keep us on our toes. Can\'t wait to discuss it in our next meeting.',
      timestamp: new Date(Date.now() - 2400000),
      avatar: 'ED'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleJoinChat = (e) => {
    e.preventDefault();
    if (currentUser.trim()) {
      setIsJoined(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: currentUser,
        message: newMessage.trim(),
        timestamp: new Date(),
        avatar: currentUser.split(' ').map(n => n[0]).join('').toUpperCase()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === new Date(today - 86400000).toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 to-red-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Book Club Chat</h1>
            <p className="text-gray-600">Join the discussion with your classmates</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your name
              </label>
              <input
                type="text"
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Your full name"
                onKeyPress={(e) => e.key === 'Enter' && handleJoinChat(e)}
              />
            </div>
            <button
              onClick={handleJoinChat}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Join Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Book className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Book Club Discussion</h1>
              <p className="text-sm text-gray-500">University Literature Group</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{new Set(messages.map(m => m.user)).size + 1} members</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => {
          const showDate = index === 0 || 
            formatDate(messages[index - 1].timestamp) !== formatDate(msg.timestamp);
          
          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                    {formatDate(msg.timestamp)}
                  </span>
                </div>
              )}
              
              <div className={`flex ${msg.user === currentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-xs lg:max-w-md ${msg.user === currentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                    msg.user === currentUser ? 'bg-indigo-600 ml-2' : 'bg-gray-500 mr-2'
                  }`}>
                    {msg.avatar}
                  </div>
                  
                  <div className={`px-4 py-2 rounded-2xl ${
                    msg.user === currentUser 
                      ? 'bg-indigo-600 text-white rounded-br-sm' 
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.user !== currentUser && (
                      <p className="text-xs font-medium mb-1 text-gray-600">{msg.user}</p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <div className={`flex items-center mt-1 space-x-1 ${
                      msg.user === currentUser ? 'text-indigo-200' : 'text-gray-400'
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Type your message about the book..."
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-center mt-2">
          <span className="text-xs text-gray-500">
            Connected as {currentUser}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookClubChat;