const express = require('express');
const path = require('path');
const cities = require('./cities.js');
const { places, descriptors } = require('./seedHelpers.js');
const mongoose = require('mongoose');
const Campground = require('../models/campground');


// connect to Mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// returns a string from a passed in array where we take a random element of that array
const sample = arr => arr[(Math.floor(Math.random() * arr.length))];

//main function that seeds our DB:
const seedDB = async () => {

    // first delete old records
    await Campground.deleteMany({});

    // now loop 50 times to create a set of randomly generated campgrounds based on cities.js
    // and seedHelpers.js.
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        //const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta distinctio, placeat suscipit iusto ex impedit vero quidem mollitia aliquam! Rem cupiditate aspernatur iure recusandae eaque ut architecto similique illo voluptatem.'
            //price
        })
        await camp.save();
    }


}


// seedDB() is actually called so that we just need to type node index.js in the commandline to
// make the seeding occur.
seedDB().then(() => {
    mongoose.connection.close();
});