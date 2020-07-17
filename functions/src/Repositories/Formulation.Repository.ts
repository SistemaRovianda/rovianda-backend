import { Formulation } from "../Models/Entity/Formulation";
import { Repository, Between } from "typeorm";
import { connect } from "../Config/Db";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";

export class FormulationRepository{
    private formulatioRepository: Repository<Formulation>;
    
    async getConnection(){
        if(!this.formulatioRepository)
            this.formulatioRepository = (await connect()).getRepository(Formulation);
    }

    async saveFormulation(formulation: Formulation){
        await this.getConnection();
        return await this.formulatioRepository.save(formulation);
    }
    
    async getByLoteId(loteId:string,productId:ProductRovianda){
        await this.getConnection();
        return await this.formulatioRepository.findOne({loteInterno:loteId,productRovianda:productId});
    }

    async getLastFormulation(){
        await this.getConnection();
        return await this.formulatioRepository.query(`SELECT * FROM formulation ORDER BY id DESC LIMIT 1`)
    }

    async getAllFormulation(){
        await this.getConnection();
        return await this.formulatioRepository.find({});
    }

    async getAllFormulationOrderProduct(){
        await this.getConnection();
        return await this.formulatioRepository.query(`
        SELECT * FROM formulation GROUP BY product_rovianda_id
        `);
    }

    async getFormulationByProductRovianda(productRovianda:ProductRovianda){
        await this.getConnection();
        return await this.formulatioRepository.find({productRovianda});
    }

    async getByFormulationId(id:number){
        await this.getConnection();
        return await this.formulatioRepository.findOne({id},{relations:["verifit", "make"]});
    }

    async getFormulationsByDate(initDate: Date, finDate: Date){
        await this.getConnection();
        return await this.formulatioRepository.find({
            where: {date: Between(initDate,finDate)},
            relations: ["formulationIngredients","formulationIngredients.productId"]
        });
    }
}