import { Request, Response } from "express";
import {
  findByTypeAndEmployeeId,
  TransactionTypes,
} from "../repositories/cardRepository.js";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
  const apiKey: string = req.header("x-api-key");
  const { type, employeeId }: { type: TransactionTypes; employeeId: string } =
    req.body;

  if (!apiKey || !type || !employeeId) {
    return res.sendStatus(422);
  }

  cardService.insertCardService(apiKey, type, parseInt(employeeId));

  return res.sendStatus(201);
}

export async function activeCard(req: Request, res: Response) {
  const {
    password,
    cardNumber,
    cvc,
  }: { password: string; cardNumber: string; cvc: string } = req.body;

  if (!password || !cardNumber || !cvc || password.length !== 4) {
    return res.sendStatus(422);
  }

  cardService.activeCardService(password, cardNumber, cvc);

  return res.sendStatus(200);
}
