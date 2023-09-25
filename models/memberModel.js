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
    unique: false,
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
  contact_at: {
    type: Date,
    default: ''
  },
  phase: {
    type: Number,
    default: 1
  },
  sort: {
    type: Number,
    default: 9999
  },
  isContacted: {
    type: Boolean,
    default: false
  }
}))


exports.Member = memberSchema;