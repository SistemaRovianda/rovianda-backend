import { Formulation } from "../Models/Entity/Formulation";
import { Repository, Between } from "typeorm";
import { connect } from "../Config/Db";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { groupBy } from "lodash";
import { LotInternalByLotDrief } from "../Models/DTO/LotInternalByLotDrief";

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
            relations: ["formulationIngredients","formulationIngredients.productId","verifit","make"]
        });
    }

    async getAllFormulationLoteMeat(){
        await this.getConnection();
        return await this.formulatioRepository.find({status:"USED"});
    }

    async getByproductRovianda(productId:number){
        await this.getConnection();
        return await this.formulatioRepository.query(`
        SELECT * FROM formulation WHERE product_rovianda_id = ${productId} 
        GROUP BY lote_interno`);
    }

    async getOneFormulationByLote(loteInterno:string){
        await this.getConnection();
        return await this.formulatioRepository.findOne({loteInterno});
    }

    async getOneFormulationsByLote(loteInterno:string){
        await this.getConnection();
        return await this.formulatioRepository.find({loteInterno});
    }

    async getLotInternalByLotDrief(loteDriefProveedor:string):Promise<Array<LotInternalByLotDrief>>{
        await this.getConnection();
        return await this.formulatioRepository.query(`select form.lote_interno,form.date,pr.name from formulation as form inner join formulation_ingredients as fi on form.id = fi.formulation_id
        inner join products_rovianda pr on form.product_rovianda_id=pr.id where fi.lot_id="${loteDriefProveedor}";`) as Array<LotInternalByLotDrief>;
    }

    async getFormulationByOutputCoolingId(outputCoolingId:number){
        await this.getConnection();
        return await this.formulatioRepository.findOne({outputCoolingIdRecord:outputCoolingId});
    }

    async getFormulationByLotInterProduct(loteInterno:string,productRovianda:ProductRovianda){
        await this.getConnection();
        return await this.formulatioRepository.findOne({loteInterno,productRovianda});
    }
}