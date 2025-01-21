const NotificationModel = require('../Models/NotificationModel');
const EventModel = require('../Models/EventModel');

const getNotifications = async (req, res) => {
    try {
        const notifications = await NotificationModel.find({ 
            host: req.user.id,
            // status: 'pending',
            read: false
        })
        .populate('event', 'name')
        .populate('requester', 'name email')
        .sort('-createdAt');

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const handleNotification = async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;
    console.log('Received action:', action);
    try {
      const notification = await NotificationModel.findByIdAndUpdate(id,{ $set: { status: action,read:true },});
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      if (notification.host.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      if (action === 'accept') {
        // Add user to event attendees
        await EventModel.findByIdAndUpdate(
          notification.event,
          { $addToSet: { attendees: notification.requester } }
        );
        notification.status = 'accepted';

        await notification.save();
        res.status(200).json({ message: 'Request accepted successfully' });
      } else if (action === 'reject') {
        notification.status = 'rejected';
        await notification.save();
        res.status(200).json({ message: 'Request rejected successfully' });
      } else {
        res.status(400).json({ message: 'Invalid action' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


module.exports = { getNotifications, handleNotification };