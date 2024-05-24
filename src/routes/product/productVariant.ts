import express from "express";
import basicAuthMiddleware from "../../middlewares/basic-auth-middleware";
import {
  Create,
  Get,
  Update,
  Delete,
  List,
} from "../../controllers/product/productVariant";
import { validate } from "../../middlewares/validate-middleware";
import {
  createProductVariantSchema,
  getProductVariantSchema,
  updateProductVariantSchema,
  deleteProductVariantSchema,
  listProductVariantSchema,
} from "../../schemas/product/productVariant";

const router = express.Router();

router.post(
  "/create",
  validate(createProductVariantSchema),
  basicAuthMiddleware,
  Create
);
router.get(
  "/get/:uid",
  validate(getProductVariantSchema),
  basicAuthMiddleware,
  Get
);

router.put(
  "/update/:uid",
  validate(updateProductVariantSchema),
  basicAuthMiddleware,
  Update
);

router.delete(
  "/delete/:uid",
  validate(deleteProductVariantSchema),
  basicAuthMiddleware,
  Delete
);

router.get("/list", validate(listProductVariantSchema), List);

export default router;
