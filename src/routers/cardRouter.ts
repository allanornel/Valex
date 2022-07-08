import { Router } from "express";
import { activeCard, createCard } from "../controllers/cardController.js";

const cardRouter = Router();

cardRouter.post("/card", createCard);
cardRouter.post("/activeCard", activeCard);

export default cardRouter;
