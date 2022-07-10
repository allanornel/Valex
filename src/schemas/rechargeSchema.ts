import joi from "joi";

const rechargeSchema = joi.object({
  id: joi.number().required(),
  amount: joi.number().required().greater(0),
});

export default rechargeSchema;
