import { React, useState } from "react";
import { Calendar, Clock, MapPin, ChevronRight, Plus } from "lucide-react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import useEvents from "../hooks/useEvents";
import Header from "./Header";
import { useSelector } from "react-redux";
import ForbiddenError from "./ForbiddenError";
import EventCard from "./EventCard";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const Home = () => {
  const queryClient = new QueryClient();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { data, error, isLoading } = useEvents();
  const handleRetry = () => {
    // Implement retry logic here
    window.location.reload();
  };
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    console.log("Selected Event:", event);
  };
  // If you encounter a 403 error
  if (error?.status === 403) {
    return <ForbiddenError onRetry={handleRetry} errorDetails={error} />;
  }
  const handleCreateEvent = () => {
    if (!user) {
      // Save the current path to redirect back after login
      navigate("/login", { state: { from: location.pathname } });
    } else {
      navigate("/event");
    }
  };

  // Only redirect to login if trying to access protected data
  if (!user && data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div>
        <Header />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  {
    selectedEvent && (
      <QueryClientProvider client={queryClient}>
        <EventCard
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </QueryClientProvider>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-8">
        {user && (
          <div className="flex gap-4 mb-8 border-b">
            <button
              className={`pb-4 px-2 ${
                activeTab === "upcoming"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`pb-4 px-2 ${
                activeTab === "past"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past
            </button>
          </div>
        )}

        <div className="space-y-4">
          {!user ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to Event Manager
              </h3>
              <p className="text-gray-500 mb-6">
                Create an event or sign in to see your events
              </p>
              <button
                onClick={handleCreateEvent}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </div>
          ) : data.events.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first event to get started
              </p>
              <button
                onClick={handleCreateEvent}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </div>
          ) : (
            data.events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                  {event.image ? (
                    <img
                      src={`http://localhost:8080/uploads/events/${event.image.filename}`}
                      alt={event.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{event.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(event.startDate).toLocaleString()}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))
          )}
        </div>
        {selectedEvent && (
         <QueryClientProvider client={queryClient}>
            <EventCard
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
      </QueryClientProvider>
        )}
      </main>
    </div>
  );
};

export default Home;
