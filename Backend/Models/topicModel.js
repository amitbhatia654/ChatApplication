const mongoose = require("mongoose")

const TopicSchema = new mongoose.Schema({
    topicName: {
        type: String, require: true
    },

    subjectId: {
        type: String, require: true
    },

    description: {
        type: String
    }
})

const Topic = new mongoose.model("Topic", TopicSchema)
module.exports = Topic