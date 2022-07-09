import { NextFunction, Request, Response } from "express";
import { findByApiKey } from "../repositories/companyRepository.js";

export default async function checkApi(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey: string = req.header("x-api-key");
  if (!apiKey) {
    throw {
      type: "API not send",
      message: "API não foi enviada",
      statusCode: 422,
    };
  }

  const findApi = await findByApiKey(apiKey);
  if (!findApi)
    throw {
      type: "API not found",
      message: "API não encontrada",
      statusCode: 404,
    };

  res.locals.findApi = findApi;
  next();
}
