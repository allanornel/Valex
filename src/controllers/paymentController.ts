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

  if (!cardId || !password || !businessId || !amount) res.sendStatus(422);
  if (amount <= 0)
    throw {
      type: "Amount has to be bigger than 0",
      message: "Montante precisa ser maior que zero",
      statusCode: 422,
    };

  await paymentService.payment(cardId, businessId, password, amount);
  res.sendStatus(200);
}
