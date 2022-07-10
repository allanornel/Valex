import { Router } from "express";
import { recharge } from "../controllers/rechargeController.js";
import checkApi from "../middlewares/checkApiMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import rechargeSchema from "../schemas/rechargeSchema.js";

const rechargeRouter = Router();

rechargeRouter.post(
  "/recharge",
  checkApi,
  validateSchema(rechargeSchema),
  recharge
);

export default rechargeRouter;
