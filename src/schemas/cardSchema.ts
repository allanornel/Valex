import joi, { string } from "joi";

export const blockUnblockSchema = joi.object({
  password: joi.string().length(4).required(),
  id: joi.number().required().greater(0),
});

export const activeCardSchema = joi.object({
  password: joi.string().length(4).required(),
  id: joi.number().required().greater(0),
  cvc: joi.string().length(3).required(),
});

export const createCardSchema = joi.object({
  type: joi.string().required(),
  employeeId: joi.number().required().greater(0),
});

export const onlinePurchaseSchema = joi.object({
  number: joi
    .string()
    .required()
    .pattern(/^\d{4}[\-]\d{4}[\-]\d{4}[\-]\d{4}$/),
  cardholderName: joi.string().required(),
  securityCode: joi.string().required().length(3),
  expirationDate: joi
    .string()
    .required()
    .pattern(/^\d{2}\/\d{2}$/),
  amount: joi.number().required().greater(0),
  businessId: joi.number().required(),
});
