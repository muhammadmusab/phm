import express from "express";
import basicAuthMiddleware from "../../middlewares/basic-auth-middleware";
import { updateProductDataSchema } from "../../schemas/product/productData";
import { Update } from "../../controllers/product/productData";
import { validate } from "../../middlewares/validate-middleware";

const router = express.Router();
router.put(
  "/update/:uid",
  validate(updateProductDataSchema),
  basicAuthMiddleware,
  Update
);
export default router;