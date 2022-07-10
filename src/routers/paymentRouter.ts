import { Router } from "express";
import { payment } from "../controllers/paymentController.js";
import checkApi from "../middlewares/checkApiMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import paymentSchema from "../schemas/paymentSchema.js";

const paymentRouter = Router();

paymentRouter.post(
  "/payment",
  checkApi,
  validateSchema(paymentSchema),
  payment
);

export default paymentRouter;
