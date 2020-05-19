import { FridgeRepository } from "../Repositories/Fridges.Repository";
import { Fridge } from "../Models/Entity/Fridges";
import { Request } from "express";

export class FridgesService{
    private fridgesRepository:FridgeRepository;
    constructor(){
        this.fridgesRepository = new FridgeRepository();
    }

    async saveFridges(req:Request){
        let {tempOfFridge} = req.body;
        if(!tempOfFridge) throw new Error("[400],tempOfFridge is required")
        let fridges:Fridge = new Fridge();
        fridges.temp = tempOfFridge;
        return await this.fridgesRepository.saveFridge(fridges);
    }
    
    async getAllFridges(){
        let friges:Fridge[] = await this.fridgesRepository.getAllFridges();
        let response = [];
        friges.forEach(i => {
            response.push({
                fridge_id: `${i.fridgeId}`,
                temp: `${i.temp}`  
            });
        });
        return response;
    }

    async getFridgesById(id:number){
        return await this.fridgesRepository.getFridgeById(id);
    }
}