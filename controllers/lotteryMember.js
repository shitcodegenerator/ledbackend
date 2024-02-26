const { LotteryMember } = require("../models/lotteryMemberModel");
const asyncHandler = require("express-async-handler");


const enroll = asyncHandler(async (req, res) => {
  const {
    userId,
    name,
    event
  } = req.body;
  if (
    [
      userId,
      name,
      event
      ].some((i) => !i)
  ) {
    res.status(400).json({ message: "請填寫所有欄位", data: null });
  }

  const foundUser = await LotteryMember.findOne({ userId: userId });

  if (foundUser) {
    res.status(400).json({ message: "此身分證字號已經註冊過", data: null });
    return;
  }

  const member = new LotteryMember({
    userId,
    name,
    event
  });
  await member.save();
  res.status(200).json({ message: "報名成功", data: member });
});


const lottery = asyncHandler(async (req, res) => {
  try {
    const winners = await LotteryMember.aggregate([
      { $match: { isWinner: false, event: +req.query.event } },
      { $sample: { size: 30 } }
    ]);

    if (winners.length === 0) {
      return res.status(404).json({ message: '所有得獎者已全部中獎'});
    }

    // Update the isWinner field for the winners
    await LotteryMember.updateMany({ _id: { $in: winners.map(user => user._id) } }, { isWinner: true });

    res.status(200).json({ message: '成功', winners });
  } catch (error) {
    console.error('Error during lottery:', error);
    res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
  }
});



const reset = asyncHandler(async (req, res) => {
  try {
    const winners = await LotteryMember.find({ event: +req.query.event });

    // Update the isWinner field for the winners
    await LotteryMember.updateMany({ _id: { $in: winners.map(user => user._id) } }, { isWinner: false });

    res.status(200).json({ message: '成功', winners });
  } catch (error) {
    console.error('Error during lottery:', error);
    res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
  }
});

const getWinners = asyncHandler(async (req, res) => {
  try {
    const winners = await LotteryMember.find({ event: +req.query.event, isWinner: true });
    res.status(200).json({ message: '成功', winners });
  } catch (error) {
    console.error('Error during lottery:', error);
    res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
  }
});

module.exports = {
  enroll,
  lottery,
  reset,
  getWinners
};
