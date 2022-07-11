import dayjs from "dayjs";
import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";
import * as cardRepository from "./../repositories/cardRepository.js";
import * as paymentRepository from "./../repositories/paymentRepository.js";
import * as rechargeRepository from "./../repositories/rechargeRepository.js";
import * as businessRepository from "./../repositories/businessRepository.js";
import { findById } from "../repositories/employeeRepository.js";

const cryptr = new Cryptr("myTotallySecretKey");

export async function insertCardService(
  type: cardRepository.TransactionTypes,
  employeeId: number
) {
  const findEmployeeName = await findById(employeeId);
  if (!findEmployeeName)
    throw {
      type: "Employee not found",
      message: "Funcionário não encontrado",
      statusCode: 404,
    };
  const findByType = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );
  if (findByType)
    throw {
      type: "Card with this type already exists",
      message: "Cartão desse tipo já existente",
      statusCode: 422,
    };

  const number = faker.finance.creditCardNumber();
  const cvv = faker.finance.creditCardCVV();
  const encryptedCvv = cryptr.encrypt(cvv);
  const cardholderName = createCardHolderName(findEmployeeName.fullName);
  const expirationDate = dayjs().add(5, "year").format("MM/YY");

  await cardRepository.insert({
    employeeId,
    number,
    cardholderName,
    securityCode: encryptedCvv,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type,
  });

  return { number, securityCode: cvv, cardholderName, expirationDate };
}

function createCardHolderName(name: string): string {
  const arr = name.split(" ");
  let obj = "";
  for (let i = 0; i < arr.length; i++) {
    if (i === 0 || i === arr.length - 1) {
      obj += arr[i] + " ";
    } else if (arr[i].length >= 3) {
      obj += arr[i][0] + " ";
    }
  }
  return obj.trim().toUpperCase();
}

export async function activeCardService(
  password: string,
  id: number,
  cvc: string
) {
  const card = await findCard(id);
  checkExpirationDate(card);
  if (card.password)
    throw {
      type: "Card is already active",
      message: "Cartão já foi ativado",
      statusCode: 422,
    };

  if (cryptr.decrypt(card.securityCode) !== cvc)
    throw {
      type: "Security Code isn't right",
      message: "CVV do cartão está incorreto",
      statusCode: 422,
    };

  await cardRepository.update(id, {
    password: cryptr.encrypt(password),
  });
}

export async function transactionsService(id: number) {
  await findCard(id);
  const { balance, transactions, recharges } = await getBalance(id);
  return { balance, transactions, recharges };
}

export async function blockService(id: number, password: string) {
  const card = await findCard(id);
  checkExpirationDate(card);
  checkPassword(card, password);

  if (card.isBlocked === true)
    throw {
      type: "Card is blocked",
      message: "Cartão já se encontra bloqueado",
      statusCode: 422,
    };
  await cardRepository.update(id, { isBlocked: true });
}

export async function unblockService(id: number, password: string) {
  const card = await findCard(id);
  checkExpirationDate(card);
  checkPassword(card, password);

  if (card.isBlocked === false)
    throw {
      type: "Card isn't blocked",
      message: "Cartão não está bloqueado",
      statusCode: 422,
    };

  await cardRepository.update(id, { isBlocked: false });
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

export async function findCard(id: number) {
  const card = await cardRepository.findById(id);

  if (!card)
    throw {
      type: "Card not found",
      message: "Cartão não encontrado",
      statusCode: 404,
    };

  return card;
}

export function checkExpirationDate(card: cardRepository.Card) {
  if (dayjs(card.expirationDate).isBefore(dayjs().format("MM-YY")))
    throw {
      type: "Card expirated",
      message: "Cartão expirou",
      statusCode: 422,
    };
}

export async function getBalance(id: number) {
  let balance = 0;
  const transactions = await paymentRepository.findByCardId(id);
  const recharges = await rechargeRepository.findByCardId(id);
  transactions.forEach((t) => (balance -= t.amount));
  recharges.forEach((r) => (balance += r.amount));

  return { balance, transactions, recharges };
}

export function checkPassword(card: cardRepository.Card, password: string) {
  if (cryptr.decrypt(card.password) !== password)
    throw {
      type: "Wrong password",
      message: "Senha incorreta",
      statusCode: 422,
    };
}
