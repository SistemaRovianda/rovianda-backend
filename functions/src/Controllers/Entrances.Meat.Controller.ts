import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { EntranceMeatService } from '../Services/Entrances.Meat.Services';
import { CoolingService } from '../Services/Cooling.Service';
import { OutputsCoolingService } from '../Services/Outputs.Cooling.Service';

export class EntrancesMeatController{

    private entrancesmeatService:EntranceMeatService;
    private coolingMeat:CoolingService;
    private outputCoolingService:OutputsCoolingService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.outputCoolingService = new OutputsCoolingService();
        this.entrancesmeatService = new EntranceMeatService(this.firebaseInstance);
        this.coolingMeat = new CoolingService();
    }

    async createEntrancesMeat(req:Request,res:Response){       
        let id = await this.entrancesmeatService.saveEntrancesMeat(req);
        return res.status(201).send({meatId: id});
    }

    async updateStatusWarehouse(req:Request,res:Response){
        await this.coolingMeat.updateStatus(req.body);
        return res.status(204).send();
    }

    async createOutputsCooling(req:Request,res:Response){
        await this.outputCoolingService.createOutputsCooling(req.body);
        return res.status(201).send();
    }

    async getCoollingByFridge(req:Request,res:Response){
        let coolling = await this.coolingMeat.getCoollingByFridge(+req.params.fridgeId,req.query.status);
        return res.status(200).send(coolling);
    }

    async getCollingByLotInterno(req:Request,res:Response){
        let colling = await this.coolingMeat.getCollingByLotInterno(req.params.lotId);
        return res.status(200).send(colling);
    }

    async getOutputsCoolingByStatus(req:Request,res:Response){
        //query rawMaterialId
        let outputsCooling = await this.outputCoolingService.getOutputsCoolingByStatus(req.query.status, +req.query.rawMaterialId);
        return res.status(200).send(outputsCooling);
    }
}


