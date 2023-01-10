// Careful Running this file
// It will delete all data from collections(DB)
// and will add new random data generated from this script
const CampGround = require('../models/campGround');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Review = require('../models/reviewSchema');

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
    await Review.deleteMany({});

    // Random Data in DB
    for (let i = 0; i < 50; ++i) {
        const desc = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque repellat itaque quis! Soluta expedita eveniet esse, blanditiis adipisci, a odit delectus non asperiores pariatur facilis quam voluptas, quasi et sunt. Praesentium, saepe. Sed odit fuga harum, dolorum quibusdam asperiores molestiae enim in blanditiis architecto quo iste. Asperiores iste itaque tempore, alias sequi facilis velit molestias, cupiditate corporis vitae quia sunt!`;
        const name1 = Math.floor(Math.random() * places.length);
        const name2 = Math.floor(Math.random() * descriptors.length);
        const price = Math.floor(Math.random() * 100) + 100;
        const campName = `${descriptors[name2]}-${places[name1]}`;
        const loc = Math.floor(Math.random() * 1000);
        const camp = new CampGround({
            title: campName,
            price: price,
            description: desc,
            location: `${cities[loc].city}, ${cities[loc].state}`,
            image: `https://picsum.photos/300`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})