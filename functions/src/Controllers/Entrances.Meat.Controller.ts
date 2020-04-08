import {Request,Response} from 'express';
import { ErrorHandler } from '../Utils/Error.Handler';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { EntrancesMeatService } from '../Services/Entrances.Meat.Services';

export class EntrancesMeatController extends ErrorHandler {

    private entrancesmeatService:EntrancesMeatService;

    constructor(private firebaseInstance:FirebaseHelper){
        super();
        this.entrancesmeatService = new EntrancesMeatService();
    }

    async createEntrancesMeat(req:Request,res:Response){
        try{
            await this.entrancesmeatService.saveEntrancesMeat(req.body);
            return res.status(201).send();
        }catch(err){
            return res.status(400).send(this.parser(err.message,res));
        }
    }
}


