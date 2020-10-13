import { FormulationIngredients } from "../Models/Entity/Formulation.Ingredients";
import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { Formulation } from "../Models/Entity/Formulation";
import { Product } from "../Models/Entity/Product";
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";

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
            relations: ["product"]
        });
    }

    async getFormulationByLotInter(loteInterno:string){
        await this.getConnection();
        return await this.formulationIngredientsRepository.query(`
        SELECT formulation.makeId as providerId,
        product_catalog.description as ingredent 
        FROM formulation_ingredients
        INNER JOIN formulation ON formulation.id = formulation_ingredients.formulation_id
        INNER JOIN product_catalog ON product_catalog.id = formulation_ingredients.product_id
        WHERE formulation.lote_interno = "${loteInterno}"; 
        `);/* createQueryBuilder("formulationIngredents")
        .innerJoin("formulationIngredents.formulationId","Formulation")
        .innerJoin("formulationIngredents.productId","Ingredents")
        .addSelect("Formulation.make","providerId")
        .addSelect("Ingredents.description","ingredient")
        .andWhere("Formulation.loteInterno = :loteInterno",{loteInterno:`${loteInterno}`})
        .getMany(); */
    }

    async getFormulationIngredentByLotProduct(product:Product,lotId:OutputsDrief){
        await this.getConnection();
        return await this.formulationIngredientsRepository.findOne({product,lotId},{relations: ["formulationId"]})
    }
}