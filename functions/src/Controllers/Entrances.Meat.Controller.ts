import {Request,Response} from 'express';
import { ErrorHandler } from '../Utils/Error.Handler';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { EntranceMeatService } from '../Services/Entrances.Meat.Services';
import { CoolingService } from '../Services/Cooling.Service';
import { OutputsCoolingService } from '../Services/Outputs.Cooling.Service';

export class EntrancesMeatController{

    private entrancesmeatService:EntranceMeatService;
    private coolingMeat:CoolingService;
    private outputCoolingService:OutputsCoolingService;
    constructor(private firebaseInstance:FirebaseHelper){
        
        this.entrancesmeatService = new EntranceMeatService(this.firebaseInstance);
        this.coolingMeat = new CoolingService();
    }

    async createEntrancesMeat(req:Request,res:Response){       
        await this.entrancesmeatService.saveEntrancesMeat(req);
        return res.status(201).send();
    }

    async updateStatusWarehouse(req:Request,res:Response){
        await this.coolingMeat.updateStatus(req.body);
        return res.status(204).send();
    }

    async createOutputsCooling(req:Request,res:Response){
        await this.outputCoolingService.createOutputsCooling(req.body);
        return res.status(201).send();
    }

}


