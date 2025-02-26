const EventModel = require("../Models/EventModel");
const NotificationModel = require("../Models/NotificationModel");
const cloudinary = require("./cloudinaryconfig");

// Function to upload image to Cloudinary
const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("Invalid file data"));
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "events" }, // Upload to 'events' folder
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    stream.end(file.buffer); // Upload the file buffer
  });
};

const Event = async (req, res) => {
  console.log(req.user);
  console.log("Form data:", req.body);
  console.log("File:", req.file);

  const {
    name,
    startDate,
    endDate,
    location,
    description,
    tickets,
    requireApproval,
    capacity,
    timezone,
  } = req.body;

  if (!name || !startDate || !endDate || !timezone) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  let imageData = null;

  // Upload image to Cloudinary if a file is provided
  if (req.file) {
    try {
      const uploadResult = await uploadImageToCloudinary(req.file);
      imageData = {
        url: uploadResult.url,
        filename: uploadResult.public_id,
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res.status(500).json({ message: "Image upload failed" });
    }
  }

  try {
    const newEvent = new EventModel({
      name,
      startDate,
      endDate,
      location,
      description,
      tickets,
      requireApproval,
      capacity,
      timezone,
      creator: req.user.id,
      image: imageData,
    });

    await newEvent.save();

    const populatedEvent = await EventModel.findById(newEvent._id)
      .populate("creator", "name email")
      .populate("attendees", "name email");

    res.status(201).json({
      message: "Event created successfully",
      event: populatedEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all events created by the user
const AllEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await EventModel.find({ creator: userId })
      .populate("creator", "name email")
      .populate("attendees", "name email");

    res.status(200).json({ total: events.length, events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Discover all events
const Discover = async (req, res) => {
  try {
    const events = await EventModel.find()
      .populate("creator", "name email")
      .populate("attendees", "name email");

    res.status(200).json({ total: events.length, events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register for an event
const registerForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is already registered
    if (event.attendees.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    if (event.requireApproval) {
      // Create notification for event host
      const notification = new NotificationModel({
        type: "EVENT_JOIN_REQUEST",
        event: eventId,
        requester: req.user.id,
        host: event.creator,
      });
      await notification.save();

      const hostNotifications = await NotificationModel.find({
        host: event.creator,
      });

      res.status(200).json({
        message: "Registration request sent to host",
        notifications: hostNotifications,
      });
    } else {
      // Direct registration
      event.attendees.push(req.user.id);
      await event.save();

      res.status(200).json({ message: "Successfully registered for event" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve attendees for an event
const attendeesForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body; // The user being approved

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.requireApproval) {
      return res
        .status(400)
        .json({ message: "This event does not require approval" });
    }

    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: "User is already an attendee" });
    }

    event.attendees.push(userId);
    await event.save();

    res.status(200).json({ message: "Attendee approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  Event,
  AllEvent,
  Discover,
  registerForEvent,
  attendeesForEvent,
};
