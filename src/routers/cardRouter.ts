import { Router } from "express";
import {
  activeCard,
  createCard,
  seeTransactions,
  blockCard,
  unblockCard,
} from "../controllers/cardController.js";
import checkApi from "../middlewares/checkApiMiddleware.js";

const cardRouter = Router();

cardRouter.post("/card", checkApi, createCard);
cardRouter.post("/activeCard", activeCard);
cardRouter.get("/transactions/:id", seeTransactions);
cardRouter.post("/block", blockCard);
cardRouter.post("/unblock", unblockCard);

export default cardRouter;
