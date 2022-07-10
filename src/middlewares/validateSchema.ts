import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

export function validateSchema(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res
        .status(422)
        .send(error.details.map((detail) => detail.message));
    }

    next();
  };
}
