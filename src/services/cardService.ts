import dayjs from "dayjs";
import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";
import * as cardRepository from "./../repositories/cardRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";

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
  id: string,
  cvc: string
) {
  const findCard = await cardRepository.findById(parseInt(id));

  if (!findCard) {
    // return res.sendStatus(404)
  }
  if (dayjs(findCard.expirationDate) < dayjs())
    throw { type: "Card expirated", message: "Cartão expirou" };

  if (findCard.password)
    throw { type: "Card is already active", message: "Cartão já foi ativado" };

  if (cryptr.decrypt(findCard.securityCode) !== cvc)
    throw {
      type: "Security Code isn't right",
      message: "CVV do cartão está incorreto",
    };

  await cardRepository.update(findCard.id, {
    password: cryptr.encrypt(password),
  });
}
