const express = require("express");

const ctrl = require("../../controllers/contacts.js");

const { validateBody, isValid, authenticate } = require("../../middlewares");

const { schema } = require("../../models/contact.js");

const router = express.Router();

router.get("/", authenticate, ctrl.listContacts);

router.get("/:contactId", authenticate, isValid, ctrl.getContactById);

router.post("/", authenticate, validateBody(schema.addSchema), ctrl.addContact);

router.delete("/:contactId", authenticate, isValid, ctrl.removeContact);

router.put(
  "/:contactId",
  authenticate,
  isValid,
  validateBody(schema.addSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValid,
  validateBody(schema.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
