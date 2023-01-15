const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviewSchema');

const Image = new Schema({
    url: String,
    fileName: String
})

Image.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const campGroundSchema = new Schema(
    {
        title: String,
        price: String,
        description: String,
        location: String,
        image: [Image],
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review'
            }
        ]
    }
)


campGroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

module.exports = mongoose.model('CampGround', campGroundSchema);