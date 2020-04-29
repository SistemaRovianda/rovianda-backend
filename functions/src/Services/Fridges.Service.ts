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
        return await this.fridgesRepository.getAllFridges();
    }

    async getFridgesById(id:number){
        return await this.fridgesRepository.getFridgeById(id);
    }
}