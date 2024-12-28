const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String, require: true
    }, email: {
        type: String, require: true
    },
    isAdmin: { type: Boolean, default: false },
    address: { type: String },
    department: { type: String },
    phone: {
        type: Number, require: true
    },
    profilePic: { type: String }
    , password: {
        type: String, require: true
    },
}, { timestamps: true });

const User = new mongoose.model("User", UserSchema);
module.exports = User;