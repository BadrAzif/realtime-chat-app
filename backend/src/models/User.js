import mongoose from "mongoose";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import bcrypt from "bcrypt";

const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 3,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },
    password: {
      type: String,
      required: true,
    //   select: false,
    },
    profilePic: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const { password, ...userObject } = this.toObject();
  return userObject;
};

function validateRegister(obj) {
  const schema = Joi.object({
    fullName: Joi.string().required().min(3),
    username: Joi.string().required().min(3).max(30).lowercase().trim(),
    password: passwordComplexity(complexityOptions).required(),
    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "password does not match",
      }),
    gender: Joi.string().valid("male", "female").required(),
  }).strict();
  return schema.validate(obj);
}
function validateLogin(obj) {
  const schema = Joi.object({
    username: Joi.string().required().min(3).max(30).lowercase().trim(),
    password: Joi.string().required().min(8).max(30),
  }).strict();
  return schema.validate(obj);
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new Error("password hash error"));
  }
});

userSchema.statics.passwordCompare = async function (enteredPassword, storedPassword) {
    return bcrypt.compare(enteredPassword, storedPassword);
     
  };
const User = mongoose.model("User", userSchema);

export default User;
export { validateLogin, validateRegister };
