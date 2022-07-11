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

export async function onlinePurchase(req: Request, res: Response) {
  const {
    number,
    cardholderName,
    securityCode,
    expirationDate,
    amount,
    businessId,
  }: {
    number: string;
    cardholderName: string;
    securityCode: string;
    expirationDate: string;
    amount: number;
    businessId: number;
  } = req.body;

  await paymentService.onlinePurchaseService(
    number,
    cardholderName.toUpperCase(),
    securityCode,
    expirationDate,
    amount,
    businessId
  );
  res.sendStatus(200);
}
