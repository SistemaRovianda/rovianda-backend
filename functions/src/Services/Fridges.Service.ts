import { FridgesRepository } from "../Repositories/Fridges.Repository";
import { Fridges } from "../Models/Entity/Fridges";

export class FridgesService{
    private fridgesRepository:FridgesRepository;
    constructor(){
        this.fridgesRepository = new FridgesRepository();
    }

    async saveFridges(fridges:Fridges){
        return await this.fridgesRepository.saveFridges(fridges);
    }
    
    async getAllFridges(){
        return await this.fridgesRepository.getAllFridges();
    }
}