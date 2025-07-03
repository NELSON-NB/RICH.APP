// components/events/EventList.jsx
import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';

const EventList = ({ events, onView, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map(event => (
        <div key={event.id} className="border p-4 rounded-lg bg-white shadow">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="text-sm text-gray-500">by {event.hostName}</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => onView(event)} className="text-blue-500 flex items-center">
              <Eye size={16} className="mr-1" /> View
            </button>
            <button onClick={() => onEdit(event)} className="text-green-600 flex items-center">
              <Edit2 size={16} className="mr-1" /> Edit
            </button>
            <button onClick={() => onDelete(event.id)} className="text-red-500 flex items-center">
              <Trash2 size={16} className="mr-1" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
