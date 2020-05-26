import { CoolingRepository } from "../Repositories/Cooling.Repository";
import { Cooling } from '../Models/Entity/Cooling';

import { ProductRepository } from "../Repositories/Product.Repository";
import { Fridge } from "../Models/Entity/Fridges";
import { FridgeRepository } from "../Repositories/Fridges.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { WarehouseCollingDTO } from "../Models/DTO/WarehouseDTO";
import { response } from "express";

export class CoolingService{
    private coolingRepository:CoolingRepository;
    private productRepository:ProductRepository;
    private fridgeRepository:FridgeRepository;
    constructor(){
        this.coolingRepository = new CoolingRepository();
        this.productRepository = new ProductRepository();
        this.fridgeRepository = new FridgeRepository();
    }

    async updateStatus(coolingDTO:WarehouseCollingDTO){
        // let product = await this.productRepository.getProductById(coolingDTO.productId);
        // if(!product) throw new Error("[404], producto no existe");
        if(!coolingDTO.fridgeId) throw new Error("[400], falta el parametro fridgeId");
        if(!coolingDTO.loteId || coolingDTO.loteId=="") throw new Error("[400], falta el parametro logeId");
        let fridge = await this.fridgeRepository.getFridgeById(coolingDTO.fridgeId);
        if(!fridge[0]) throw new Error("[404], refrigerador no existe");
        let lote:Cooling = await this.coolingRepository.getCoolingByLote(coolingDTO.loteId);
        if(!lote) throw new Error("[404],el lote no existe");
        if(!coolingDTO.date || coolingDTO.date=="") throw new Error("[400], falta el parametro date");
        
        switch(coolingDTO.status){
            case WarehouseStatus.CLOSED:
                lote.status = WarehouseStatus.CLOSED;
                lote.closingDate = coolingDTO.date;
                break;
            case WarehouseStatus.OPENED:
                lote.status = WarehouseStatus.OPENED;
                lote.openingDate = coolingDTO.date;
                break;
            default:
                throw new Error("[400], estatus no valido");
                break;
        }
        await this.coolingRepository.saveCooling(lote);

    }

    async createCooling(cooling:Cooling){
        return await this.coolingRepository.saveCooling(cooling);
    }
    
    async getCoolingById(id:number){
        return await this.coolingRepository.getCoolingById(id);
    }

    
    async getCoollingByStatus(status:string){
        return await this.coolingRepository.getCoollingByStatus(status);
    }

    async getCoollingByFridge(fridgeId:number){

        if(!fridgeId) throw new Error("[400], fridgeId es requerido");

        let fridge = await this.fridgeRepository.getFridgeById(fridgeId);
        if(!fridge[0]) throw new Error("[404], refrigerador no existe");

        let coollingGroup = await this.coolingRepository.getCoollingByFridgeGroup(fridgeId);
        console.log(coollingGroup);
        let response:any = [];
        for(let i =0; i<coollingGroup.length; i++){
            let coollingLote = await this.coolingRepository.getCoollingByFridge(coollingGroup[i].lote_interno, fridgeId);
            console.log(coollingLote)
            let response1:any = [];
            for(let n = 0; n<coollingLote.length; n++){
                response1.push({
                    id: `${coollingLote[n].id}`,
                    rawMaterial: `${coollingLote[n].raw_material}`,
                    fridge: {
                        fridgeId: `${coollingLote[n].fridgeFridgeId}`,
                        temp: `${coollingLote[n].temp}`
                    }
                });
            }
            response.push({
                loteId: `${coollingGroup[i].lote_interno}`,
                Material: response1
            })
        }
        return response;
    }
}