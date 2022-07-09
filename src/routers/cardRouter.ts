import { Router } from "express";
import {
  activeCard,
  createCard,
  seeTransactions,
} from "../controllers/cardController.js";
import checkApi from "../middlewares/checkApiMiddleware.js";

const cardRouter = Router();

cardRouter.post("/card", checkApi, createCard);
cardRouter.post("/activeCard", activeCard);
cardRouter.get("/transactions/:id", seeTransactions);

export default cardRouter;
