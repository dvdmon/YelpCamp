const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
//create a "virtual ("computed"?) field that looks like it's coming from our database
// it will return a version of the url which has been customized with an additional
// piece that resizes it via Cloudinary to make it smaller (width 200), IE a thumbnail
// We also took the images array out of the CampgroundSchema to do this, and then just
// refer to this new Schema in the CampgroundSchema

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: { // GeoJSON
        type: {
            type: String,
            enum: ['Point'], // makes it so type is always equal to 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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