import { Router } from "express";
import { activeCard, createCard } from "../controllers/cardController.js";
import checkApi from "../middlewares/checkApiMiddleware.js";

const cardRouter = Router();

cardRouter.post("/card", checkApi, createCard);
cardRouter.post("/activeCard", activeCard);

export default cardRouter;
