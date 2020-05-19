import {Request,Response} from 'express';
import { Fridge } from '../Models/Entity/Fridges';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { FridgesService } from '../Services/Fridges.Service';
export class FridgesController{

    private fridgesService:FridgesService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.fridgesService = new FridgesService();
    }

    async createFridges(req:Request,res:Response){
        await this.fridgesService.saveFridges(req);
        return res.status(201).send();
    }

    async getAllFridges(req:Request,res:Response){
        let fridges = await this.fridgesService.getAllFridges();
        return res.status(200).send(fridges);
    }

}