const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const { SECRET_KEY } = process.env;

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email is already registered!");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const createAvatarURL = gravatar.url(email);

  const avatarURL = await Jimp.read(createAvatarURL, (err, lenna) => {
    if (err) throw err;
    lenna.resize(256, 256); // resize
  });

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("subscription");
  if (!user) {
    throw HttpError(401, "Email or password invalid!");
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password invalid!");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    throw HttpError(401);
  }
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const getSubscription = async (req, res, next) => {
  const { _id } = req.user;

  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  console.log(result);
  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload } = req.file;
  console.log(tempUpload);
  //
  // Jimp.read("./path/to/image.jpg")
  //   .then((image) => {
  //     // Do stuff with the image.
  //   })
  //   .catch((err) => {
  //     // Handle an exception.
  //   });
  //

  const createAvatarURL = Jimp.read(tempUpload)
    .then((lenna) => {
      return lenna.resize(256, 256); // resize
    })
    .catch((err) => {
      console.error(err);
    });
  //

  console.log(createAvatarURL);
  const filename = `${_id}_${createAvatarURL}`;

  console.log(filename);

  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  getSubscription: ctrlWrapper(getSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
