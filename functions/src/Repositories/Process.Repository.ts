import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Process } from '../Models/Entity/Process';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';

export class ProcessRepository{
    private processRepository:Repository<Process>;

    async getConnection(){
        if(!this.processRepository){
            this.processRepository = (await connect()).getRepository(Process);
        }
    }
    async findProcessByIdWithTenderized(processId:number){
        await this.getConnection();
        return await this.processRepository.findOne({id:processId},{relations:["tenderizedId"]});
    }

    async findProcessByIdWithSausaged(processId:number){
        await this.getConnection();
        console.log("consulta")
        return await this.processRepository.findOne({id:processId},{relations:["sausageId"]});
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

    async getAllProcess(){
        await this.getConnection();
        console.log("consulta")
        return await this.processRepository.find();
    }

    async getProcessWithGrindingById(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id},
            relations:["grindingId"]
        });
    }

    async getProcessWithSausagedById(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id},
            relations:["sausageId"]
        });
    }

    async findProcessById(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id},
            relations:["sausageId","tenderizedId","conditioningId","grindingId","product"]
        });
    }

    async findProcessByProcessId(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({id})
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

    async getProceesByLotInerno(loteInterno:string){
        await this.getConnection();
        return await this.processRepository.findOne({loteInterno})
    }

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
            relations:["conditioningId"]
        });
    }

    async findTenderizedByProcessId(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id: `${id}`},
            relations:["tenderizedId"]
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
}







