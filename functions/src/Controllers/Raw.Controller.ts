import {Request,Response} from 'express';
import { Pin } from '../Models/Entity/Pin';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { RawService } from '../Services/Raw.Service';
export class RawController{

    private rawService:RawService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.rawService = new RawService();
    }

    async getRaw(req:Request,res:Response){
        let raw = await this.rawService.getRaw();
        return res.status(200).send(raw);
    }
}