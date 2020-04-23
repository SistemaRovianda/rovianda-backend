import { SausagedRepository } from "../Repositories/Sausaged.Repository";
import { Sausaged } from "../Models/Entity/Sausaged";

export class SausagedService{
    private sausagedRepository:SausagedRepository;
    constructor(){
        this.sausagedRepository = new SausagedRepository();
    }

    async saveSausaged(sausaged:Sausaged){
        return await this.sausagedRepository.saveSausaged(sausaged);
    }

    async getLastSausaged(){
        return await this.sausagedRepository.getLastSausaged();
    }
    
}