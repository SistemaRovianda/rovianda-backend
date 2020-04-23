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

    async getProcessActive(){
        return await this.processRepository.getProcessActive();
    }

    async getProcessById(id:number){
        return await this.processRepository.getProcessById(id);
    }
}