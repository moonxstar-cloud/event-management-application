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
  const getNextHourTime = (offset = 0) => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + offset);
    return now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [eventData, setEventData] = useState({
    name: "",
    startDate: new Date().toISOString().split("T")[0],
    startTime: getNextHourTime(1), // Start time at the next hour
    endDate: new Date(new Date().getTime() + 86400000)
      .toISOString()
      .split("T")[0],
    endTime: getNextHourTime(2), // Start time at the next hour
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
      const response = await fetch(
        "https://backend-luma.vercel.app/luma/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
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
      <Header />
      <div className="max-w-3xl lg:max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Image Preview Section */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-300">
            <div className="aspect-w-16 aspect-h-14 bg-gradient-to-br from-gray-50 to-gray-100">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center space-y-3">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center border border-gray-300">
                    <ImageIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Theme</p>
                    <p className="font-medium text-gray-900">Pattern</p>
                  </div>
                </div>
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors rounded-md p-2.5 border border-gray-300">
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
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-300"
          >
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between  gap-3 mb-6">
              <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-300">
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-md">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Personal Calendar
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-300">
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
            <div className="relative mb-8">
  <input
    type="text"
    name="name"
    id="eventName"
    placeholder=" "
    className="w-full pt-6 pb-2 text-3xl font-semibold border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none peer bg-transparent"
    value={eventData.name}
    onChange={handleChange}
  />
  <label 
    htmlFor="eventName"
    className="absolute left-0 -top-1 text-gray-500 text-sm font-medium transition-all transform
              peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-gray-400
              peer-placeholder-shown:font-normal
              peer-placeholder-shown:translate-y-[2.1rem]
              peer-focus:-translate-y-0
              peer-focus:text-sm
              peer-focus:text-blue-600"
  >
    Event Title
  </label>
</div>

            {/* Date Time Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4  mb-6 border border-gray-300 ">
              <div className="grid grid-cols-[80px,1fr] max-[425px]:grid-cols-1 items-center gap-4">
                <span className=" bg-blue-600 text-white border-2 text-center  px-2 py-1 rounded-md max-[425px]:mb-2 font-medium">
                  Start
                </span>
                <div className="flex gap-4 max-[425px]:flex-col max-[425px]:gap-2 ">
                  <input
                    type="date"
                    name="startDate"
                    className="bg-transparent border-none focus:ring-0 max-[425px]:w-full"
                    value={eventData.startDate}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    name="startTime"
                    className="bg-transparent border-none focus:ring-0 max-[425px]:w-full"
                    value={eventData.startTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-[80px,1fr] max-[425px]:grid-cols-1  items-center gap-4">
                <span className="bg-blue-600 text-white border-2 text-center px-2 py-1 rounded-md max-[425px]:mb-2 font-medium">
                  End
                </span>
                <div className="flex gap-4 max-[425px]:flex-col max-[425px]:gap-2">
                  <input
                    type="date"
                    name="endDate"
                    className="bg-transparent border-none focus:ring-0  max-[425px]:w-full"
                    value={eventData.endDate}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    name="endTime"
                    className="bg-transparent border-none focus:ring-0  max-[425px]:w-full"
                    value={eventData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 max-[425px]:flex-col max-[425px]:items-start">
                <div className="flex items-center gap-2 max-[425px]:w-full">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <select
                    name="timezone"
                    className="text-sm bg-transparent border-none focus:ring-0 max-[425px]:w-full"
                    value={eventData.timezone}
                    onChange={handleChange}
                  >
                    <option value="GMT+05:00">GMT+05:00 Karachi</option>
                    <option value="GMT+00:00">GMT+00:00 London</option>
                    <option value="GMT-05:00">GMT-05:00 New York</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4 mb-6">
  {/* Location Input */}
  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-300
                  transition-colors hover:border-gray-400
                  focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 transition-colors group-focus-within:text-blue-500" />
    <input
      type="text"
      name="location"
      placeholder="Add location or online meeting link"
      className="w-full bg-transparent placeholder-gray-400/80 outline-none
                text-gray-700 focus:placeholder-gray-400"
      value={eventData.location}
      onChange={handleChange}
    />
  </div>

  {/* Description Textarea */}
  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-300
                  transition-colors hover:border-gray-400
                  focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
    <FileText className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0 transition-colors group-focus-within:text-blue-500" />
    <textarea
      name="description"
      placeholder="Tell attendees what to expect..."
      rows="3"
      className="w-full bg-transparent resize-none outline-none
                text-gray-700 placeholder-gray-400/80 focus:placeholder-gray-400
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      value={eventData.description}
      onChange={handleChange}
    />
  </div>
</div>

            {/* Event Options */}
            <div className="space-y-6 p-5 bg-gray-50 rounded-xl border border-gray-300">
              <h3 className="font-semibold text-gray-900 text-lg">
                Event Options
              </h3>

              {/* Tickets */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Ticket className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Tickets</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    name="tickets"
                    className="border-gray-200 rounded-lg px-3 py-1.5 bg-white"
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
