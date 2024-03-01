const mongoose = require("mongoose");

const memberSchema = mongoose.model('LotteryMember',
 new mongoose.Schema({
  name: {
    type: String,
    maxlength: 20,
    required: [true, "請輸入真實姓名"]
  },
  mobile: {
    type: String,
    maxlength: 20,
    required: [true, "請輸入手機號碼"],
    default: ''
  },
  userId: {
    type: String,
    required: [true, "請輸入身分證字號"],
    maxlength: 10
  },
  event: {
    type: Number,
    required: [true, "請輸入場次"],
    maxlength: 10
  },
  isWinner: {
    type: Boolean,
    default: false
  },
}))


exports.LotteryMember = memberSchema;