import express from "express";
import authMiddlewareFunction from "../middlewares/auth-middleware";
import { Get, Update } from "../controllers/user";
import { validate } from "../middlewares/validate-middleware";
import { updateUserSchema} from "../schemas/user";

const router = express.Router();

router.put(
  "/update",
  validate(updateUserSchema),
  authMiddlewareFunction(),
  Update
);

router.get("/get", authMiddlewareFunction(), Get);

export default router;
