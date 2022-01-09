import { WarehouseService } from "../Services/Warehouse.Service";
import {Request,Response} from "express";
import { WarehouseEntranceOutputsMetrics } from "../Models/DTO/WarehouseDTO";
import { FirebaseHelper } from "../Utils/Firebase.Helper";
export class WarehouseController{
    private warehouseService:WarehouseService;
    constructor(){
        this.warehouseService = new WarehouseService();
    }

    async createWarehouse(req:Request,res:Response){
        await this.warehouseService.createWarehouse(req.body);
        return res.status(201).send();
    }

    async getAllWarehouse(req:Request,res:Response){
        let result = await this.warehouseService.getAllWarehouse();       
        return res.status(200).send(result);
    }

    async getMetricsEntranceByDate(req:Request,res:Response){
        let warehouseSaeId:number = +req.params.warehouseSaeId;
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let response:WarehouseEntranceOutputsMetrics= await this.warehouseService.getEntranceOutputsWarehouse(warehouseSaeId,dateStart,dateEnd);
        return res.status(200).send(response);
    }

    // async updateUsersCreationDate(req:Request,res:Response){
    //     await this.firebaseHelper.updateUsers();
    //     return res.status(200).send();
    // }
}