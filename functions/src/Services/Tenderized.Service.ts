import { TenderizedRepository } from '../Repositories/Tenderized.Repository';
import { Tenderized } from '../Models/Entity/Tenderized';


export class TenderizedService{
    private tenderizedRepository:TenderizedRepository;
    constructor(){
        this.tenderizedRepository = new TenderizedRepository();
    }

    async createTenderized(tenderized:Tenderized){
        return await this.tenderizedRepository.createTenderized(tenderized);
    }
    
    async getTenderizedById(id:number){
        return await this.tenderizedRepository.getTenderizedById(id);
    }


    
}