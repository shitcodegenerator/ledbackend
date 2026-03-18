const { LotteryMember } = require("../models/lotteryMemberModel");
const { Num } = require("../models/num");
const { Time } = require("../models/times");
const asyncHandler = require("express-async-handler");

var faker = require("faker");
faker.setLocale("zh_CN");
const FakeDataGenerator = require("fake-data-generator-taiwan");
let generator = new FakeDataGenerator();

// 生成假数据并插入到数据库
async function generateFakeData(event, type) {
  try {
    const fakeMembers = [];

    if (type === "biolive") {
      // biolive：只產生代號
      for (let i = 0; i < 300; i++) {
        const code = `FAKE_${String(i + 1).padStart(3, "0")}`;
        fakeMembers.push({
          name: code,
          event,
          userId: code,
          mobile: "",
        });
      }
    } else {
      // propartner：產生姓名 + 身分證
      for (let i = 0; i < 300; i++) {
        let name = "";
        name += faker.name.firstName() + faker.name.lastName();
        const userId = generator.IDNumber.generate();
        fakeMembers.push({
          name,
          event,
          userId,
          mobile: "0912345678",
        });
      }
    }

    await LotteryMember.insertMany(fakeMembers);
    console.log("✅ 300 Fake data generated successfully.");
  } catch (error) {
    console.error("❌ Error generating fake data:", error);
  }
}

// API route handler
const fake = asyncHandler(async (req, res) => {
  try {
    await generateFakeData(+req.query.event, req.query.type); // Wait for fake data to be created
    res.status(200).json({ message: "✅ 成功產出假資料", data: null });
  } catch (error) {
    res
      .status(500)
      .json({ message: "❌ 產出假資料失敗", error: error.message });
  }
});

const enroll = asyncHandler(async (req, res) => {
  const { userId, name, event, mobile } = req.body;
  if ([userId, name, event, mobile].some((i) => !i)) {
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
    mobile,
  });
  await member.save();
  res.status(200).json({ message: "報名成功", data: member });
});

const lottery = asyncHandler(async (req, res) => {
  try {
    const { event = 1 } = req.query;
    const num = await Num.findOne({
      _id: process.env.CLIENT
        ? "69b814fe29760f8351c61949"
        : "65ddb64d492e821995a3c319",
    });
    const winners = await LotteryMember.aggregate([
      { $match: { isWinner: false, event: +event } },
      { $sample: { size: num.num } },
    ]).sort({ updated_at: 1 });

    if (winners.length === 0) {
      return res.status(404).json({ message: "所有得獎者已全部中獎" });
    }

    // Update each winner with a new updated_at value, incrementing by 1 second for each
    for (let i = 0; i < winners.length; i++) {
      const newUpdatedAt = new Date();
      newUpdatedAt.setSeconds(newUpdatedAt.getSeconds() + i); // Increment updated_at by 1 second for each winner
      await LotteryMember.updateOne(
        { _id: winners[i]._id },
        { isWinner: true, updated_at: newUpdatedAt },
      );
      winners[i].updated_at = newUpdatedAt; // Update the local copy for the response
    }

    const sorted = winners.sort((a, b) => a.updated_at - b.updated_at);

    res.status(200).json({ message: "成功", winners: sorted });
  } catch (error) {
    console.error("Error during lottery:", error);
    res.status(500).json({
      message: "抽獎失敗",
      error: "An error occurred during the lottery.",
    });
  }
});

const reset = asyncHandler(async (req, res) => {
  try {
    const winners = await LotteryMember.find({ event: +req.query.event });

    // Update the isWinner field for the winners
    await LotteryMember.updateMany(
      { _id: { $in: winners.map((user) => user._id) } },
      { isWinner: false },
    );

    res.status(200).json({ message: "成功" });
  } catch (error) {
    console.error("Error during lottery:", error);
    res.status(500).json({
      message: "抽獎失敗",
      error: "An error occurred during the lottery.",
    });
  }
});

const getMembers = asyncHandler(async (req, res) => {
  try {
    const members = await LotteryMember.find({
      event: +req.query.event,
    }).sort({ updated_at: 1 });
    res.status(200).json({ message: "成功", members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      message: "查詢失敗",
      error: "An error occurred while fetching members.",
    });
  }
});

const getWinners = asyncHandler(async (req, res) => {
  try {
    const winners = await LotteryMember.find({
      event: +req.query.event,
      isWinner: true,
    }).sort({ updated_at: 1 });
    res.status(200).json({ message: "成功", winners });
  } catch (error) {
    console.error("Error during lottery:", error);
    res.status(500).json({
      message: "抽獎失敗",
      error: "An error occurred during the lottery.",
    });
  }
});

const getTime = asyncHandler(async (req, res) => {
  try {
    const time = await Time.findOne();
    console;
    console.log(time);
    res.status(200).json({ message: "成功", time: time.time });
  } catch (error) {
    console.error("Error during lottery:", error);
    // res.status(500).json({ message: '抽獎失敗', error: 'An error occurred during the lottery.' });
  }
});
const getNum = asyncHandler(async (req, res) => {
  try {
    const num = await Num.findOne({
      _id: process.env.CLIENT
        ? "69b814fe29760f8351c61949"
        : "65ddb64d492e821995a3c319",
    });
    console.log(num);
    res.status(200).json({ message: "成功", num: num.num });
  } catch (error) {
    console.error("Error during lottery:", error);
    res.status(500).json({
      message: "抽獎失敗",
      error: "An error occurred during the lottery.",
    });
  }
});

const setNum = asyncHandler(async (req, res) => {
  try {
    const num = await Num.findOne({
      _id: process.env.CLIENT
        ? "69b814fe29760f8351c61949"
        : "65ddb64d492e821995a3c319",
    });
    num.num = req.body.num;
    await num.save();
    res.status(200).json({ message: "成功" });
  } catch (error) {
    console.error("Error during lottery:", error);
    res.status(500).json({
      message: "抽獎失敗",
      error: "An error occurred during the lottery.",
    });
  }
});

const setTime = asyncHandler(async (req, res) => {
  try {
    const time = await Time.findOne({
      _id: process.env.CLIENT
        ? "69ba5eee3d71a5bbf1c9e218"
        : "65fcf1b456bd0b4f92a9dad1",
    });
    time.time = req.body.time;
    await time.save();
    res.status(200).json({ message: "成功" });
  } catch (error) {
    console.error("Error during lottery:", error);
    res.status(500).json({
      message: "抽獎失敗",
      error: "An error occurred during the lottery.",
    });
  }
});

// 批量匯入參加者
const bulkImport = asyncHandler(async (req, res) => {
  const { members, event } = req.body;

  if (!members || !Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ message: "請提供有效的參加者資料" });
  }

  if (!event) {
    return res.status(400).json({ message: "請選擇場次" });
  }

  const validMembers = [];
  const errors = [];

  for (let i = 0; i < members.length; i++) {
    const { name, mobile, userId, code } = members[i];

    // biolive 格式：只有 code 欄位
    if (code) {
      validMembers.push({
        name: code.trim(),
        mobile: "",
        userId: code.trim(),
        event: +event,
        isWinner: false,
      });
      continue;
    }

    // propartner 格式：姓名 + 身分證字號
    if (!name || !userId) {
      errors.push(`第 ${i + 1} 筆資料缺少必要欄位（姓名或身分證字號）`);
      continue;
    }
    validMembers.push({
      name: name.trim(),
      mobile: (mobile || "").trim(),
      userId: userId.trim().toUpperCase(),
      event: +event,
      isWinner: false,
    });
  }

  if (validMembers.length === 0) {
    return res.status(400).json({ message: "沒有有效的資料可匯入", errors });
  }

  // 檢查重複身分證字號
  const existingDocs = await LotteryMember.find({
    userId: { $in: validMembers.map((m) => m.userId) },
  }).select("userId");
  const existingSet = new Set(existingDocs.map((m) => m.userId));
  const newMembers = validMembers.filter((m) => !existingSet.has(m.userId));
  const skipped = validMembers.length - newMembers.length;

  if (newMembers.length > 0) {
    await LotteryMember.insertMany(newMembers);
  }

  const parts = [`成功匯入 ${newMembers.length} 筆`];
  if (skipped > 0) parts.push(`跳過 ${skipped} 筆重複資料`);
  if (errors.length > 0) parts.push(`${errors.length} 筆格式錯誤`);

  res.status(200).json({
    message: parts.join("，"),
    imported: newMembers.length,
    skipped,
    errors,
  });
});

// 清除 LotteryMember 裏所有資料
const clearLotteryMembers = asyncHandler(async (req, res) => {
  try {
    await LotteryMember.deleteMany({}); // 清空所有資料
    res.status(200).json({ message: "成功清除所有會員資料" });
  } catch (error) {
    console.error("Error clearing lottery members:", error);
    res.status(500).json({
      message: "清除失敗",
      error: "An error occurred while clearing lottery members.",
    });
  }
});

module.exports = {
  enroll,
  lottery,
  reset,
  getMembers,
  getWinners,
  generateFakeData,
  clearLotteryMembers,
  getNum,
  setNum,
  setTime,
  getTime,
  fake,
  bulkImport,
};
