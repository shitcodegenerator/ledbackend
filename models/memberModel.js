const mongoose = require("mongoose");

const memberSchema = mongoose.model('Member',
 new mongoose.Schema({
  name: {
    type: String,
    maxlength: 20,
    required: [true, "Please add name"],
  },
  mobile: {
    type: String,
    required: [true, "Please add mobile"],
    maxlength: 10,
    unique: true,
  },
  email: {
    type: String,
    maxlength: 50,
    required: true,
  },
  receiver_name: {
    type: String,
    maxlength: 20,
    required: [true, "Please add name"],
  },
  receiver_mobile: {
    type: String,
    maxlength: 10,
    required: [true, "Please add name"],
  },
  receiver_address: {
    type: String,
    maxlength: 50,
    required: [true, "Please add name"],
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  photo: {
    type: String,
    default: ''
  },
  photo_id: {
    type: String,
    default: ''
  },
  doctor_name: {
    type: String,
    default: ''
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  verified_at: {
    type: Date,
    default: ''
  },
  phase: {
    type: Number,
    default: 0
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