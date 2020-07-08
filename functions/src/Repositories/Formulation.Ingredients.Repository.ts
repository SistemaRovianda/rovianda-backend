import { FormulationIngredients } from "../Models/Entity/Formulation.Ingredients";
import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { Formulation } from "../Models/Entity/Formulation";

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

    async getByFormulation(formulationId:Formulation){
        await this.getConnection();
        return await this.formulationIngredientsRepository.find({
            where: {formulationId:formulationId},
            relations: ["productId"]
        });
    }
}