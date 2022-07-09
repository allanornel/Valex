import { findById } from "../repositories/cardRepository.js";
import { Company } from "../repositories/companyRepository.js";
import * as rechargeRepository from "./../repositories/rechargeRepository.js";

export async function recharge(id: number, value: number, findApi: Company) {
  const findCard = await findById(id);
  //   TODO VER A QUESTÃO DA COMPANY vs Seus Empregados
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

  await rechargeRepository.insert({ cardId: id, amount: value });
}
