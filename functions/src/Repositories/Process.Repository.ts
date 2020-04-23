import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Process } from '../Models/Entity/Process';

export class ProcessRepository{
    private processRepository:Repository<Process>;

    async getConnection(){
        if(!this.processRepository){
            this.processRepository = (await connect()).getRepository(Process);
        }
    }

    async createProcess(process:Process){
        await this.getConnection();
        return await this.processRepository.save(process);
    }

    async getProcessActive(){
        await this.getConnection();

        console.log("consulta")
        return await this.processRepository.query(`SELECT process.id , process.current_process, process.start_date, process.end_date, process.lote_interno , product.description FROM process INNER JOIN product on process.product_id = product.id WHERE process.status='ACTIVE';`);
    }

    async getProcessById(id:number){
        await this.getConnection();
        return await this.processRepository.findOne(id)
    }

}







