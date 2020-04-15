import {Request,Response} from 'express';
import { ErrorHandler } from '../Utils/Error.Handler';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { WarehousePackingService } from '../Services/Warehouse.Packing.Service';

export class EntrancesPackingController extends ErrorHandler {

    private warehousepackingService:WarehousePackingService;

    constructor(private firebaseInstance:FirebaseHelper){
        super();
        this.warehousepackingService = new WarehousePackingService();
    }

    async createWarehousePacking(req:Request,res:Response){
       
        try{
            await this.warehousepackingService.saveWarehousePacking(req.body);
            return res.status(201).send();
        }catch(err){
            return res.status(400).send(this.parser(err.message,res));
        }

    }

}
