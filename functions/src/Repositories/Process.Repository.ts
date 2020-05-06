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
        return await this.processRepository.query(`SELECT * FROM process WHERE status='ACTIVE';`);
    }

    async getAllProcess(){
        await this.getConnection();
        console.log("consulta")
        return await this.processRepository.find();
    }

    async getProcessById(process_id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.processRepository.query(`SELECT * FROM process WHERE id = ${process_id}`)
    }

    async getProcessWithGrindingById(id:number){
        await this.getConnection();
        return await this.processRepository.findOne({
            where: {id},
            relations:["molienda_id"]
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
            where: {id}
        });
    }
}







