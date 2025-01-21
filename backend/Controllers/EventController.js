const EventModel = require('../Models/EventModel');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/events/' });
const NotificationModel = require('../Models/NotificationModel');

const Event = async(req, res) => {
    console.log(req.user);
    console.log('Form data:', req.body);
    console.log('File:', req.file);
    const { name, startDate, endDate, location, description, tickets, requireApproval, capacity, timezone } = req.body;
    // Image handling
    let imageData = null;
    if (req.file) {
        imageData = {
            url: `/uploads/events/${req.file.filename}`, // URL path to access the image
            filename: req.file.filename
        };
    }
    if (!name || !startDate || !endDate || !timezone) {
        // Delete uploaded image if validation fails
        if (imageData) {
            await fs.unlink(path.join(__dirname, '../uploads/events/', req.file.filename));
        }
        return res.status(400).json({ message: "Please provide all required fields" });
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
            creator: req.user.id, // Include the creator field here
            image: imageData
        })
        await newEvent.save();

        const populatedEvent = await EventModel.findById(newEvent._id)
            .populate('creator', 'name email')
            .populate('attendees', 'name email');

        res.status(201).json({
            message: "Event created successfully",
            event: populatedEvent
        });

    } catch (error) {

        if (req.file) {
            try {
                await fs.promises.unlink(path.join(__dirname, '../uploads/events/', req.file.filename));
            } catch (err) {
                if (err.code === 'ENOENT') {
                    console.log('File does not exist');
                } else {
                    console.error('Error deleting file:', err);
                }
            }
        }
    }
}

const AllEvent = async(req, res) => {
    try {
        const userId = req.user.id;
        const events = await EventModel.find({ creator: userId })
            .populate('creator', 'name email') // Populate creator details
            .populate('attendees', 'name email'); // Populate attendee details
        res.status(200).json({ total: events.length, events });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const Discover = async(req, res) => {
    try {
        
        const events = await EventModel.find()
            .populate('creator', 'name email') // Populate creator details
            .populate('attendees', 'name email'); // Populate attendee details
        res.status(200).json({ total: events.length, events });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const registerForEvent = async (req, res) => {
    const { eventId } = req.params;
    
    try {
        const event = await EventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is already registered
        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        if (event.requireApproval) {
            // Create notification for event host
            const notification = new NotificationModel({
                type: 'EVENT_JOIN_REQUEST',
                event: eventId,
                requester: req.user.id,
                host: event.creator
            });
            await notification.save();
            const hostNotifications = await NotificationModel.find({ host: event.creator });
      res.status(200).json({ message: 'Registration request sent to host', notifications: hostNotifications })
        } else {
            // Direct registration
            event.attendees.push(req.user.id);
            await event.save();
            
            res.status(200).json({ message: 'Successfully registered for event' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const attendeesForEvent =async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const notificationId = req.body.notificationId;
      const status = req.body.status;
  
      // Update the event's attendees list
      const event = await EventModel.findByIdAndUpdate(eventId, {
        $addToSet: { attendees: notificationId },
      });
      // Update the attendee count
      event.attendeeCount = event.attendees.length;

      await event.save();
  
      res.status(200).json({ message: 'Attendee added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
module.exports = { Event, AllEvent, Discover,registerForEvent,attendeesForEvent }