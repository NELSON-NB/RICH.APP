// components/events/EventDetail.jsx
import React from 'react';

const EventDetail = ({ event, onBack, onEdit, onDelete }) => {
  if (!event) return null;

  return (
    <div className="p-6 bg-white rounded shadow-lg">
      <button onClick={onBack} className="text-blue-600 mb-4">← Back</button>
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p><strong>Host:</strong> {event.hostName}</p>
      <p><strong>Book:</strong> {event.book}</p>
      <p><strong>Author:</strong> {event.author}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => onEdit(event)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
        <button onClick={() => onDelete(event.id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  );
};

export default EventDetail;
