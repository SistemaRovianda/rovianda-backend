import { EntranceDriefService } from "../Services/Entrance.Drief.Service";
import { Request,Response } from "express";
import { WarehouseDriefService } from "../Services/Warehouse.Drief.Service";
import { OutputsDriefService } from "../Services/Outputs.Drief.Service";
import { FirebaseHelper } from '../Utils/Firebase.Helper';

export class EntranceDriefController{
    private entranceDriefService:EntranceDriefService;
    private warehouseDriefService:WarehouseDriefService;
    private outputDriefService:OutputsDriefService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.entranceDriefService = new EntranceDriefService(this.firebaseInstance);
        this.warehouseDriefService = new WarehouseDriefService();
        this.outputDriefService = new OutputsDriefService();
    }

    async saveEntranceDrief(req:Request,res:Response){
        await this.entranceDriefService.saveEntranceDrief(req.body,req);
        return res.status(201).send();
    }

    async updateWarehousePacking(req:Request,res:Response){
        await this.warehouseDriefService.updateWarehouseDrief(req.body);
        return res.status(204).send();
    }

    async createOutputsDrief(req:Request,res:Response){
        await this.outputDriefService.createOutputsDrief(req.body);
        return res.status(201).send();
    }
 
    async getOutputsDriefIngredients(req:Request,res:Response){
    
        let outputs = await this.outputDriefService.getOutputsDriefs(req.body.lotId,req.body.productId);

        return res.status(200).send(outputs);
    }
}