import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { WarehousePackingService } from '../Services/Warehouse.Packing.Service';
import { OutputsPackingService } from '../Services/Outputs.Packing.Service';

export class EntrancesPackingController  {

    private warehousepackingService:WarehousePackingService;
    private outputsPackingService:OutputsPackingService;

    constructor(){
        this.warehousepackingService = new WarehousePackingService();
        this.outputsPackingService = new OutputsPackingService();
    }

    // async createEntrancePacking(req:Request,res:Response){
    //     await this.entrancePackingService.saveEntrancePacking(req.body);
    //     return res.status(201).send();
    // }

    async updateWarehousePacking(req:Request,res:Response){
       
        
        await this.warehousepackingService.updateWarehouseStatus(req.body);
        return res.status(204).send();
       
    }
        
    // async closeWarehousePacking(req:Request,res:Response){
    //     let {id} = req.query;
    //     try{
    //         let warehousePacking:WarehousePacking = await this.warehousepackingService.getWarehousePackingById(+id);
    //         if(warehousePacking){
    //             if(warehousePacking.status == "CLOSED"){
    //                 return res.status(403).send({msg:"YA ESTA CERRADA"});
    //             }else{
    //                 warehousePacking.status = "CLOSED";
    //                 await this.warehousepackingService.saveWarehousePacking(warehousePacking);
    //                 return res.status(201).send({msg:"CERRADA"});
    //             }
    //         }else{
    //             return res.status(404).send({msg:"NO EXISTE"});
    //         }
    //     }catch(err){
    //         return res.status(500).send(err);
    //     }
    // }

    async createOutputsPacking(req:Request,res:Response){
        
            await this.outputsPackingService.createOutputsPacking(req.body);
            return res.status(201).send();
       

    }

}
