import { Formulation } from "../Models/Entity/Formulation";
import { Repository, Between, In } from "typeorm";
import { connect } from "../Config/Db";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { groupBy } from "lodash";
import { LotInternalByLotDrief } from "../Models/DTO/LotInternalByLotDrief";
import { Defrost } from "../Models/Entity/Defrost";
import { DefrostFormulation } from "../Models/Entity/Defrost.Formulation";
import { Process } from "../Models/Entity/Process";
import { OutputsByEntrance } from "../Models/DTO/Quality.DTO";

export class FormulationRepository{
    private formulatioRepository: Repository<Formulation>;
    
    async getConnection(){
        if(!this.formulatioRepository)
            this.formulatioRepository = (await connect()).getRepository(Formulation);
    }

    async getByFormulationIdAndProcess(formulationId:number){
        await this.getConnection();
        return await this.formulatioRepository.findOne({id:formulationId},{relations:["process"]})
    }
    async getFormulationsByIds(formulationsIds:number[]){
        await this.getConnection();
        return await this.formulatioRepository.find({where:{id: In(formulationsIds)},relations:["process"]});
    }
    async saveFormulation(formulation: Formulation){
        await this.getConnection();
        return await this.formulatioRepository.save(formulation);
    }
    
    // async getByLoteId(loteId:string,productId:ProductRovianda){
    //     await this.getConnection();
    //     return await this.formulatioRepository.findOne({loteInterno:loteId,productRovianda:productId});
    // }

    async getAllFormulationHistoryByOutputs(outputs:number[]){
        await this.getConnection();
        let ids = "(";
        for(let id of outputs){
            ids+=`${id},`
        };
        ids+=")";
        ids=ids.replace(",)",")");
        return await this.formulatioRepository.query(`
                select fo.id as formulationId,us.name as providerId,fo.lot_day as lotDay,fo.date,fo.water_temp as temp,pr.name as product from defrost as de
        right join defrost_formulation as def on de.defrost_id=def.defrostDefrostId right join 
        formulation as fo on def.formulation_id=fo.id left join users as us on us.id=fo.makeId left join products_rovianda as pr
        on pr.id=fo.product_rovianda_id
        where de.defrost_id in ${ids}
                `);        
            
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
        SELECT * FROM formulation where status="UNUSED" order by product_rovianda_id
        `);
    }

    async getFormulationByProductRovianda(productRovianda:ProductRovianda){
        await this.getConnection();
        return await this.formulatioRepository.find({productRovianda,status:"UNUSED"});
    }

    async getByFormulationId(id:number){
        await this.getConnection();
        return await this.formulatioRepository.findOne({id},{relations:["verifit", "make","process"]});
    }

    async getFormulationsByDate(initDate: Date, finDate: Date){
        await this.getConnection();
        return await this.formulatioRepository.find({
            where: {date: Between(initDate,finDate)},
            relations: ["ingredients","ingredients.product","verifit","make"]
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

    // async getOneFormulationByLote(loteInterno:string){
    //     await this.getConnection();
    //     return await this.formulatioRepository.findOne({loteInterno});
    // }

    // async getOneFormulationsByLote(loteInterno:string){
    //     await this.getConnection();
    //     return await this.formulatioRepository.find({loteInterno});
    // }

    async getLotInternalByLotDrief(loteDriefProveedor:string):Promise<Array<LotInternalByLotDrief>>{
        await this.getConnection();
        return await this.formulatioRepository.query(`select form.lot_day as lotDay,form.date,pr.name from formulation as form inner join formulation_ingredients as fi on form.id = fi.formulation_id
        inner join products_rovianda pr on form.product_rovianda_id=pr.id where fi.lot_id="${loteDriefProveedor}";`) as Array<LotInternalByLotDrief>;
    }

    async getByOutputCoolingArray(defrosts:DefrostFormulation){
        await this.getConnection();
        return await this.formulatioRepository.findOne({where:{defrosts:defrosts}});
    }

    // async getFormulationByOutputCoolingId(outputCoolingId:number){
    //     await this.getConnection();
    //     return await this.formulatioRepository.findOne({outputCoolingIdRecord:outputCoolingId});
    // }

    // async getFormulationByLotInterProduct(loteInterno:string,productRovianda:ProductRovianda){
    //     await this.getConnection();
    //     return await this.formulatioRepository.findOne({loteInterno,productRovianda});
    // }

    async getByProcessEntity(process:Process){
        await this.getConnection();
        return await this.formulatioRepository.findOne({process});
    }

    async getFormulationsByDateAndLot(offset:number,perPage:number,lot:string,startDate:string,endDate:string){
        await this.getConnection();
        let lotStrQuery="";
        let datesStrQuery="";
        if(lot){
            lotStrQuery+=` form.lot_day like "%${lot}%"`
        }
        if(startDate && endDate){
            datesStrQuery+=` form.date between  "${startDate}T00:00:00.000Z" and "${endDate}T23:59:59.000Z" `;
        }
        
        let items= await this.formulatioRepository.query(`
            select form.id,form.temp,form.date,form.water_temp as waterTemp,
            form.status,form.lot_day as lotDay,form.type_formulation as type,pr.name,us.name as verifyBy,us2.name as makedBy,
            pr.id as productId
            from formulation as form left join users as us on form.verifitId=us.id
            left join users as us2 on form.makeId=us2.id
            left join products_rovianda as pr on form.product_rovianda_id=pr.id
            ${(lotStrQuery!="")?" where "+lotStrQuery:""} ${(datesStrQuery!=""?((lotStrQuery!="")?" and "+datesStrQuery:" where "+datesStrQuery):"")}
            limit ${perPage} offset ${offset}
        `) as OutputsByEntrance[];
        let count= await this.formulatioRepository.query(`
        select count(*) as count
        from formulation as form left join users as us on form.verifitId=us.id
        left join users as us2 on form.makeId=us2.id
        left join products_rovianda as pr on form.product_rovianda_id=pr.id
        ${(lotStrQuery!="")?" where "+lotStrQuery:""} ${(datesStrQuery!=""?((lotStrQuery!="")?" and "+datesStrQuery:" where "+datesStrQuery):"")}
        `) as {count:number}[];
        return {
            items,
            count:count[0].count
        }
    }
}