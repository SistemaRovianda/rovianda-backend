import { GrindingRepository } from "../Repositories/Grinding.Repository";

export class GrindingService{
    private grindingRepository:GrindingRepository;

    constructor(){
        this.grindingRepository = new GrindingRepository();
    }

    async getGrindingById(id:number){
        return await this.grindingRepository.getGrindingById(id);
    }
}