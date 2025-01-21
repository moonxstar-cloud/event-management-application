const express = require('express');
const router = express.Router();
const { getNotifications, handleNotification } = require('../Controllers/NotificationController');
const { ensureAuthenticated } = require('../Middleware/Auth');

router.get('/notifications', ensureAuthenticated, getNotifications);
router.post('/notifications/:id', ensureAuthenticated, handleNotification);

module.exports = router;