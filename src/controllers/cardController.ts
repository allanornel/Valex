import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
  const { type, employeeId }: { type: TransactionTypes; employeeId: string } =
    req.body;

  await cardService.insertCardService(type, parseInt(employeeId));
  return res.sendStatus(201);
}

export async function activeCard(req: Request, res: Response) {
  const { password, id, cvc }: { password: string; id: string; cvc: string } =
    req.body;

  await cardService.activeCardService(password, parseInt(id), cvc);
  return res.sendStatus(200);
}

export async function seeTransactions(req: Request, res: Response) {
  const id: string = req.params.id;
  if (!id)
    throw {
      type: "Id not sent",
      message: "ID não foi enviado",
      statusCode: 422,
    };

  const transactions = await cardService.transactionsService(parseInt(id));
  return res.status(200).send(transactions);
}

export async function blockCard(req: Request, res: Response) {
  const { password, id }: { password: string; id: number } = req.body;
  await cardService.blockService(id, password);
  res.sendStatus(200);
}
export async function unblockCard(req: Request, res: Response) {
  const { password, id }: { password: string; id: number } = req.body;
  await cardService.unblockService(id, password);
  res.sendStatus(200);
}
