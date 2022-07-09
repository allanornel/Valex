import { Router } from "express";
import { recharge } from "../controllers/rechargeController.js";
import checkApi from "../middlewares/checkApiMiddleware.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge", checkApi, recharge);

export default rechargeRouter;
