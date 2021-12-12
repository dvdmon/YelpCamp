const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

//create a "virtual ("computed"?) field that looks like it's coming from our database
// it will return a version of the url which has been customized with an additional
// piece that resizes it via Cloudinary to make it smaller (width 200), IE a thumbnail
// We also took the images array out of the CampgroundSchema to do this, and then just
// refer to this new Schema in the CampgroundSchema
const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// By default, mongoose does not include virtuals when you convert a document to JSON, EG
// when you pass a docuemtn to Express via res.json(), so we must set the option here to enable it
const opts = { toJSON: { virtuals: true } };






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
}, opts);

// createa another virtual field, this time specifying that it should create a property
// called 'properties' and then have that properies property be an object containing a
// string called popUpMarkup
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>
    <p>${this.description.substring(0, 20)}...</p>
    `;
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