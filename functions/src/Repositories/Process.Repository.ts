import {connect} from '../Config/Db';
import { Between, In, Repository } from 'typeorm';
import { Process } from '../Models/Entity/Process';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { ProcessAvailablesToOven } from '../Models/Enum/ProcessStatus';
import { Formulation } from '../Models/Entity/Formulation';
import { ProcessInventory } from '../Models/DTO/Quality.DTO';

export class ProcessRepository{
    private processRepository:Repository<Process>;

    async getConnection(){
        if(!this.processRepository){
            this.processRepository = (await connect()).getRepository(Process);
        }
    }
    async findProcessByIdWithTenderized(processId:number){
        await this.getConnection();
        return await this.processRepository.findOne({id:processId},{relations:["tenderized"]});
    }

    async findProcessByIdWithSausaged(processId:number){
        await this.getConnection();
        console.log("consulta")
        return await this.processRepository.findOne({id:processId},{relations:["sausage"]});
    }
    
    async getAllProcessHistoryByFormulationsIds(formulationsIds:number[]){
        let ids = "(";
        for(let id of formulationsIds){
            ids+=`${id},`
        }
        ids+=")";
        ids=ids.replace(",)",")");
        await this.getConnection();
        return await this.processRepository.query(
            `
            select pro.id as processId,fo.date as startDate,pro.end_date as endDate,pro.current_process as description
,pr.name as product,fo.lot_day as lotDay from process as pro 
right join formulation as fo on pro.formulationId=fo.id right join products_rovianda as pr on  
fo.product_rovianda_id=pr.id where fo.id in ${ids}
            `
            );
    }

    async saveProcess(process:Process){
        await this.getConnection();
        return await this.processRepository.save(process);
    }

    async createProcess(process:Process){
        await this.getConnection();
        console.log("consulta")
        return await this.processRepository.save(process);
    }

    async getProcessByStatus(status:string){
        await this.getConnection();
        console.log("consulta")
        return await this.processRepository.find({
            where: {status},
            relations:["product"]
        });
    }

    async getAllProcess(formulations:number[]){
        await this.getConnection();
        console.log("consulta")
        return await this.processRepository.find({where:{formulation: In(formulations) , typeProcess:"PRODUCT"}});
    }

    async getProcessWithGrindingById(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id},
            relations:["grinding","product"]
        });
    }

    async getProcessWithSausagedById(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id},
            relations:["sausage","product"]
        });
    }

    async findProcessById(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id},
            relations:["sausage","tenderized","conditioning","grinding","reprocesings"]
        });
    }

    async findProcessByIdWithReprocesings(processId:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id:processId},
            relations:["reprocesings"]
        });
    }

    async findProcessByProcessId(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({id},{relations:["product"]})
    }
     
    async getProceesByLot(newLote:string,productId:number){
        await this.getConnection();
        return await this.processRepository.query(`SELECT * FROM process WHERE new_lote = "${newLote}" and product_rovianda_id=${productId} and type_process='PRODUCT'`)
    }

    async getProceesByProduct(productId:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {productId: `${productId}`,typeProcess:"PRODUCT"}
        });
    }

    async getProceesByProductID(product:ProductRovianda){
        await this.getConnection();
        return await this.processRepository.findOne({product,typeProcess:"PRODUCT"});
    }

    async getProceesByLotIner(loteInterno:string){
        await this.getConnection();
        return await this.processRepository.query(`SELECT * FROM process WHERE lote_interno = "${loteInterno}" and type_process='PRODUCT'`)
    }

    // async getProceesByLotInerno(loteInterno:string){
    //     await this.getConnection();
    //     return await this.processRepository.findOne({loteInterno})
    // }

    // async findProceesByLotInerno(loteInterno:string){
    //     await this.getConnection();
    //     return await this.processRepository.find({loteInterno})
    // }

    async findProductByProcessId(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id: `${id}`},
            relations:["product"]
        });
    }
    
    async findConditioningByProcessId(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id: `${id}`},
            relations:["conditioning"]
        });
    }

    async findTenderizedByProcessId(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id: `${id}`},
            relations:["tenderized","product"]
        });
    }

    async getLastProcess(){
        await this.getConnection();
        return await this.processRepository.query(`SELECT * FROM process where process.type_process='PRODUCT' ORDER BY id DESC LIMIT 1`)
    }

    async getProceesByLotInter(loteInterno:string){
        await this.getConnection();
        return await this.processRepository.query(`
        SELECT process.start_date as date,
	           process.current_process as description
        FROM process
        WHERE process.lote_interno = "${loteInterno}" and process.type_process='PRODUCT'`);
        /* createQueryBuilder("process")
        .select("process.startDate","date")
        .addSelect("process.currentProcess","description")
        .where("process.loteInterno = :loteInterno",{loteInterno:`${loteInterno}`})
        .getMany() */
    }

    async getAllProcessAvailable(){
        await this.getConnection();
        return await this.processRepository.query(`
        select pro.id as recordId,pro.product_rovianda_id as productId,pr.name as productName,pro.end_date as dateEndedProcess,form.lot_day as lotDay
         from process as pro inner join products_rovianda as pr on pro.product_rovianda_id = pr.id inner join formulation as form on pro.formulationId=form.id
         where pro.status="INACTIVE" and pro.type_process ='PRODUCT' order by pro.product_rovianda_id
        `) as ProcessAvailablesToOven[];
    }

    async getAllSubProductProcessDerivations(){
        await this.getConnection();
        return await this.processRepository.query(`
        select pro.id as recordId,sp.product_rovianda_id as productId,pr.name as productName,pro.end_date as dateEndedProcess,form.lot_day as lotDay
         from process as pro 
         left join sub_product as sp on pro.id=sp.process_id 
         left join products_rovianda as pr on pr.id = sp.product_rovianda_id
         left join formulation as form on pro.formulationId=form.id
         WHERE pro.type_process ='PRODUCT' and  sp.status="ACTIVE";
        `) as ProcessAvailablesToOven[];
    }
    async getProcessById(processId:number){
        await this.getConnection();
        return await this.processRepository.findOne({id:processId});
    }

    async findsProcessById(id:number){
        await this.getConnection();
        return await this.processRepository.find({
            where: {id},
            relations:["sausage","tenderized","conditioning","grinding","product"]
        });
    }

    async getAllProcessIngredientsByProductRovianda(){
        await this.getConnection();
        return await this.processRepository.find({
            where:{typeProcess:"INGREDIENT",status:"INACTIVE"}
        });
    }

    async getAllProcessByDatesAndLotPaginated(offset:number,perPage:number,startDate:string,endDate:string,lot:string){
        await this.getConnection();
        let items:ProcessInventory[]=await this.processRepository.query(`
            SELECT pro.id,form.lot_day as lotDay,pr.name,pro.current_process as currentProcess,pro.type_process as typeProcess,pro.status as statusProcess,create_at as createAt
            FROM process as pro left join formulation as form on pro.formulationId=form.id
            left join products_rovianda as pr on pro.product_rovianda_id=pr.id
            ${lot?` where form.lot_day like "%${lot}%" `:""}
            ${(startDate && endDate)?((lot)?` and create_at between "${startDate}" and "${endDate}" `:` where create_at between "${startDate}" and "${endDate}"`):``}
            limit ${perPage} offset ${offset}
        `) as ProcessInventory[];
        let count:{count:number}[]=await this.processRepository.query(`
            SELECT count(*) as count
            FROM process as pro left join formulation as form on pro.formulationId=form.id
            left join products_rovianda as pr on pro.product_rovianda_id=pr.id
            ${lot?` where form.lot_day like "%${lot}%" `:""}
            ${(startDate && endDate)?((lot)?` and create_at between "${startDate}" and "${endDate}" `:` where create_at between "${startDate}" and "${endDate}"`):``}
        `) as {count:number}[];
        return {
            items,
            count: count[0].count
        }
    }

    async getAllSubProductsOfProcess(processId:number){
        await this.getConnection();
        return await this.processRepository.query(`
        select sp.sub_product_id as id,pr.name,sp.quantity,sp.observations,sp.create_at as createAt,
        sp.status,sp.last_modification as lastModification,us2.name as userModify,us.name as createdBy
        from sub_product as sp left join users as us on sp.sub_product_user_creator=us.id
        left join products_rovianda as pr on sp.product_rovianda_id=pr.id
        left join users as us2 on sp.user_modified_id=us2.id
        left join process as pro on sp.process_id=pro.id
        where sp.process_id=${processId} ;
        `);
    }
}







