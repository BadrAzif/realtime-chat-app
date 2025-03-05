import User from "../models/User.js";

export const getAllUsersCtrl = async (req, res) => {
  try {
    // التحقق من أن المستخدم مسجل الدخول
    if (!req.user?._id) {
      return res.status(401).json({ error: "user not authenticated" });
    }

    const loggeduser = req.user._id;

    // جلب المستخدمين مع استثناء الشخص اللي مسجل الدخول
    const filtredusers = await User.find(
      { _id: { $ne: loggeduser } },
      "fullName username profilePic gender"
    );

    // التأكد من وجود مستخدمين
    if (filtredusers.length === 0) {
      return res.status(404).json({ error: "no users found" });
    }

    return res.status(200).json(filtredusers);
  } catch (error) {
    console.error("error in getAllUsers", error);
    res.status(500).json({ error: error.message });
  }
};
