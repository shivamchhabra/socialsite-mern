//const uuid = require("uuid");
const httperror = require("../models/httperror");
//const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
//
//
//
//

///////////////////////////get users list
const getuserslist = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    next(new httperror("something went wrong please try later", 500));
  }

  if (users) {
    return res
      .status(200)
      .json({ users: users.map((user) => user.toObject({ getters: true })) });
  }
};
//
//
//
//

// /////////////////////////create users
const createuser = async (req, res, next) => {
  //const error = validationResult(req);
  /*if (!error.isEmpty()) {
    throw new httperror("invalid inputs", 422);
  }*/

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    next(new httperror("something went wrong", 500));
  }

  if (existingUser) {
    return next(new httperror("User already exists", 500));
  }
  let hashedpassword;
  try {
    hashedpassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new httperror(
      "couldnot create user....as password not hashed",
      500
    );
    return next(error);
  }

  const newuser = new User({
    //this is a constructor  function
    name,
    email,
    password: hashedpassword,
    image: req.file.path,
    places: [],
  });
  console.log(newuser);

  try {
    await newuser.save();
  } catch (error) {
    console.log(error);
    next(new httperror("cannot save new user", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newuser.id, email: newuser.email },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    const error = new httperror(
      "couldnot create user....as token not generated",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ userId: newuser.id, email: newuser.email, token: token });
};
//
//
//
//
/////////////////login
const loginuser = async (req, res, next) => {
  const { email, password } = req.body;
  let userExists;
  try {
    userExists = await User.findOne({ email: email });
  } catch (error) {
    next(new httperror("something went wrong", 500));
  }

  if (!userExists) {
    next(new httperror("invalid credentials", 500));
  }
  console.log(userExists.toObject({ getters: true }));
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, userExists.password);
  } catch (err) {
    next(new httperror("password compare error...couldnot login...", 500));
  }

  if (!isValidPassword) {
    return res.status(401).json({ message: "invalid password..." });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: userExists.id, email: userExists.email },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    const error = new httperror(
      "couldnot login !!....as token not generated",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "logged in",
    userId: userExists.id,
    email: userExists.email,
    token: token,
  });
};

exports.getuserslist = getuserslist;
exports.createuser = createuser;
exports.loginuser = loginuser;
