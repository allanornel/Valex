import dayjs from "dayjs";
import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";
import * as cardRepository from "./../repositories/cardRepository.js";
import * as paymentRepository from "./../repositories/paymentRepository.js";
import * as rechargeRepository from "./../repositories/rechargeRepository.js";
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

  // Empregados não podem possuir mais de um cartão do mesmo tipo
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
  const findCard = await cardRepository.findById(id);
  if (!findCard)
    throw {
      type: "Card not found",
      message: "Cartão não encontrado",
      statusCode: 404,
    };

  if (dayjs(findCard.expirationDate).isBefore(dayjs().format("MM-YY")))
    throw {
      type: "Card expirated",
      message: "Cartão expirou",
      statusCode: 422,
    };

  if (findCard.password)
    throw {
      type: "Card is already active",
      message: "Cartão já foi ativado",
      statusCode: 422,
    };

  if (cryptr.decrypt(findCard.securityCode) !== cvc)
    throw {
      type: "Security Code isn't right",
      message: "CVV do cartão está incorreto",
      statusCode: 422,
    };

  await cardRepository.update(findCard.id, {
    password: cryptr.encrypt(password),
  });
}

export async function transactionsService(id: number) {
  const findCard = await cardRepository.findById(id);
  if (!findCard)
    throw {
      type: "Card not found",
      message: "Cartão não encontrado",
      statusCode: 404,
    };

  let balance = 0;
  const transactions = await paymentRepository.findByCardId(id);
  const recharges = await rechargeRepository.findByCardId(id);
  transactions.forEach((t) => (balance -= t.amount));
  recharges.forEach((r) => (balance += r.amount));

  return { balance, transactions, recharges };
}

export async function blockService(id: number, password: string) {
  const findCard = await cardRepository.findById(id);
  if (!findCard)
    throw {
      type: "Card not found",
      message: "Cartão não encontrado",
      statusCode: 404,
    };

  if (cryptr.decrypt(findCard.password) !== password)
    throw {
      type: "Wrong password",
      message: "Senha incorreta",
      statusCode: 422,
    };

  if (findCard.isBlocked === true)
    throw {
      type: "Card is blocked",
      message: "Cartão já se encontra bloqueado",
      statusCode: 422,
    };

  if (dayjs(findCard.expirationDate).isBefore(dayjs().format("MM-YY")))
    throw {
      type: "Card expirated",
      message: "Cartão expirou",
      statusCode: 422,
    };

  await cardRepository.update(id, { isBlocked: true });
}

export async function unblockService(id: number, password: string) {
  const findCard = await cardRepository.findById(id);
  if (!findCard)
    throw {
      type: "Card not found",
      message: "Cartão não encontrado",
      statusCode: 404,
    };

  if (cryptr.decrypt(findCard.password) !== password)
    throw {
      type: "Wrong password",
      message: "Senha incorreta",
      statusCode: 422,
    };

  if (findCard.isBlocked === false)
    throw {
      type: "Card isn't blocked",
      message: "Cartão não está bloqueado",
      statusCode: 422,
    };

  if (dayjs(findCard.expirationDate).isBefore(dayjs().format("MM-YY")))
    throw {
      type: "Card expirated",
      message: "Cartão expirou",
      statusCode: 422,
    };

  await cardRepository.update(id, { isBlocked: false });
}
