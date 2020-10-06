import { WarehouseService } from "../Services/Warehouse.Service";
import {Request,Response} from "express";
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
}