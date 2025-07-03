// components/events/EventForm.jsx
import React from 'react';

const EventForm = ({ formData, setFormData, onSubmit, onCancel, editing }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label>Event Title</label>
        <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
      </div>
      <div>
        <label>Host Name</label>
        <input type="text" value={formData.hostName} onChange={e => setFormData({ ...formData, hostName: e.target.value })} required />
      </div>
      {/* Add other inputs like book, author, date, time, etc. */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {editing ? 'Update' : 'Create'} Event
      </button>
      <button type="button" onClick={onCancel} className="ml-2 text-gray-600">
        Cancel
      </button>
    </form>
  );
};

export default EventForm;
