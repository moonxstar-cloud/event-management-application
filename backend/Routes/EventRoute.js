const { Event, AllEvent, Discover,registerForEvent,attendeesForEvent } = require("../Controllers/EventController");
const router = require("express").Router();
const { upload } = require("../config/multerConfig");
const { ensureAuthenticated } = require("../Middleware/Auth");

router.post("/create", ensureAuthenticated, upload.single("image"), Event);
router.get("/home",ensureAuthenticated,AllEvent);
router.get("/discover",Discover);
router.post("/events/:eventId/register", ensureAuthenticated, registerForEvent);
router.put('/events/:eventId/attendees', ensureAuthenticated,attendeesForEvent);
module.exports = router;