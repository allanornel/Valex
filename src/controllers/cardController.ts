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
  const { password, id, cvc }: { password: string; id: string; cvc: string } =
    req.body;

  if (!password || !id || !cvc || password.length !== 4) {
    return res.sendStatus(422);
  }

  await cardService.activeCardService(password, parseInt(id), cvc);

  return res.sendStatus(200);
}

export async function seeTransactions(req: Request, res: Response) {
  const id: string = req.params.id;
  if (!id) {
    return res.sendStatus(422);
  }

  const transactions = await cardService.transactionsService(parseInt(id));

  return res.status(200).send(transactions);
}

export async function blockCard(req: Request, res: Response) {
  const { password, id }: { password: string; id: string } = req.body;
  if (!password || !id) res.sendStatus(422);
  await cardService.blockService(parseInt(id), password);
  res.sendStatus(200);
}
export async function unblockCard(req: Request, res: Response) {
  const { password, id }: { password: string; id: string } = req.body;
  if (!password || !id) res.sendStatus(422);
  await cardService.unblockService(parseInt(id), password);
  res.sendStatus(200);
}
