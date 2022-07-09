import { Request, Response } from "express";
import { Company } from "../repositories/companyRepository.js";
import * as rechargeService from "./../services/rechargeService.js";

export async function recharge(req: Request, res: Response) {
  const { id, value }: { id: string; value: number } = req.body;
  const findApi: Company = res.locals.findApi;

  if (!id || !value || value <= 0) res.sendStatus(422);

  await rechargeService.recharge(parseInt(id), value, findApi);
  res.sendStatus(200);
}
