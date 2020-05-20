import { Request,Response } from "express";
import { DryngLabelService } from "../Services/Dring.Label.Service";

export class DryngLabelController{
    private dryngLabelService:DryngLabelService;
    constructor(){
        this.dryngLabelService = new DryngLabelService();
    }

    async createDringLabel(req:Request,res:Response){
        await this.dryngLabelService.createDringLabel(req.body);
        return res.status(201).send();
    }

    async getDryngLabelById(req:Request,res:Response){
        let dryngLabel = await this.dryngLabelService.getDryngLabelById(+req.params.id);
        return res.status(200).send(dryngLabel);
    }

    
}