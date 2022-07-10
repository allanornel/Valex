import { Company } from "../repositories/companyRepository.js";
import * as rechargeRepository from "./../repositories/rechargeRepository.js";
import { findCard } from "./cardService.js";

export async function recharge(id: number, amount: number, findApi: Company) {
  const card = await findCard(id);
  //   TODO VER A QUESTÃO DA COMPANY vs Seus Empregados

  if (!card.password || card.isBlocked)
    throw {
      type: "Card isn't active or is blocked",
      message: "Cartão já foi ativado",
      statusCode: 422,
    };

  await rechargeRepository.insert({ cardId: id, amount });
}
