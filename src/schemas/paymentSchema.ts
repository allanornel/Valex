import joi from "joi";

const paymentSchema = joi.object({
  cardId: joi.number().required(),
  password: joi.string().length(4).required(),
  businessId: joi.number().required(),
  amount: joi.number().required().greater(0),
});

export default paymentSchema;
