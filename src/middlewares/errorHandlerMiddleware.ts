import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
  if (error.response) {
    return res.sendStatus(error.response.status);
  }
  if (error.statusCode) {
    return res.status(error.statusCode).send(error);
  }
  res.sendStatus(500); // internal server error
}
