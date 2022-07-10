import { Request, Response } from "express";
import { Company } from "../repositories/companyRepository.js";
import * as rechargeService from "./../services/rechargeService.js";

export async function recharge(req: Request, res: Response) {
  const { id, amount }: { id: string; amount: number } = req.body;
  const findApi: Company = res.locals.findApi;

  await rechargeService.recharge(parseInt(id), amount, findApi);
  res.sendStatus(200);
}
