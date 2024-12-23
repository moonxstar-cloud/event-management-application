const EventModel = require('../Models/EventModel');

const Event = async (req,res) => {
    const { name, startDate, endDate, location, description, tickets, requireApproval, capacity, timezone } = req.body;
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
            timezone
        })     
        await newEvent.save();
        res.status(201).json(newEvent);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}
// Get all events
const AllEvent=async(req,res)=>{
        try{
            const events=await EventModel.find();
            res.status(200).json({ total: events.length, events }); // Send response with total count and events
        }
        catch(error){
            res.status(500).json({ message: error.message });
        }   
}

module.exports = { Event, AllEvent };