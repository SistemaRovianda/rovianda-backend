import { CoolingRepository } from "../Repositories/Cooling.Repository";
import { Cooling } from '../Models/Entity/Cooling';

import { ProductRepository } from "../Repositories/Product.Repository";
import { Fridge } from "../Models/Entity/Fridges";
import { FridgeRepository } from "../Repositories/Fridges.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { WarehouseCollingDTO } from "../Models/DTO/WarehouseDTO";
import { CoolingStatus } from '../Models/Enum/CoolingStatus';
import { response } from "express";
import { Raw } from "../Models/Entity/Raw";
import { RawRepository } from "../Repositories/Raw.Repository";
import { OutputsCoolingRepository } from "../Repositories/Outputs.Cooling.Repository";
import { OutputsCooling } from "../Models/Entity/outputs.cooling";
import { OutputsCoolingStatus } from "../Models/Enum/OutputsCoolingStatus";

export class CoolingService{
    private coolingRepository:CoolingRepository;
    private outputCooling:OutputsCoolingRepository;
    private fridgeRepository:FridgeRepository;
    private rawMaterialRepository:RawRepository;
    constructor(){
        this.coolingRepository = new CoolingRepository();
        this.outputCooling = new OutputsCoolingRepository();
        this.fridgeRepository = new FridgeRepository();
        this.rawMaterialRepository = new RawRepository();
        
    }

    async updateStatus(coolingDTO:WarehouseCollingDTO){
        // let product = await this.productRepository.getProductById(coolingDTO.productId);
        // if(!product) throw new Error("[404], producto no existe");
        if(!coolingDTO.fridgeId) throw new Error("[400], falta el parametro fridgeId");
        if(!coolingDTO.status) throw new Error("[400], falta el parametro status");
        if(!coolingDTO.materialId) throw new Error("[400], falta el parametro materialId");
        if(!coolingDTO.loteId || coolingDTO.loteId=="") throw new Error("[400], falta el parametro logeId");
        let colling:Cooling = await this.coolingRepository.getCoolingById(coolingDTO.materialId)
        if(!colling) throw new Error("[404],no existe materialId");
        let fridge = await this.fridgeRepository.getFridgeById(coolingDTO.fridgeId);
        if(!fridge[0]) throw new Error("[404], refrigerador no existe");
        let lote:Cooling = await this.coolingRepository.getCoolingByLote(coolingDTO.loteId);
        if(!lote) throw new Error("[404],el lote no existe");
        if(!coolingDTO.date || coolingDTO.date=="") throw new Error("[400], falta el parametro date");
        
        switch(coolingDTO.status){
            case WarehouseStatus.CLOSED:
                colling.status = WarehouseStatus.CLOSED;
                colling.closingDate = coolingDTO.date;
                break;
            case WarehouseStatus.OPENED:
                colling.status = WarehouseStatus.OPENED;
                colling.openingDate = coolingDTO.date;
                break;
            default:
                throw new Error("[400], estatus no valido");
                break;
        }
        await this.coolingRepository.saveCooling(colling);

    }

    async createCooling(cooling:Cooling){
        return await this.coolingRepository.saveCooling(cooling);
    }
    
    async getCoolingById(id:number){
        return await this.coolingRepository.getCoolingById(id);
    }

    
    async getCoollingByStatus(status:string,rawMaterialId:number){
        let raw:Raw = await this.rawMaterialRepository.getById(rawMaterialId);
        if(!raw) throw new Error("[404], no existe la materia prima");
        let result:Array<OutputsCooling>=await this.outputCooling.getOutputCoolingByRawAndStatus(status,raw);
        return result.map(x=>({loteId:x.loteInterno,recordId:x.id,quantity:x.quantity}));
    }

    async getCoollingByFridge(fridgeId:number,status:string){
        //throw new Error("[400], status incorrecto");
        if(!fridgeId) throw new Error("[400], fridgeId es requerido");
        if(!status) throw new Error("[400], status es requerido");
        if(status == CoolingStatus.CLOSED || status == CoolingStatus.OPENED || status == CoolingStatus.PENDING){
            let fridge = await this.fridgeRepository.getFridgeById(fridgeId);
            if(!fridge[0]) throw new Error("[404], refrigerador no existe");
    
            let coollingGroup = await this.coolingRepository.getCoollingByFridgeGroup(fridgeId,status);
            console.log(coollingGroup);
            let response:any = [];
            for(let i =0; i<coollingGroup.length; i++){
                let coollingLote = await this.coolingRepository.getCoollingByFridge(coollingGroup[i].lote_interno, fridgeId,status);
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
        }else{
            throw new Error("[400], status incorrecto");
        }
    }

    async getCollingByLotInterno(loteInterno:string,fridgeId:number){
        if(!loteInterno) throw new Error("[400], lotId is requerid");
        //let fridge:Fridge = await this.fridgeRepository.getFridgeById(fridgeId);
        let colling:Cooling[] = await this.coolingRepository.getCollingByLotInterno(loteInterno,null);
        if(!colling) throw new Error("[404], lot not found");
        console.log(colling);
        let response:any = [];
        colling.forEach(i => {
            response.push({
                rawMaterialId:`${i.id}`,
                status: `${i.status}`,
                nameMaterial: `${i.rawMaterial.rawMaterial}`,
                lotProveedor: `${i.loteProveedor}`  
            });
        });
        return response;
    }

}