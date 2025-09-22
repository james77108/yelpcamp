const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require ('./cities')

mongoose.connect('mongodb://127.0.0.1/yelp-camp', {}).then(() => {
    console.log("MONGO Connection Open!!")
})
.catch (err => {
    console.log("Oh no Mongo Connection Error")
    console.log(err)
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i =0; i <50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await camp.save();
    }
}

seedDB();