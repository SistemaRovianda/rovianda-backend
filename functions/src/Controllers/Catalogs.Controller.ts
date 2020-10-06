import { Request, Response } from "express";
import { CatalogsService } from "../Services/Catalogs.Service";

export class CatalogsController{
    private catalogsService: CatalogsService;
    
    constructor(){
        this.catalogsService = new CatalogsService();
    }

    async getAllPaymentTypes(req: Request, res: Response){
        const paymentTypes = await this.catalogsService.getAllPaymentTypes();
        return res.status(200).send(paymentTypes);
    }

    async getAllCFDIUses(req: Request, res: Response){
        const CFDIUses = await this.catalogsService.getAllCatCFDIUses();
        return res.status(200).send(CFDIUses);
    }
}