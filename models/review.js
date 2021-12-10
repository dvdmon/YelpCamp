const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
    rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);
