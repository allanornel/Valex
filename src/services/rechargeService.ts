import { Company } from "../repositories/companyRepository.js";
import * as rechargeRepository from "./../repositories/rechargeRepository.js";
import * as employeeRepository from "./../repositories/employeeRepository.js";
import { findCard } from "./cardService.js";

export async function recharge(id: number, amount: number, findApi: Company) {
  const card = await findCard(id);
  const employee = await employeeRepository.findById(card.employeeId);

  if (employee.companyId !== findApi.id)
    throw {
      type: "Employee does not belong to this company",
      message: "Empregado não pertence a essa companhia",
      statusCode: 422,
    };

  if (!card.password || card.isBlocked)
    throw {
      type: "Card isn't active or is blocked",
      message: "Cartão já foi ativado",
      statusCode: 422,
    };

  await rechargeRepository.insert({ cardId: id, amount });
}
