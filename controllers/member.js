const { Member } = require("../models/memberModel");
const asyncHandler = require("express-async-handler");


const createMember = asyncHandler(async (req, res) => {
  const {
    name,
    mobile,
    email,
    receiver_name,
    receiver_mobile,
    receiver_address,
  } = req.body;
  if (
    [
      name,
      mobile,
      email,
      receiver_name,
      receiver_mobile,
      receiver_address,
    ].some((i) => !i)
  ) {
    res.status(400).json({ message: "請填寫所有欄位", data: null });
  }

  const foundUser = await Member.findOne({ mobile: mobile });

  if (foundUser) {
    res.status(400).json({ message: "此帳號已經註冊過", data: null });
    return;
  }
  const member = new Member({
    name,
    mobile,
    email,
    receiver_name,
    receiver_mobile,
    receiver_address,
  });
  await member.save();
  res.status(200).json({ message: "Created", data: member });
});

const getPhoto = asyncHandler(async (req, res) => {
  const { page = 1, size = 1 } = req.query;
  const data = await Member.find(
    {is_verified: false}
  )
    .select(["doctor_name", "photo"])
    .skip((page - 1) * size)
    .limit(size)
    .exec();

  const total = await Member.countDocuments({is_verified: true});
  res.status(200).json({
    message: "OK",
    data: {
      data,
      total,
    },
  });
});

/** 後台 */
const getAttendeeData = asyncHandler(async (req, res) => {
  const { page = 1, size = 10, receiver_mobile = '' } = req.query;
  const data = await Member.find(
    {
      ...(receiver_mobile && {receiver_mobile})
    }
  )
    .select(["doctor_name", "photo", 'receiver_mobile', 'receiver_name', 'is_verified', 'created_at', 'receiver_address'])
    .skip((page - 1) * size)
    .limit(size)
    .exec();

  const total = await Member.countDocuments();
  res.status(200).json({
    message: "OK",
    data: {
      data,
      total: Math.ceil(total / size),
    },
  });
});

const verifyAttendee = asyncHandler(async (req, res) => {
  const user = await Member.findOne(
    {
      _id: req.query.id
    }
  )
  if(!user) {
    res.status(400).json({ status: false, message: "審核失敗", data: null  });
  }
  user.is_verified = !user.is_verified
  user.verified_at = new Date()
  await user.save()
  res.status(200).json({ status: true, message: "成功審核", data: user  });
});

module.exports = {
  getPhoto,
  getAttendeeData,
  createMember,
  verifyAttendee
};
