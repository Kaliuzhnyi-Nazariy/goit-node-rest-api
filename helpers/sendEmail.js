const sGMail = require("@sendgrid/mail");
require("dotenv").config();

const { API_KEY } = process.env;

sGMail.setApiKey(API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "ychebaknki@gmail.com" };
  await sGMail.send(email);
  return true;
};

module.exports = sendEmail;
