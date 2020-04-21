import { OutputsCoolingRepository } from "../Repositories/Outputs.Cooling.Repository";
import { OutputsCooling } from '../Models/Entity/outputs.cooling';

export class OutputsCoolingService{
    private outputsCoolingRepository:OutputsCoolingRepository;
    constructor(){
        this.outputsCoolingRepository = new OutputsCoolingRepository();
    }

    async createOutputsCooling(outputsCooling:OutputsCooling){
        return await this.outputsCoolingRepository.createOutputsCooling(outputsCooling);
    }
    
    async getAlloutputsCooling(){
        return await this.outputsCoolingRepository.getAllOutputsCooling();
    }

    async getOutputsCoolingById(id:number){
        return await this.outputsCoolingRepository.getOutputsCoolingById(id);
    }

    async getOutputsCoolingByLot(lot:string){
        return await this.outputsCoolingRepository.getOutputsCoolingByLot(lot);
    }
    
}