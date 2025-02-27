import React, { useState,useMemo  } from 'react';
import { Calendar, Clock, MapPin, Search, Filter, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';
import useDiscover from '../hooks/useDiscover';
import EventCard from './EventCard';
const Discover = () => {
  
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data, error, isLoading, mutate } = useDiscover();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const categories = [
    'all',
    'music',
    'sports',
    'tech',
    'food',
    'arts',
    'business'
  ];
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    console.log('Event clicked:', event);
  };
  



  const filteredEvents = useMemo(() => {
    const now = new Date();
    return data?.events.filter(event => {
      const eventEndDate = new Date(event.endDate);
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const isUpcoming = eventEndDate >= now; // Only show events that haven't ended yet
      return matchesSearch && matchesCategory && isUpcoming;
    });
  }, [data, searchQuery, selectedCategory]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg h-72"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Error loading events</h2>
            <p className="text-gray-600 mt-2">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents?.map((event) => (
              <div
              onClick={() => handleEventClick(event)}
                key={event._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Event Image */}
                <div 
                  className="aspect-w-16 aspect-h-9 bg-gray-100 cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  {event.image ? (
                    <img
                      src={event.image.url}
                      alt={event.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-4">
                <h2 className="text-lg font-semibold">{event.name}</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm"> {new Date(event.startDate).toLocaleString()}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.attendees?.length || 0} attending</span>
                    </div>
                  </div>

                  
                  
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedEvent && (
  <EventCard 
    event={selectedEvent} 
    onClose={() => setSelectedEvent(null)}
  />
)}
      </main>
    </div>
  );
};

export default Discover;
