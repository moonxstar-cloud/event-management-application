const express = require("express");
const cors = require("cors");
const NotificationRoute = require('./Routes/NotificationRoute.js');
const path = require("path");
const WebSocket = require('ws');


const UserRoute = require("./Routes/UserRoute.js");
const EventRoute = require("./Routes/EventRoute.js");
require("dotenv").config();
require("./connectionDB.js");

const app = express();
const port = process.env.PORT || 8080;
const wsPort = 8081;
//middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Static file serving
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
//route
app.use("/luma", UserRoute);
app.use("/luma", EventRoute);
app.use('/luma', NotificationRoute);
// app.get('/luma/profile', async(req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     try {
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         const user = await User.findById(decoded.id).populate('hostedEvents attendedEvents');

//         if (!user) {
//             return res.status(404).json({ message: 'User  not found' });
//         }

//         const profileData = {
//             joinDate: user.createdAt,
//             hostedEvents: user.hostedEvents,
//             attendedEvents: user.attendedEvents,
//             stats: {
//                 totalHosted: user.hostedEvents.length,
//                 totalAttended: user.attendedEvents.length,
//                 upcomingEvents: user.hostedEvents.filter(event => new Date(event.date) > new Date()).length,
//             },
//         };

//         res.json(profileData);
//     } catch (error) {
//         console.error('Error fetching profile data:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// })
// Implement WebSocket server-side code here
const wss = new WebSocket.Server({ port: wsPort });
wss.on('connection', (ws) => {
    console.log('Client connected');
  
    ws.on('message', (message) => {
      console.log(`Received message => ${message}`);
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
  
  
app.listen(port, console.log(`port is running on ${port}`));