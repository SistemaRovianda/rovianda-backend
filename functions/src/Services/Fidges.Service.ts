import { FidgesRepository } from "../Repositories/Fidges.Repository";
import { Fidges } from "../Models/Entity/Fidges";

export class FidgesService{
    private fidgesRepository:FidgesRepository;
    constructor(){
        this.fidgesRepository = new FidgesRepository();
    }

    async saveFidges(fidges:Fidges){
        return await this.fidgesRepository.saveFidges(fidges);
    }
}