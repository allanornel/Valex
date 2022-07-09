import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
  const { type, employeeId }: { type: TransactionTypes; employeeId: string } =
    req.body;

  if (!type || !employeeId) {
    return res.sendStatus(422);
  }

  await cardService.insertCardService(type, parseInt(employeeId));

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

  await cardService.activeCardService(password, cardNumber, cvc);

  return res.sendStatus(200);
}
