import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Users, Clock, MapPin, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import useEvents from "../hooks/useEvents";
import EventCard from "./EventCard";
import moment from 'moment';
const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data, error, isLoading } = useEvents();
  const [activeTab, setActiveTab] = useState("hosted");
  const [selectedEvent, setSelectedEvent] = useState(null); // Add this state

  const profileData = useMemo(() => {
    if (data) {
      const hostedEvents = data.events.filter(
        (event) => event.creator._id === user.id
      );
      const attendedEvents = data.events.filter((event) =>
        event.attendees.includes(user.id)
      );
      const upcomingEvents = data.events.filter(
        (event) => new Date(event.startDate) > new Date()
      );
      return {
        hostedEvents,
        attendedEvents,
        joinDate: user.createdAt,
        stats: {
          totalHosted: hostedEvents.length,
          totalAttended: attendedEvents.length,
          upcomingEvents: upcomingEvents.length,
        },
      };
    }
    return {};
  }, [data, user]);

  useEffect(() => {
    console.log("Profile Data:", profileData);
  }, [profileData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Error: {error.message}</div>
        </div>
      </div>
    );
  }
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl font-medium text-gray-600">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h1 className="text-2xl  font-semibold text-gray-900">
                {user?.name}
              </h1>
              <p className="text-gray-500">
                Member since{" "}
                {moment(user.createdAt).format('MMMM , YYYY')}
              </p>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Hosted Events</span>
              </div>
              <p className="text-2xl font-semibold mt-2">
                {profileData.stats.totalHosted}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">
                  Attended Events
                </span>
              </div>
              <p className="text-2xl font-semibold mt-2">
                {profileData.stats.totalAttended}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-medium">
                  Upcoming Events
                </span>
              </div>
              <p className="text-2xl font-semibold mt-2">
                {profileData.stats.upcomingEvents}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Events Tabs */}
      <div className="max-w-lg border-2  mx-auto px-4 py-8 ">
        <div className="flex gap-4 mb-8 border-b">
          <button
            className={`pb-4 px-2 ${
              activeTab === "hosted"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("hosted")}
          >
            Hosted Events
          </button>
          <button
            className={`pb-4 px-2 ${
              activeTab === "attended"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("attended")}
          >
            Attended Events
          </button>
        </div>
        <div className="border-2  ">
          {/* Events List */}
          {activeTab === "hosted" && (
            <div>
              {profileData.hostedEvents.length > 0 ? (
                profileData.hostedEvents.map((event) => (
                  <div
                    onClick={() => handleEventClick(event)}
                    key={event._id}
                    className="bg-white p-4 rounded-lg shadow mb-4  "
                  >
                    {event.image && (
                      <img
                        src={event.image.url}
                        alt={event.name}
                        className="w-full h-48 object-cover rounded"
                      />
                    )}
                    <h2 className="text-lg font-semibold">{event.name}</h2>
                    <p className="text-gray-600">
                      {new Date(event.startDate).toLocaleString()}
                    </p>
                    {event.location && (
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hosted events found.</p>
              )}
            </div>
          )}
          {activeTab === "attended" && (
            <div>
              {profileData.attendedEvents.length > 0 ? (
                profileData.attendedEvents.map((event) => (
                  <div
                    onClick={() => handleEventClick(event)}
                    key={event._id}
                    className="bg-white p-4 rounded-lg shadow mb-4"
                  >
                    <img
                      src={event.image.url}
                      alt={event.name}
                      className="w-full h-48 object-cover rounded"
                    />
                    <h2 className="text-lg font-semibold">{event.name}</h2>
                    <p className="text-gray-600">
                      {new Date(event.startDate).toLocaleString()}
                    </p>
                    <p className="text-gray-500">{event.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No attended events found.</p>
              )}
            </div>
          )}
        </div>
      </div>
      {selectedEvent && (
        <EventCard
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default Profile;
