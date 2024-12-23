const mongoose=require('mongoose');


//connect to mongodb
const mongo_url=process.env.MONGODB_URL;
mongoose.connect(mongo_url)
.then(()=>console.log('MongoDB connected'))
.catch((err)=>console.log("MongoDB connection ERROR",err));
