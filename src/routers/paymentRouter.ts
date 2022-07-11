import { Router } from "express";
import { onlinePurchase, payment } from "../controllers/paymentController.js";
import checkApi from "../middlewares/checkApiMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { onlinePurchaseSchema } from "../schemas/cardSchema.js";
import paymentSchema from "../schemas/paymentSchema.js";

const paymentRouter = Router();

paymentRouter.post(
  "/payment",
  checkApi,
  validateSchema(paymentSchema),
  payment
);
paymentRouter.post(
  "/onlinepurchase",
  validateSchema(onlinePurchaseSchema),
  onlinePurchase
);

export default paymentRouter;
