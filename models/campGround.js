const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviewSchema');

const campGroundSchema = new Schema(
    {
        title: String,
        price: String,
        description: String,
        location: String,
        image: String,
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