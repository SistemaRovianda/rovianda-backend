import { OutputsDriefRepository } from "../Repositories/Outputs.Drief.Repository";
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";

export class OutputsDriefService{
    private outputsDriefRepository:OutputsDriefRepository;
    constructor(){
        this.outputsDriefRepository = new OutputsDriefRepository();
    }

    async createOutputsDrief(outputsDrief:OutputsDrief){
        return await this.outputsDriefRepository.createOutputsDrief(outputsDrief);
    }
    
    async getAlloutputsDrief(){
        return await this.outputsDriefRepository.getAllOutputsDrief();
    }

    async getOutputsDriefgById(id:number){
        return await this.outputsDriefRepository.getOutputsDriefById(id);
    }

    async getOutputsDriefByLot(lot:string){
        return await this.outputsDriefRepository.getOutputsDriefByLot(lot);
    }
    
}