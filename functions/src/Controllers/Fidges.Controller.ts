import {Request,Response} from 'express';
import { Fidges } from '../Models/Entity/Fidges';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { FidgesService } from '../Services/Fidges.Service';
export class FidgesController{

    private fidgesService:FidgesService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.fidgesService = new FidgesService();
    }

    async createFidges(req:Request,res:Response){
        let {tempOfFridge} = req.body;
        let fidges:Fidges = new Fidges();
        try{
            if(!tempOfFridge) return res.status(400).send("tempOfFridge is required")
            fidges.temo = tempOfFridge;
            await this.fidgesService.saveFidges(fidges);
            return res.status(201).send();
        }catch(err){
            return res.status(500).send(err);
        }
    }

}