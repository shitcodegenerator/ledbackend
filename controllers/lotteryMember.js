const { LotteryMember } = require("../models/lotteryMemberModel");
const { Num } = require("../models/num");
const { Time } = require("../models/times");
const asyncHandler = require("express-async-handler");

var faker = require("faker");
faker.setLocale('zh_CN')
const FakeDataGenerator = require('fake-data-generator-taiwan');
let generator = new FakeDataGenerator();

// 生成假数据并插入到数据库
async function generateFakeData(event) {
  try {
    const fakeMembers = [];
    
    for (let i = 0; i < 300; i++) {
      let name = ''
      name += faker.name.firstName() +faker.name.lastName(); // 随机生成中文名字
      const userId = generator.IDNumber.generate();

      fakeMembers.push({
        name,
        event,
        userId,
        mobile: "0912345678",
      });
    }

    // Insert all data at once to improve performance
    await LotteryMember.insertMany(fakeMembers);
    
    console.log("✅ 300 Fake data generated successfully.");
  } catch (error) {
    console.error("❌ Error generating fake data:", error);
  }
}

// API route handler
const fake = asyncHandler(async (req, res) => {
  try {
    await generateFakeData(+req.query.event); // Wait for fake data to be created
    res.status(200).json({ message: "✅ 成功產出假資料", data: null });
  } catch (error) {
    res.status(500).json({ message: "❌ 產出假資料失敗", error: error.message });
  }
});


const enroll = asyncHandler(async (req, res) => {
  const {
    userId,
    name,
    event,
    mobile
  } = req.body;
  if (
    [
      userId,
      name,
      event,
      mobile
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
    event,
    mobile
  });
  await member.save();
  res.status(200).json({ message: "報名成功", data: member });
});


const lottery = asyncHandler(async (req, res) => {
  try {
    const { event = 1 } = req.query
    const num = await Num.findOne({ _id: '65ddb64d492e821995a3c319' });
    const winners = await LotteryMember.aggregate([
      { $match: { isWinner: false, event: +event } },
      { $sample: { size: num.num } }
    ]).sort({updated_at: 1});

    if (winners.length === 0) {
      return res.status(404).json({ message: '所有得獎者已全部中獎'});
    }

    // Update the isWinner field for the winners
    // await LotteryMember.updateMany({ _id: { $in: winners.map(user => user._id) } }, { isWinner: true, updated_at: new Date() });

     // Update each winner with a new updated_at value, incrementing by 1 second for each
     for (let i = 0; i < winners.length; i++) {
      const newUpdatedAt = new Date();
      newUpdatedAt.setSeconds(newUpdatedAt.getSeconds() + i); // Increment updated_at by 1 second for each winner
      await LotteryMember.updateOne({ _id: winners[i]._id }, { isWinner: true, updated_at: newUpdatedAt });
      winners[i].updated_at = newUpdatedAt; // Update the local copy for the response
    }

    const sorted = winners.sort((a, b) => a.updated_at - b.updated_at);


    res.status(200).json({ message: '成功', winners:sorted });
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

    res.status(200).json({ message: '成功' });
  } catch (error) {
    console.error('Error during lottery:', error);
    res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
  }
});

const getWinners = asyncHandler(async (req, res) => {
  try {
    const winners = await LotteryMember.find({ event: +req.query.event, isWinner: true }).sort({updated_at: 1});
    res.status(200).json({ message: '成功', winners });
  } catch (error) {
    console.error('Error during lottery:', error);
    res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
  }
});

const getTime = asyncHandler(async (req, res) => {
  try {
    const time = await Time.findOne();
    console
    console.log(time)
    res.status(200).json({ message: '成功', time: time.time });
  } catch (error) {
    console.error('Error during lottery:', error);
    // res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
  }
});
const getNum = asyncHandler(async (req, res) => {
  try {
    const num = await Num.findOne({ _id: '65ddb64d492e821995a3c319' });
    console.log(num)
    res.status(200).json({ message: '成功', num: num.num });
  } catch (error) {
    console.error('Error during lottery:', error);
    res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
  }
});

const setNum = asyncHandler(async (req, res) => {
  try {
    const num = await Num.findOne({ _id: '65ddb64d492e821995a3c319' });
    num.num = req.body.num
    await num.save();
    res.status(200).json({ message: '成功' });
  } catch (error) {
    console.error('Error during lottery:', error);
    res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
  }
});

const setTime = asyncHandler(async (req, res) => {
  try {
    const time = await Time.findOne({ _id: '65fcf1b456bd0b4f92a9dad1' });
    time.time = req.body.time
    await time.save()
    res.status(200).json({ message: '成功' });
  } catch (error) {
    console.error('Error during lottery:', error);
    res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
  }
});


// 清除 LotteryMember 裏所有資料
const clearLotteryMembers = asyncHandler(async (req, res) => {
  try {
    await LotteryMember.deleteMany({}); // 清空所有資料
    res.status(200).json({ message: "成功清除所有會員資料" });
  } catch (error) {
    console.error("Error clearing lottery members:", error);
    res.status(500).json({ message: "清除失敗", error: "An error occurred while clearing lottery members." });
  }
});

module.exports = {
  enroll,
  lottery,
  reset,
  getWinners,
  generateFakeData,
  clearLotteryMembers,
  getNum,
  setNum,
  setTime,
  getTime,
  fake
};
