import { Router } from "express";
import {
  activeCard,
  createCard,
  seeTransactions,
  blockCard,
  unblockCard,
} from "../controllers/cardController.js";
import checkApi from "../middlewares/checkApiMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {
  activeCardSchema,
  blockUnblockSchema,
  createCardSchema,
} from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post(
  "/card",
  checkApi,
  validateSchema(createCardSchema),
  createCard
);
cardRouter.post("/activeCard", validateSchema(activeCardSchema), activeCard);
cardRouter.get("/transactions/:id", seeTransactions);
cardRouter.post("/block", validateSchema(blockUnblockSchema), blockCard);
cardRouter.post("/unblock", validateSchema(blockUnblockSchema), unblockCard);

export default cardRouter;
