const { LotteryMember } = require("../models/lotteryMemberModel");
const { Num } = require("../models/num");
const { Time } = require("../models/time");
const asyncHandler = require("express-async-handler");
var faker = require("faker");
faker.setLocale('zh_CN')
const FakeDataGenerator = require('fake-data-generator-taiwan');
let generator = new FakeDataGenerator();

// 生成假数据并插入到数据库
async function generateFakeData() {
  try {
    for (let i = 0; i < 150; i++) {
      let name = ''
      name += faker.name.firstName() +faker.name.lastName(); // 随机生成中文名字
      const event = 2; // 事件编号，这里假设都是 1
      const userId = generator.IDNumber.generate()
      console.log(userId)
      await LotteryMember.create({ name, event, userId, mobile: '0912345678' });
    }
    console.log('Fake data generated successfully.');
  } catch (error) {
    console.error('Error generating fake data:', error);
  } finally {
    // mongoose.disconnect();
  }
}

// 执行生成假数据的函数
// generateFakeData();


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
    ]);

    if (winners.length === 0) {
      return res.status(404).json({ message: '所有得獎者已全部中獎'});
    }

    // Update the isWinner field for the winners
    await LotteryMember.updateMany({ _id: { $in: winners.map(user => user._id) } }, { isWinner: true, updated_at: new Date() });

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
    console.log(time)
    res.status(200).json({ message: '成功', time: time.time });
  } catch (error) {
    console.error('Error during lottery:', error);
    res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
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

module.exports = {
  enroll,
  lottery,
  reset,
  getWinners,
  generateFakeData,
  getNum,
  setNum,
  setTime,
  getTime
};
