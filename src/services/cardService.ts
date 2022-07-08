import dayjs from "dayjs";
import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";
import {
  find,
  findByCardDetails,
  findByTypeAndEmployeeId,
  TransactionTypes,
  update,
} from "../repositories/cardRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";

const cryptr = new Cryptr("myTotallySecretKey");

export async function insertCardService(
  apiKey: string,
  type: TransactionTypes,
  employeeId: number
) {
  const findApi = await findByApiKey(apiKey);

  if (!findApi) {
    // return res.sendStatus(404)
  }

  const findEmployeeName = await findById(employeeId);
  if (!findEmployeeName) {
    // return res.sendStatus(404);
  }
  // Empregados não podem possuir mais de um cartão do mesmo tipo
  findByTypeAndEmployeeId(type, employeeId);
  if (!findByTypeAndEmployeeId) {
    // return res.sendStatus(422);
  }
  const number = faker.finance.creditCardNumber();
  const cvv = faker.finance.creditCardCVV();
  const encryptedCvv = cryptr.encrypt(cvv);
  const cardHolderName = createCardHolderName(findEmployeeName.fullName);
  const expirationDate = dayjs().add(5, "year").format("MM/YY");
}

function createCardHolderName(name: string) {
  const arr = name.split(" ");
  let obj = "";
  for (let i = 0; i < arr.length; i++) {
    if (i === 0 || i === arr.length - 1) {
      obj += arr[i] + " ";
    } else if (arr[i].length >= 3) {
      obj += arr[i][0] + " ";
    }
  }
  return obj.trim().toUpperCase;
}

export async function activeCardService(
  password: string,
  cardNumber: string,
  cvc: string
) {
  const findCard = await findByCardDetails(cardNumber, null, null);

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

  await update(findCard.id, { password: cryptr.encrypt(password) });
}
