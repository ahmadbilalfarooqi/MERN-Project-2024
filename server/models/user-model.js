const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//==============================================================
// user schema define here
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//=================================================================
// json web token define here
userSchema.methods.generateToken = async function () {
  try {
    // payload logic here
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      // signature logic here
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error(error);
  }
};

//================================================================
// password instance define here

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// ================================================================
// secure the password Hash with the bcrypt define here
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    next(error);
  }
});

//=====================================================================
// this is user collection for database
const User = new mongoose.model("User", userSchema);

module.exports = User;
