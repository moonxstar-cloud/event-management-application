import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Copy, Share2, ArrowLeft } from "lucide-react";
import { Alert } from "./ui/alert";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useQueryClient } from '@tanstack/react-query';
const STATUS = {
  NONE: 'none',
  PENDING: 'pending',
  APPROVED: 'approved'
};

const EventCard = ({ event, onClose }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(STATUS.NONE);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (event?.attendees?.some(attendee => attendee._id === user?.id)) {
      setRegistrationStatus(STATUS.APPROVED);
    }
  }, [event, user]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error("Failed to share event");
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/luma/events/${event._id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register for event');
      }

      if (event.requireApproval) {
        setRegistrationStatus(STATUS.PENDING);
        toast.info("Registration pending host approval");
      } else {
        setRegistrationStatus(STATUS.APPROVED);
        toast.success("Successfully registered!");
        queryClient.invalidateQueries(['events']);
        onClose?.();
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAccept = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/luma/events/${event._id}/accept`, {
        // Add any additional data you want to send with the acceptance request
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setRegistrationStatus(STATUS.APPROVED);
      toast.success("Guest approved!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };
  const renderEventImage = () => (
    <div className="aspect-square w-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-lg overflow-hidden">
      {event.image ? (
        <img
          src={`http://localhost:8080/uploads/events/${event.image.filename}`}
          alt={event.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Calendar className="w-16 h-16 text-white" />
        </div>
      )}
    </div>
  );

  const renderEventDetails = () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>

      <div className="flex items-center gap-2 text-gray-600">
        <Calendar className="w-5 h-5" />
        <div>
          <p className="font-medium">
            {new Date(event.startDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm">
            {new Date(event.startDate).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>

      {event.location && (
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="w-5 h-5 mt-1" />
          <div>
            <p className="font-medium">{event.location}</p>
            <p className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
              View on map
            </p>
          </div>
        </div>
      )}
    </div>
  );


  const renderRegistrationSection = () => (
    <div className="pt-4 border-t">
      <h3 className="font-medium mb-2">Registration</h3>
      {registrationStatus === STATUS.APPROVED || event?.attendees?.some(attendee => attendee._id === user?.id) ? (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <p>You're in! 🎉</p>
        </Alert>
      ) : (
        <div className="space-y-4">
          {event.requireApproval && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <p className="font-medium">Approval Required</p>
                <p className="text-sm text-gray-500">
                  Host approval needed to join
                </p>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-pink-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
  
          <button
            onClick={handleRegister}
            disabled={isLoading || registrationStatus === STATUS.PENDING}
            className="w-full bg-black text-white p-3 rounded-xl"
            variant="default"
          >
            {isLoading ? "Registering..." : 
             registrationStatus === STATUS.PENDING ? "Approval Pending" : 
             "Register Now"}
          </button>
  
          {error && (
            <Alert variant="destructive">
              <p>{error}</p>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="w-full max-w-lg bg-white h-full overflow-y-auto">
        <div className="sticky top-0 bg-white z-10">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  variant="ghost"
                  size="icon"
                  className="text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShare}
                  variant="ghost"
                  size="icon"
                  className="text-gray-600"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!event.isPublic && (
            <Alert className="bg-pink-50 text-pink-900 border-pink-200">
              <p>Private Event</p>
            </Alert>
          )}
          
          {renderEventImage()}
          {renderEventDetails()}
          {renderRegistrationSection()}

          {event.description && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">About Event</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Hosted By</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500  ">
                  {event.creator?.name?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <p className="font-medium">{event.creator?.name || "Anonymous"}</p>
                <p className="text-sm text-gray-500">{event.creator?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;