const { Schema, default: mongoose } = require("mongoose");

const courseSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Course", courseSchema)