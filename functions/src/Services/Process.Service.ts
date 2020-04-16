import { ProcessRepository } from '../Repositories/Process.Repository';
import { Process } from "../Models/Entity/Process";

export class ProcessService{
    private processRepository:ProcessRepository;
    constructor(){
        this.processRepository = new ProcessRepository();
    }

    async createProcess(process:Process){
        return await this.processRepository.createProcess(process);
    }
}