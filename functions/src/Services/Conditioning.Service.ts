import { ConditioningRepository } from '../Repositories/Conditioning.Repository';
import { Conditioning } from '../Models/Entity/Conditioning';

export class ConditioningService{
    private conditioningRepository:ConditioningRepository;
    constructor(){
        this.conditioningRepository = new ConditioningRepository();
    }
    
    async createConditioning(conditioning:Conditioning){
        return await this.conditioningRepository.createConditioning(conditioning);
    }

    async getProductConditioning(processid:number){
        return await this.conditioningRepository.getProductConditioning(processid);
    }
}