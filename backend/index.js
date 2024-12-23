const express=require('express');
const cors = require('cors');
const app=express();
app.use(cors());



const UserRoute=require('./Routes/UserRoute.js');
const EventRoute=require('./Routes/EventRoute.js');
require('dotenv').config();
require('./connectionDB.js');

const port=process.env.PORT || 8080;

//middleware
app.use(express.json())

//route
app.use('/luma',UserRoute)
app.use('/luma',EventRoute)


app.listen(port, console.log(`port is running on ${port}`))