import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Process } from '../Models/Entity/Process';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { ProcessAvailablesToOven } from '../Models/Enum/ProcessStatus';

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
            relations:["product","meatProcess"]
        });
    }

    async getAllProcess(){
        await this.getConnection();
        console.log("consulta")
        return await this.processRepository.find();
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
            relations:["sausage","tenderized","conditioning","grinding","product"]
        });
    }

    async findProcessByProcessId(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({id},{relations:["product","meatProcess"]})
    }
     
    async getProceesByLot(newLote:string,productId:number){
        await this.getConnection();
        return await this.processRepository.query(`SELECT * FROM process WHERE new_lote = "${newLote}" and product_rovianda_id=${productId}`)
    }

    async getProceesByProduct(productId:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {productId: `${productId}`}
        });
    }

    async getProceesByProductID(product:ProductRovianda){
        await this.getConnection();
        return await this.processRepository.findOne({product});
    }

    async getProceesByLotIner(loteInterno:string){
        await this.getConnection();
        return await this.processRepository.query(`SELECT * FROM process WHERE lote_interno = "${loteInterno}"`)
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
        return await this.processRepository.query(`SELECT * FROM process ORDER BY id DESC LIMIT 1`)
    }

    async getProceesByLotInter(loteInterno:string){
        await this.getConnection();
        return await this.processRepository.query(`
        SELECT process.start_date as date,
	           process.current_process as description
        FROM process
        WHERE process.lote_interno = "${loteInterno}"`);
        /* createQueryBuilder("process")
        .select("process.startDate","date")
        .addSelect("process.currentProcess","description")
        .where("process.loteInterno = :loteInterno",{loteInterno:`${loteInterno}`})
        .getMany() */
    }

    async getAllProcessAvailable(){
        await this.getConnection();
        return await this.processRepository.query(`
        select pro.id as recordId,pro.lote_interno as lotId,pro.product_rovianda_id as productId,pr.name as productName,pro.date_ended_process as dateEndedProcess
         from process as pro inner join products_rovianda as pr on pro.product_rovianda_id = pr.id 
         where pro.status="INACTIVE" order by pro.lote_interno,pro.product_rovianda_id
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
}







