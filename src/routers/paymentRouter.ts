import { Router } from "express";
import { payment } from "../controllers/paymentController.js";
import checkApi from "../middlewares/checkApiMiddleware.js";

const paymentRouter = Router();

paymentRouter.post("/payment", checkApi, payment);

export default paymentRouter;
