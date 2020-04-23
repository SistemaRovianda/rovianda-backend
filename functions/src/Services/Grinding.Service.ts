import { GrindingRepository } from "../Repositories/Grinding.Repository";
import { Grinding } from "../Models/Entity/Grinding";

export class GrindingService{
    private grindingRepository:GrindingRepository;
    constructor(){
        this.grindingRepository = new GrindingRepository();
    }

    async saveGrinding(grinding:Grinding){
        return await this.grindingRepository.saveGrinding(grinding);
    }

    async getLastGrinding(){
        return await this.grindingRepository.getLastGrinding();
    }
    
}