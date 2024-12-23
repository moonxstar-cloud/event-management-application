import React, { useState } from 'react';
import { Calendar, Clock, MapPin, FileText, Ticket, Users, Globe, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axios'; // Your axios instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const Event = () => {
  const navigate = useNavigate(); // Use useNavigate hook
  const [eventData, setEventData] = useState({
    name: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timezone: 'GMT+05:00',
    location: '',
    description: '',
    isPublic: true,
    tickets: 'Free',
    ticketPrice: '',
    requireApproval: false,
    capacity: 'Unlimited',
    customCapacity: ''
  });

  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: async (newEvent) => {
      const response = await axiosInstance.post('/luma/create', newEvent);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Event created successfully:', data);
      navigate('/home')
      // Optionally reset the form or show a success message
    },
    onError: (error) => {
      console.error('Error creating event:', error);
    },
  });


  // Get current date in the format "Mon, Dec 23"
  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get current time rounded to nearest hour in 12-hour format
  const getFormattedTime = (addHour = 0) => {
    const date = new Date();
    date.setHours(date.getHours() + addHour);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(eventData); // Trigger the mutation
  };


  const ErrorMessage = ({ message }) => (
    message ? (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    ) : null
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between mb-6">
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Personal Calendar</span>
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md">
          <Globe className="w-4 h-4 text-gray-500" />
          <select 
            name="visibility"
            className="bg-transparent border-none text-gray-600 focus:ring-0"
            value={eventData.isPublic ? 'public' : 'private'}
            onChange={(e) => setEventData(prev => ({...prev, isPublic: e.target.value === 'public'}))}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          className={`w-full text-2xl font-medium text-purple-700 border-none focus:ring-0 placeholder-purple-300 ${
            errors.name ? 'bg-red-50' : ''
          }`}
          value={eventData.name}
          onChange={handleChange}
        />
        <ErrorMessage message={errors.name} />
      </div>

      {/* Updated Date/Time Section */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-4">
        {/* Start Time Row */}
        <div className="flex items-center">
          <div className="w-16 text-indigo-600">Start</div>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              name="startDate"
              placeholder={getFormattedDate()}
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-700"
              value={eventData.startDate}
              onChange={handleChange}
            />
            <input
              type="text"
              name="startTime"
              placeholder={getFormattedTime()}
              className="w-24 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-700"
              value={eventData.startTime}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* End Time Row */}
        <div className="flex items-center">
          <div className="w-16 text-indigo-600">End</div>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              name="endDate"
              placeholder={getFormattedDate()}
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-700"
              value={eventData.endDate}
              onChange={handleChange}
            />
            <input
              type="text"
              name="endTime"
              placeholder={getFormattedTime(1)}
              className="w-24 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-700"
              value={eventData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Timezone */}
        <div className="flex justify-end items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-500" />
          <select
            name="timezone"
            className="bg-transparent border-none text-gray-600 focus:ring-0 pr-8"
            value={eventData.timezone}
            onChange={handleChange}
          >
            <option value="GMT+05:00">GMT+05:00 Karachi</option>
            <option value="GMT+00:00">GMT+00:00 London</option>
            <option value="GMT-05:00">GMT-05:00 New York</option>
            <option value="GMT+08:00">GMT+08:00 Singapore</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="location"
            placeholder="Add Event Location (Optional)"
            className="w-full bg-transparent border-none focus:ring-0"
            value={eventData.location}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
          <FileText className="w-5 h-5 text-gray-400 mt-1" />
          <textarea
            name="description"
            placeholder="Add Description (Optional)"
            rows="3"
            className="w-full bg-transparent border-none focus:ring-0 resize-none"
            value={eventData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Event Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ticket className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Tickets</span>
            </div>
            <div className="flex items-center space-x-2">
              <select
                name="tickets"
                className="text-gray-600 border-gray-200 rounded"
                value={eventData.tickets}
                onChange={handleChange}
              >
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
              {eventData.tickets === 'Paid' && (
                <div>
                  <input
                    type="number"
                    name="ticketPrice"
                    placeholder="Price"
                    className={`w-24 border-gray-200 rounded ${errors.ticketPrice ? 'border-red-500' : ''}`}
                    value={eventData.ticketPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                  <ErrorMessage message={errors.ticketPrice} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Require Approval</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="requireApproval"
                className="sr-only peer"
                checked={eventData.requireApproval}
                onChange={handleChange}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 
                            after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all
                            peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Capacity</span>
            </div>
            <div className="flex items-center space-x-2">
              <select
                name="capacity"
                className="text-gray-600 border-gray-200 rounded"
                value={eventData.capacity}
                onChange={handleChange}
              >
                <option value="Unlimited">Unlimited</option>
                <option value="10">10 people</option>
                <option value="20">20 people</option>
                <option value="50">50 people</option>
                <option value="100">100 people</option>
                <option value="Custom">Custom</option>
              </select>
              {eventData.capacity === 'Custom' && (
                <div>
                  <input
                    type="number"
                    name="customCapacity"
                    placeholder="Enter capacity"
                    className={`w-24 border-gray-200 rounded ${errors.customCapacity ? 'border-red-500' : ''}`}
                    value={eventData.customCapacity}
                    onChange={handleChange}
                    min="1"
                  />
                  <ErrorMessage message={errors.customCapacity} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Event
      </button>
    </form>
  );
};

export default Event;