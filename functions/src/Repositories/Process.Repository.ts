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
}