const express = require("express");

const ctrl = require("../../controllers/contacts.js");

const { validateBody, isValid } = require("../../middlewares");

const { schema } = require("../../models/contact.js");

const router = express.Router();

router.get("/", ctrl.listContacts);

router.get("/:contactId", isValid, ctrl.getContactById);

router.post("/", validateBody(schema.addSchema), ctrl.addContact);

router.delete("/:contactId", isValid, ctrl.removeContact);

router.put(
  "/:contactId",
  isValid,
  validateBody(schema.addSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValid,
  validateBody(schema.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
