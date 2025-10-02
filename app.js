// set up express
const express = require("express");
const path = require("path"); //??? what is this for
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const Campground = require("./models/campground"); // import model
const methodOverride = require("method-override");

const app = express();

// get this from mongoose
// use .then and .catch otherwise -> find out why
mongoose
    .connect("mongodb://127.0.0.1/yelp-camp", {})
    .then(() => {
        console.log("MONGO Connection Open!!");
    })
    .catch((err) => {
        console.log("Oh no Mongo Connection Error");
        console.log(err);
    });

// connect to mongoose
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// set up ejs-mate
app.engine("ejs", ejsMate);

// set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// render home view
// for initial testing/set-up, use res.send('Hello YelpCamp')
app.get("/", (req, res) => {
    res.render("home");
});

// haven't created makecampground view yet???
app.get("/makecampground", async (req, res) => {
    const camp = new Campground({
        title: "my backyard",
        description: "cheap camping",
    });
    await camp.save();
    res.send(camp);
});

// listen to GET requests to /campgrounds
// fetch campgrounds from MongoDB
// uses Mongoose to query the database (find ({}) with empty filter returns all campgrounds from the campgrounds collection
app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds }); //passes campgrounds data to the template
}));

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// post post new works
// app.post('/campgrounds', async(req,res)=> {
//     res.send(req.body)
// })

app.post("/campgrounds", catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})
);

app.get("/campgrounds/:id", catchAsync (async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
}));

// set up edit page
app.get("/campgrounds/:id/edit", catchAsync (async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}));

// update
app.put("/campgrounds/:id", catchAsync (async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// delete
app.delete("/campgrounds/:id", catchAsync (async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

app.use((err, req, res, next) => {
    res.send("something went wrong");
});

// set up listening portal at 3000
app.listen(3000, () => {
    console.log("Serving on port 3000");
});
