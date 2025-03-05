import User from "../models/User.js";
import { validateRegister, validateLogin } from "../models/User.js";
import { generateTokens } from "../utils/generateTokens.js";

export const signupCtrl = async (req, res) => {
    try {
        const { error } = validateRegister(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { fullName, username, password, gender } = req.body;
        const existUser = await User.findOne({ username });
        if (existUser) return res.status(400).json({ error: "user already exist" });

        const profilePic =
            gender === "male"
                ? process.env.BOY_PIC_URL ||
                "https://cdn.pixabay.com/photo/2013/07/13/12/33/man-159847_1280.png"
                : process.env.GIRL_PIC_URL ||
                "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359554_1280.png";
        const user = await User.create({
            fullName,
            username,
            password,
            gender,
            profilePic,
        });
        if (user) {
            await generateTokens(user._id, res);
            return res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                profilePic: user.profilePic,
                gender: user.gender,
            });
        } else {
            return res.status(400).json({ error: "something went wrong" });
        }
    } catch (error) {
        console.error("error in signupCtrl", error);
        res.status(500).json({ error: error.message });
    }
};
export const loginCtrl = async (req, res) => {
    try {
        const { error } = validateLogin(req.body)
        if (error) return res.status(400).json({ error: error.details[0].message })
        const { username, password } = req.body
        const existUser = await User.findOne({ username })
        if (!existUser) {
            return res.status(404).json({ error: "user not found" })
        }

        if (existUser && await User.passwordCompare(password, existUser.password)) {
            await generateTokens(existUser._id, res)
            return res.status(200).json({
                _id: existUser._id,
                fullName: existUser.fullName,
                username: existUser.username,
                profilePic: existUser.profilePic,
                gender: existUser.gender,
            })
        }else{
            return res.status(400).json({ error: "invalid username or password" })
        }
    } catch (error) {
        console.error("error in loginCtrl", error);
        res.status(500).json({ error: error.message });
    }
};

export const logoutCtrl = async (req, res) => {
    try {
        if(!req.cookies.token) return res.status(400).json({ error: "user not logged in" })
        res.clearCookie("token")
        return res.status(200).json({ message: "user logged out successfully" })
    } catch (error) {
        console.error("error in logoutCtrl", error);
        res.status(500).json({ error: error.message });
    }
};
