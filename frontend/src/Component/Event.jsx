import React, { useState, useCallback } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Ticket,
  Users,
  Globe,
  AlertCircle,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { Alert, AlertDescription } from "../Component/ui/alert";
import Header from "./Header";

const Event = () => {
  const [eventData, setEventData] = useState({
    name: "",
    startDate: "2025-01-20",
    startTime: "10:00",
    endDate: "2025-01-20",
    endTime: "14:00",
    timezone: "GMT+05:00",
    location: "",
    description: "",
    isPublic: true,
    tickets: "Free",
    ticketPrice: "",
    requireApproval: false,
    capacity: "Unlimited",
    customCapacity: "",
    image: null,
    theme: "pattern",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setEventData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!eventData.name.trim()) {
      newErrors.name = "Event name is required";
    }

    if (
      new Date(`${eventData.endDate} ${eventData.endTime}`) <=
      new Date(`${eventData.startDate} ${eventData.startTime}`)
    ) {
      newErrors.endDate = "End time must be after start time";
    }

    if (eventData.tickets === "Paid" && !eventData.ticketPrice) {
      newErrors.ticketPrice = "Ticket price is required for paid events";
    }

    if (eventData.capacity === "Custom" && !eventData.customCapacity) {
      newErrors.customCapacity = "Capacity number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [eventData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Get the auth token from localStorage or your auth state management
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to create an event");
      }

      const formData = new FormData();
      formData.append("name", eventData.name);
      formData.append(
        "startDate",
        `${eventData.startDate}T${eventData.startTime}:00`
      );
      formData.append(
        "endDate",
        `${eventData.endDate}T${eventData.endTime}:00`
      );
      formData.append("location", eventData.location);
      formData.append("description", eventData.description);
      formData.append(
        "tickets",
        eventData.tickets === "Paid" ? `${eventData.ticketPrice}` : "Free"
      );
      formData.append("requireApproval", eventData.requireApproval);
      if (eventData.capacity === "Unlimited") {
        formData.append("capacity", Infinity);
      } else if (eventData.capacity === "Custom") {
        formData.append("capacity", parseInt(eventData.customCapacity));
      }
      formData.append("timezone", eventData.timezone);
      if (eventData.image) {
        console.log("Image file:", eventData.image); // Log the image file
        formData.append("image", eventData.image);
      }
      // Check for all required fields
      if (
        !eventData.name ||
        !eventData.startDate ||
        !eventData.startTime ||
        !eventData.endDate ||
        !eventData.endTime ||
        !eventData.timezone
      ) {
        setSubmitError("Please provide all required fields");
        setIsSubmitting(false);
        return;
      }

      console.log("FormData before fetch:", JSON.stringify(formData));
      // Make the API call
      const response = await fetch("http://localhost:8080/luma/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("FormData entries:");
      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      const result = await response.json();
      setSubmitSuccess(true);

      // Reset form or redirect
      setTimeout(() => {
        // Redirect to event page or clear form
        setEventData({
          name: "",
          startDate: "2025-01-20",
          startTime: "10:00",
          endDate: "2025-01-20",
          endTime: "14:00",
          timezone: "GMT+05:00",
          location: "",
          description: "",
          isPublic: true,
          tickets: "Free",
          ticketPrice: "",
          requireApproval: false,
          capacity: "Unlimited",
          customCapacity: "",
          image: null,
          theme: "pattern",
        });
        setPreviewImage(null);
      }, 2000);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log("EventData before fetch:", eventData);
  console.log("Form values before fetch:", {
    name: eventData.name,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    location: eventData.location,
    description: eventData.description,
    tickets: eventData.tickets,
    requireApproval: eventData.requireApproval,
    timezone: eventData.timezone,
    capacity: eventData.capacity,
    image: eventData.image,
  });
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Header/>
      <div className="max-w-3xl lg:max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Image Preview Section */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-w-16 aspect-h-14 bg-gray-100">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Theme</p>
                    <p className="font-medium">Pattern</p>
                  </div>
                </div>
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors rounded-md p-2">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-3/5">
          {submitError && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {submitSuccess && (
            <Alert className="mb-4" variant="success">
              <AlertDescription>Event created successfully!</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-md">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Personal Calendar
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-md">
                <Globe className="w-4 h-4 text-gray-500" />
                <select
                  className="bg-transparent text-sm text-gray-600 border-none focus:ring-0"
                  value={eventData.isPublic ? "public" : "private"}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "isPublic",
                        value: e.target.value === "public",
                      },
                    })
                  }
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            {/* Event Name */}
            <input
              type="text"
              name="name"
              placeholder="Event name"
              className="w-full text-3xl font-semibold border-none focus:ring-0 focus:border-none mb-6"
              value={eventData.name}
              onChange={handleChange}
            />

            {/* Date Time Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4 mb-6">
              <div className="grid grid-cols-[80px,1fr] items-center">
                <span className="text-gray-600">Start</span>
                <div className="flex gap-4">
                  <input
                    type="date"
                    name="startDate"
                    className="bg-transparent border-none focus:ring-0"
                    value={eventData.startDate}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    name="startTime"
                    className="bg-transparent border-none focus:ring-0"
                    value={eventData.startTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-[80px,1fr] items-center">
                <span className="text-gray-600">End</span>
                <div className="flex gap-4">
                  <input
                    type="date"
                    name="endDate"
                    className="bg-transparent border-none focus:ring-0"
                    value={eventData.endDate}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    name="endTime"
                    className="bg-transparent border-none focus:ring-0"
                    value={eventData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <select
                  name="timezone"
                  className="text-sm bg-transparent border-none focus:ring-0"
                  value={eventData.timezone}
                  onChange={handleChange}
                >
                  <option value="GMT+05:00">GMT+05:00 Karachi</option>
                  <option value="GMT+00:00">GMT+00:00 London</option>
                  <option value="GMT-05:00">GMT-05:00 New York</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  placeholder="Add location (optional)"
                  className="w-full bg-transparent border-none focus:ring-0"
                  value={eventData.location}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-400 mt-1" />
                <textarea
                  name="description"
                  placeholder="Add description (optional)"
                  rows="3"
                  className="w-full bg-transparent border-none focus:ring-0 resize-none"
                  value={eventData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Event Options */}
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900">Event Options</h3>

              {/* Tickets */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Ticket className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Tickets</span>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    name="tickets"
                    className="border-gray-200 rounded-md"
                    value={eventData.tickets}
                    onChange={handleChange}
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                  {eventData.tickets === "Paid" && (
                    <input
                      type="number"
                      name="ticketPrice"
                      placeholder="Price"
                      className="w-24 border-gray-200 rounded-md"
                      value={eventData.ticketPrice}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>

              {/* Approval */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Require approval</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="requireApproval"
                    className="sr-only peer"
                    checked={eventData.requireApproval}
                    onChange={handleChange}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
                </label>
              </div>

              {/* Capacity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Capacity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    name="capacity"
                    className="border-gray-200 rounded-md"
                    value={eventData.capacity}
                    onChange={handleChange}
                  >
                    <option value="Unlimited">Unlimited</option>
                    <option value="Custom">Limited</option>
                  </select>
                  {eventData.capacity === "Custom" && (
                    <input
                      type="number"
                      name="customCapacity"
                      placeholder="Number"
                      className="w-24 border-gray-200 rounded-md"
                      value={eventData.customCapacity}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Event;
