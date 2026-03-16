const mongoose = require("mongoose");

const memberSchema = mongoose.model(
  "LotteryMember",
  new mongoose.Schema({
    name: {
      type: String,
      maxlength: 20,
      default: "",
    },
    mobile: {
      type: String,
      maxlength: 20,
      default: "",
    },
    userId: {
      type: String,
      required: [true, "請輸入代號或身分證字號"],
      maxlength: 20,
    },
    event: {
      type: Number,
      required: [true, "請輸入場次"],
      maxlength: 10,
    },
    isWinner: {
      type: Boolean,
      default: false,
    },
    updated_at: { type: Date, required: false, default: new Date() },
  }),
);

exports.LotteryMember = memberSchema;
