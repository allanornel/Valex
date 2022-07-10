import dayjs from "dayjs";
import Cryptr from "cryptr";
import { findById } from "../repositories/cardRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

const cryptr = new Cryptr("myTotallySecretKey");

export async function payment(
  cardId: number,
  businessId: number,
  password: string,
  amount: number
) {
  const findCard = await findById(cardId);
  if (!findCard)
    throw {
      type: "Card not found",
      message: "Cartão não encontrado",
      statusCode: 404,
    };

  if (!findCard.password || findCard.isBlocked)
    throw {
      type: "Card isn't active or is blocked",
      message: "Cartão já foi ativado",
      statusCode: 422,
    };

  if (cryptr.decrypt(findCard.password) !== password)
    throw {
      type: "Wrong password",
      message: "Senha incorreta",
      statusCode: 422,
    };
  if (dayjs(findCard.expirationDate).isBefore(dayjs().format("MM-YY")))
    throw {
      type: "Card expirated",
      message: "Cartão expirou",
      statusCode: 422,
    };

  const findBusiness = await businessRepository.findById(businessId);
  if (!findBusiness)
    throw {
      type: "Business not found",
      message: "Empresa não encontrada",
      statusCode: 404,
    };

  if (findBusiness.type !== findCard.type)
    throw {
      type: "Business type isn't compatible with Card type",
      message: "Tipo da empresa não é compatível com o tipo do cartão",
      statusCode: 422,
    };

  let balance = 0;
  const transactions = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);
  transactions.forEach((t) => (balance -= t.amount));
  recharges.forEach((r) => (balance += r.amount));

  if (balance < amount)
    throw {
      type: "Insuficient balance",
      message: "Saldo insuficiente para essa transação",
      statusCode: 422,
    };

  await paymentRepository.insert({ cardId, businessId, amount });
}
