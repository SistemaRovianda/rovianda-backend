import { Request, Response } from "express";
import { DayVisited } from "../Models/Entity/DayVisited";
import { User } from "../Models/Entity/User";
import { AdminSalesService } from "../Services/Admin.Sales.Service";

export class AdminSalesController{
    
    private adminSalesService:AdminSalesService;
    constructor(){
        this.adminSalesService = new AdminSalesService();
    }

    async getOnlySellers(req:Request,res:Response){
        let sellers:User[] =await this.adminSalesService.getAllSellers(); 
        return res.status(200).send(sellers);
    }


    async updateSellerClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        await this.adminSalesService.updateClientDetails(clientId,req.body);
        return res.status(204).send();
    }

    async createClientCount(req:Request,res:Response){
        let sellerId = req.params.sellerId;
        await this.adminSalesService.createClientCount(sellerId,req.body);
        return res.status(201).send();
    }

    async deleteLoginClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        await this.adminSalesService.deleteLogicClientCount(clientId);
        return res.status(204).send();
    }

    async getDaysVisitsByClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        let response:DayVisited=await this.adminSalesService.getDaysVisitedByClient(clientId);
        return res.status(200).send(response);
    }

    async getLastCountClient(req:Request,res:Response){
        let count = await this.adminSalesService.getLastClientId();
        return res.status(200).send({count});
    }
}