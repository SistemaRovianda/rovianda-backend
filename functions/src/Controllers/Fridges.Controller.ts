import {Request,Response} from 'express';
import { Fridges } from '../Models/Entity/Fridges';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { FridgesService } from '../Services/Fridges.Service';
export class FridgesController{

    private fridgesService:FridgesService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.fridgesService = new FridgesService();
    }

    async createFridges(req:Request,res:Response){
        let {tempOfFridge} = req.body;
        let fridges:Fridges = new Fridges();
        try{
            if(!tempOfFridge) return res.status(400).send("tempOfFridge is required")
            fridges.temo = tempOfFridge;
            await this.fridgesService.saveFridges(fridges);
            return res.status(201).send();
        }catch(err){
            return res.status(500).send(err);
        }
    }

    async getAllFridges(req:Request,res:Response){
        let fridges:Fridges[] = await this.fridgesService.getAllFridges();
        let response:any = [];
        fridges.forEach((i:any) => {
            response.push({
                fridge_id: `${i.fidge_id}`,
                temp: `${i.temo}`
            });
        });
        return res.status(200).send(response);
    }

}