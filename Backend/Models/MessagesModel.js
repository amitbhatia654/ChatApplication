const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    receiverId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
    senderId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
    message: { type: String, require: true }
}, { timestamps: true })


const Message = new mongoose.model("Message", MessageSchema)
module.exports = Message