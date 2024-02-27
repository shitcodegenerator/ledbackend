const mongoose = require("mongoose");

const memberSchema = mongoose.model('Num',
 new mongoose.Schema({
  num: {
    type: Number,
    default: 30
  },
}))


exports.Num = memberSchema;