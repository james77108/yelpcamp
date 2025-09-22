// populate the database with sample data for testing
// so that I can test my app with realistic-looking entries


//imports and setup
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require ('./cities');
const {places, descriptors} = require('./seedHelpers');

//connect to mongoDB
mongoose.connect('mongodb://127.0.0.1/yelp-camp', {}).then(() => {
    console.log("MONGO Connection Open!!")
})
.catch (err => {
    console.log("Oh no Mongo Connection Error")
    console.log(err)
})

//optional event logging
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

// helper function: pick a random element from an array
// generate random campground titles
const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany({}); // clears all existing campground data
    for (let i =0; i <50; i++) { //create 50 new campground entries 
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`, // randome city state
            title: `${sample(descriptors)} ${sample(places)}` // random combo of descriptor and place
        })
        await camp.save();
    }
}

// run the seeder and close the connection
seedDB().then(() => {
    mongoose.connection.close()
});