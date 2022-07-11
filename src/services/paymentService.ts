import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import {
  checkExpirationDate,
  checkPassword,
  findCard,
  getBalance,
} from "./cardService.js";
import Cryptr from "cryptr";
import dotenv from "dotenv";
dotenv.config();

const cryptr = new Cryptr(process.env.SECRET_KEY);

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

export async function onlinePurchaseService(
  number: string,
  cardholderName: string,
  securityCode: string,
  expirationDate: string,
  amount: number,
  businessId: number
) {
  const card = await cardRepository.findByCardDetails(
    number,
    cardholderName,
    expirationDate
  );
  if (!card)
    throw {
      type: "Card not found",
      message: "Cartão não encontrado",
      statusCode: 404,
    };
  if (cryptr.decrypt(card.securityCode) !== securityCode)
    throw {
      type: "Security Code isn't right",
      message: "CVV do cartão está incorreto",
      statusCode: 422,
    };
  if (card.expirationDate !== expirationDate)
    throw {
      type: "Wrong Expiration Date",
      message: "Data de vencimento não esta correta",
      statusCode: 422,
    };
  checkExpirationDate(card);
  if (card.isBlocked) {
    throw {
      type: "Card is blocked",
      message: "Cartão está bloqueado.",
      statusCode: 422,
    };
  }

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

  const { balance } = await getBalance(card.id);

  if (balance < amount)
    throw {
      type: "Insuficient balance",
      message: "Saldo insuficiente para essa transação",
      statusCode: 422,
    };

  await paymentRepository.insert({ cardId: card.id, businessId, amount });
}
