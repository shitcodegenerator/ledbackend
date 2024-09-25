const mongoose = require("mongoose");

const memberSchema = mongoose.model('time',
 new mongoose.Schema({
  time: {
    type: String,
    default: '16:00'
  },
}))


exports.Time = memberSchema;