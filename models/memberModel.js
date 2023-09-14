const mongoose = require("mongoose");

const memberSchema = mongoose.model('Member',
 new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name"],
  },
  mobile: {
    type: String,
    required: [true, "Please add mobile"],
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  receiver_name: {
    type: String,
    required: [true, "Please add name"],
  },
  receiver_mobile: {
    type: String,
    required: [true, "Please add name"],
  },
  receiver_address: {
    type: String,
    required: [true, "Please add name"],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  photo: {
    type: String,
    default: ''
  },
  // orders: [
  //   {
  //       type: Schema.Types.ObjectId
  //   }
  // ]
}))


const User = mongoose.model('User', new mongoose.Schema({
  name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
  },
  email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
  },
  password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
  }
}));
// module.exports = mongoose.model("Member", memberSchema)

exports.Member = memberSchema;