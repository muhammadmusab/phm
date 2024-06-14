import express from "express";
import basicAuthMiddleware from "../../middlewares/basic-auth-middleware";
import {
  Create,
  Update,
  Get,
  Delete,
  List,
  AssignVariants,
  AssignedList,
} from "../../controllers/product/productVariant";
import { validate } from "../../middlewares/validate-middleware";
import {
  createProductVariantSchema,
  assignVariantSchema,
  deleteProductVariantSchema,
  getProductVariantSchema,
  updateProductVariantSchema,
  listProductVariantSchema,
} from "../../schemas/product/productVariant";

const router = express.Router();

router.post(
  "/create",
  validate(createProductVariantSchema),
  basicAuthMiddleware,
  Create
);
router.post(
  "/assign",
  validate(assignVariantSchema),
  basicAuthMiddleware,
  AssignVariants
);

router.get(
  "/get/:uid",
  validate(getProductVariantSchema),
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

router.get("/list/:uid", validate(listProductVariantSchema), List);
router.get("/assigned-list/:uid", validate(listProductVariantSchema), AssignedList);

export default router;
