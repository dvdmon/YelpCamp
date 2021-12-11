const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
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
});

// Mongoose middleware that runs post (after) the 'findOneAndDelete' method - 
// in this case it takes the item (Campground) that's being deleted, and if it 
// exists, it then does a deleteMany on the reviews collection and bases that 
// delete many on the constraint of the _id in the reviews collection being in the
// to-be-deleted Campground's reviews array - thus removing any potentially orphaned
// reviews 
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('CampGround', CampgroundSchema);