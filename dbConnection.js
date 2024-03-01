const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        const connect = await mongoose.connect('mongodb+srv://dontz3210:22456842@cluster0.xc3uohc.mongodb.net/zakbackend?retryWrites=true&w=majority')
        console.log('DB connected', connect.connection.host, connect.connection.name)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDb