// Careful Running this file
// It will delete all data from collections(DB)
// and will add new random data generated from this script
const CampGround = require('../models/campGround');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Review = require('../models/reviewSchema');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true })
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
    for (let i = 0; i < 500; ++i) {
        const fakeReview = new Review({
            body: 'This is fake Review',
            rating: 3,
            author: '63c0e28b5b48aebe1be2714f'
        });
        const savedReview = await fakeReview.save();
        const desc = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque repellat itaque quis! Soluta expedita eveniet esse, blanditiis adipisci, a odit delectus non asperiores pariatur facilis quam voluptas, quasi et sunt. Praesentium, saepe. Sed odit fuga harum, dolorum quibusdam asperiores molestiae enim in blanditiis architecto quo iste. Asperiores iste itaque tempore, alias sequi facilis velit molestias, cupiditate corporis vitae quia sunt!`;
        const name1 = Math.floor(Math.random() * places.length);
        const name2 = Math.floor(Math.random() * descriptors.length);
        const price = Math.floor(Math.random() * 100) + 100;
        const campName = `${descriptors[name2]}-${places[name1]}`;
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        const camp = new CampGround({
            title: campName,
            price: price,
            description: desc,
            location: `${cities[randomCityIndex].city}, ${cities[randomCityIndex].state}`,
            image: [
                {
                    url: 'https://res.cloudinary.com/ddtvy9vcy/image/upload/v1673872810/YelpCamp/cckejhal5nyxtmy7mn5t.jpg',
                    fileName: 'YelpCamp/cckejhal5nyxtmy7mn5t',
                  },
                  {
                    url: 'https://res.cloudinary.com/ddtvy9vcy/image/upload/v1673872827/YelpCamp/vs1olvfh0iexkwxpmd73.jpg',
                    fileName: 'YelpCamp/vs1olvfh0iexkwxpmd73',
                  }
            ],
            geometry:
            {
                type: 'Point',
                coordinates: [
                    cities[randomCityIndex].longitude,
                    cities[randomCityIndex].latitude
                ]
            },
            author: '63c0e28b5b48aebe1be2714f',
            reviews: savedReview._id
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})