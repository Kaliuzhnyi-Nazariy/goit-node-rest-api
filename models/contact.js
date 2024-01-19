const { Schema, model } = require("mongoose");
const { handleMongoose } = require("../helpers");

const Joi = require("joi");
const myCustomJoi = Joi.extend(require("joi-phone-number"));

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timeseries: true }
);

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: myCustomJoi.string().phoneNumber().required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schema = {
  addSchema,
  updateFavoriteSchema,
};

contactSchema.post("save", handleMongoose);

const Contact = model("contact", contactSchema);

module.exports = { Contact, schema };
