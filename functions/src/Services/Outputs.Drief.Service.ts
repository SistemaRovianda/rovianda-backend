import { OutputsDriefRepository } from "../Repositories/Outputs.Drief.Repository";

export class OutputsDriefService{
    private outputsDriefRepository:OutputsDriefRepository;
    constructor(){
        this.outputsDriefRepository = new OutputsDriefRepository();
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