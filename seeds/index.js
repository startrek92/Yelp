// Careful Running this file
// It will delete all data from collections(DB)
// and will add new random data generated from this script
const CampGround = require('../models/campGround');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, })
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.log("Error");
        console.log(err);
    });

const seedDB = async () => {
    await CampGround.deleteMany({}); // deletes all data from DB

    // Random Data in DB
    for (let i = 0; i < 50; ++i) {
        const desc = Math.floor(Math.random() * descriptors.length);
        const place = Math.floor(Math.random() * places.length);
        const price = Math.floor(Math.random() * 100) + 100;
        const campName = `${descriptors[desc]}-${places[place]}`;
        const loc = Math.floor(Math.random() * 1000);
        const camp = new CampGround({
            title: campName,
            price: price,
            description: descriptors[desc],
            location: `${cities[loc].city}, ${cities[loc].state}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})