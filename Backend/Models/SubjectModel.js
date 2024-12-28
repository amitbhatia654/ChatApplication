const mongoose = require("mongoose")

const SubjectSchema = new mongoose.Schema({
    subjectName: {
        type: String, require: true
    },

    topics: [
        {
            title: { type: String, required: false },
            description: { type: String, required: false },
        },
    ],
    createdBy: {
        type: String, require: true
    }
})

const Subject = new mongoose.model("Subject", SubjectSchema)
module.exports = Subject