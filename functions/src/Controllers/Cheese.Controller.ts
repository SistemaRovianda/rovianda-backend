import { Request,Response } from "express";
import { CheeseService } from "../Services/Cheese.Service";

export class CheeseController{
    private cheeseService:CheeseService;
    constructor(){
        this.cheeseService=new CheeseService();
    }

    async createCheese(req:Request,res:Response){
        await this.cheeseService.createCheese(req.body);
        return res.status(201).send();
    }

    async getAllCheeses(req:Request,res:Response){
        let chesses=await this.cheeseService.getAllCheeses();
        return res.status(200).send(chesses);
    }

    async updateCheeseStock(req:Request,res:Response){
        await this.cheeseService.updateCheeseCount(req.body);
        return res.status(204).send();
    }

}