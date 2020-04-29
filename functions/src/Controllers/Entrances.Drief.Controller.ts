import { EntranceDriefService } from "../Services/Entrance.Drief.Service";
import { Request,Response } from "express";
import { WarehouseDriefService } from "../Services/Warehouse.Drief.Service";
import { OutputsDriefService } from "../Services/Outputs.Drief.Service";

export class EntranceDriefController{
    private entranceDriefService:EntranceDriefService;
    private warehouseDriefService:WarehouseDriefService;
    private outputDriefService:OutputsDriefService;
    constructor(){
        this.entranceDriefService = new EntranceDriefService();
        this.warehouseDriefService = new WarehouseDriefService();
        this.outputDriefService = new OutputsDriefService();
    }

    async saveEntrance(req:Request,res:Response){
        await this.entranceDriefService.saveEntranceDrief(req.body);
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
}