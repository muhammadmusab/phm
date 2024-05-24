import express from "express";
import authMiddlewareFunction from "../middlewares/auth-middleware";
import { Create, Delete, List, Update } from "../controllers/address";
import { validate } from "../middlewares/validate-middleware";
import {
  createAddressSchema,
  updateAddressSchema,
  deleteAddressSchema,
  listAddressSchema,
} from "../schemas/address";

const router = express.Router();

router.post(
  "/create",
  validate(createAddressSchema),
  authMiddlewareFunction(),
  Create
);

router.put(
  "/update/:uid",
  validate(updateAddressSchema),
  authMiddlewareFunction(),
  Update
);

router.delete(
  "/delete/:uid",
  validate(deleteAddressSchema),
  authMiddlewareFunction(),
  Delete
);

router.get(
  "/list",
  validate(listAddressSchema),
  authMiddlewareFunction(),
  List
);

export default router;
