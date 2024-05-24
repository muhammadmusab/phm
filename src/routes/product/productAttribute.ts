import express from "express";
import basicAuthMiddleware from "../../middlewares/basic-auth-middleware";
import {
  updateProductAttributeSchema,
  deleteProductAttributeSchema,
} from "../../schemas/product/productAttribute";
import { Update, Delete } from "../../controllers/product/productAttribute";
import { validate } from "../../middlewares/validate-middleware";

const router = express.Router();
router.put(
  "/update/:uid",
  validate(updateProductAttributeSchema),
  basicAuthMiddleware,
  Update
);
router.delete(
  "/delete/:uid",
  validate(deleteProductAttributeSchema),
  basicAuthMiddleware,
  Delete
);
export default router;