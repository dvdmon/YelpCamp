const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
// adds on a username, a passport, makes sure usernames are unique, etc.: 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);