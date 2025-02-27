const express = require("express");
const cors = require("cors");
const NotificationRoute = require('./Routes/NotificationRoute.js');
const path = require("path");



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

  
app.listen(port, console.log(`port is running on ${port}`));
