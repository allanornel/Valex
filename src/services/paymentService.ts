import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import {
  checkExpirationDate,
  checkPassword,
  findCard,
  getBalance,
} from "./cardService.js";

export async function payment(
  cardId: number,
  businessId: number,
  password: string,
  amount: number
) {
  const card = await findCard(cardId);
  checkPassword(card, password);
  checkExpirationDate(card);

  if (!card.password || card.isBlocked)
    throw {
      type: "Card isn't active or is blocked",
      message: "Cartão já foi ativado",
      statusCode: 422,
    };

  const findBusiness = await businessRepository.findById(businessId);
  if (!findBusiness)
    throw {
      type: "Business not found",
      message: "Empresa não encontrada",
      statusCode: 404,
    };

  if (findBusiness.type !== card.type)
    throw {
      type: "Business type isn't compatible with Card type",
      message: "Tipo da empresa não é compatível com o tipo do cartão",
      statusCode: 422,
    };

  const { balance } = await getBalance(cardId);

  if (balance < amount)
    throw {
      type: "Insuficient balance",
      message: "Saldo insuficiente para essa transação",
      statusCode: 422,
    };

  await paymentRepository.insert({ cardId, businessId, amount });
}
