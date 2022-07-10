import { Request, Response } from "express";
import * as paymentService from "./../services/paymentService.js";

export async function payment(req: Request, res: Response) {
  const {
    cardId,
    password,
    businessId,
    amount,
  }: { cardId: number; password: string; businessId: number; amount: number } =
    req.body;

  await paymentService.payment(cardId, businessId, password, amount);
  res.sendStatus(200);
}
