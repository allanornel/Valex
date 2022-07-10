import joi from "joi";

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
