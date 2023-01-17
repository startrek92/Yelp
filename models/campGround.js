const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviewSchema');
const opts = { toJSON: { virtuals: true } };

const Image = new Schema({
    url: String,
    fileName: String
})

Image.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const campGroundSchema = new Schema(
    {
        title: String,
        price: String,
        description: String,
        location: String,
        image: [Image],
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
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
    }, opts
)

campGroundSchema.virtual('properties.popUpLink').get(function () {
    return `<a href="/camps/${this._id}">${this.title}</a>`
})

campGroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

module.exports = mongoose.model('CampGround', campGroundSchema);