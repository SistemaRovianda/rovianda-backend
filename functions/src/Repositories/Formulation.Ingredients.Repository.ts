import { FormulationIngredients } from "../Models/Entity/Formulation.Ingredients";
import { Repository } from "typeorm";
import { connect } from "../Config/Db";

export class FormulatioIngredientsRepository {
    private formulationIngredientsRepository: Repository<FormulationIngredients>;

    async getConnection() {
        if (!this.formulationIngredientsRepository)
            this.formulationIngredientsRepository = (await connect()).getRepository(FormulationIngredients);
    }

    async saveFormulationIngredients(formulationIngredients: FormulationIngredients) {
        await this.getConnection();
        return await this.formulationIngredientsRepository.save(formulationIngredients);
    }
}