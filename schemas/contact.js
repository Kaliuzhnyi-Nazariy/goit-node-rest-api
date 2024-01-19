const Joi = require("joi");
const myCustomJoi = Joi.extend(require("joi-phone-number"));

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: myCustomJoi.string().phoneNumber().required(),
});

module.exports = addSchema;
