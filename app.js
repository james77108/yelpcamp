// set up express
const express = require ('express');
const path = require('path') //??? what is this for
const mongoose = require('mongoose');
const Campground = require('./models/campground') // import model

const app = express();

// get this from mongoose
// use .then and .catch otherwise -> find out why
mongoose.connect('mongodb://127.0.0.1/yelp-camp', {}).then(() => {
    console.log("MONGO Connection Open!!")
})
.catch (err => {
    console.log("Oh no Mongo Connection Error")
    console.log(err)
})

// connect to mongoose
const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

// set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// render home view
// for initial testing/set-up, use res.send('Hello YelpCamp')
app.get('/', (req, res) => {
    res.render('home')
})

// haven't created makecampground view yet???
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({title: 'my backyard', description: 'cheap camping'});
    await camp.save();
    res.send(camp)
})

// set up listening portal at 3000
app.listen(3000, () => {
    console.log ('Serving on port 3000')
})
