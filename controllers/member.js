const { Member } = require("../models/memberModel");
const asyncHandler = require("express-async-handler");

const getContacts = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "OK" });
});
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
    ].some(i => !i)
  ) {
    res.status(400).json({ message: "請填寫所有欄位", data: null });
  }

  const foundUser = await Member.findOne({ mobile: mobile });
  console.log(foundUser);
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
const getContact = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "OK" });
});
const updateContact = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "OK" });
});
const deleteContact = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "OK" });
});

module.exports = {
  getContact,
  getContacts,
  createMember,
  updateContact,
  deleteContact,
};
