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
    res.status(400).json({ message: "此手機號碼已經註冊過", data: null });
    return;
  }
  const foundEmail = await Member.findOne({ email: email });

  if (foundEmail) {
    res.status(400).json({ message: "此Email已經註冊過", data: null });
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
  res.status(200).json({ message: "報名成功", data: member });
});

const getPhoto = asyncHandler(async (req, res) => {
  const { page = 1, size = 1, phase = 1 } = req.query;
  const data = await Member.find(
    {is_verified: true,
      phase}
  )
    .select(["doctor_name", "photo"])
    .sort({sort: 1})
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
  const { page = 1, size = 10, mobile = '' } = req.query;
  const data = await Member.find(
    {
      ...(mobile && {mobile})
    }
  ).sort({created_at:'desc'})
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
  const member = await Member.findOne(
    {
      _id: req.query.id
    }
  )
  if(!member) {
    res.status(400).json({ status: false, message: "審核失敗", data: null  });
    return
  }
  member.is_verified = !member.is_verified
  member.verified_at = new Date()
  if (member.verified_at < new Date('2023-10-30 23:59:59')) {
    member.phase = 1
  } else if (member.verified_at < new Date('2023-11-29 23:59:59') && member.verified_at > new Date('2023-10-30 23:59:59')) {
    member.phase = 2
  } else {
    member.phase = 3
  }
  await member.save()
  res.status(200).json({ status: true, message: "成功審核", data: member  });
});

const contactAttendee = asyncHandler(async (req, res) => {
  const member = await Member.findOne(
    {
      _id: req.query.id
    }
  )
  if(!member) {
    res.status(400).json({ status: false, message: "操作失敗", data: null  });
    return
  }
  member.isContacted = !member.isContacted
  member.contact_at = new Date()
  await member.save()
  res.status(200).json({ status: true, message: "操作成功", data: member  });
});

const sortAttendee = asyncHandler(async (req, res) => {
  const member = await Member.findOne(
    {
      _id: req.query.id
    }
  )
  if(!member) {
    res.status(400).json({ status: false, message: "修改排序失敗", data: null  });
    return
  }
  member.sort = req.query.sort
  await member.save()
  res.status(200).json({ status: true, message: "修改排序成功", data: member  });
});

module.exports = {
  getPhoto,
  getAttendeeData,
  createMember,
  verifyAttendee,
  sortAttendee,
  contactAttendee
};
