const mongoose = require("mongoose");
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Succes connect to MongoDB");
    } catch (err){
        console.log(err,"MongoDB Connection Failed!");
        process.exit(1);
    }
};

module.exports = connectDB;