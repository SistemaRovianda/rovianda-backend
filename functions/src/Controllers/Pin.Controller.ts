import {Request,Response} from 'express';
import { Pin } from '../Models/Entity/Pin';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { PinService } from '../Services/Pin.Service';
export class PinController{

    private pinService:PinService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.pinService = new PinService();
    }

    async getAllPins(req:Request,res:Response){
        try{
            let pins:Pin[] = await this.pinService.getAllPins();
            return res.status(200).send(pins);
        }catch(err){
            return res.status(500).send(err);
        }
    }

}