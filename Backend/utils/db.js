const mongoose = require("mongoose");
const URI = process.env.MongoDb_URI

const connectDb = async () => {
    try {
        await mongoose.connect(URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('Database Connected Successfully')

    } catch (error) {
        console.log('Failed to Connect Database')
    }
}

module.exports = connectDb;
