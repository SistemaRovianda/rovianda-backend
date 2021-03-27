import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { EntranceMeatService } from '../Services/Entrances.Meat.Services';
import { CoolingService } from '../Services/Cooling.Service';
import { OutputsCoolingService } from '../Services/Outputs.Cooling.Service';
import { EntranceDriefService } from '../Services/Entrance.Drief.Service';

export class EntrancesMeatController{

    private entrancesmeatService:EntranceMeatService;
    private coolingMeat:CoolingService;
    private outputCoolingService:OutputsCoolingService;
    private entrancedriefService:EntranceDriefService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.outputCoolingService = new OutputsCoolingService();
        this.entrancesmeatService = new EntranceMeatService(this.firebaseInstance);
        this.entrancedriefService = new EntranceDriefService(this.firebaseInstance);
        this.coolingMeat = new CoolingService();
    }


    async getAllEntrancesOfmeat(req:Request,res:Response){
        let lotId:string = req.params.loteId;
        let date:string = req.query.date;
        let page = +req.query.page;
        let peerPage = +req.query.peePage;
        return res.status(200).send(await this.entrancesmeatService.getEntracencesByLoteId(lotId,date,page,peerPage));
    }

    async  getAllEntrancesOfDrief(req:Request,res:Response){
        let lotId:string = req.params.loteId;
        let date:string = req.query.date;
        let page = +req.query.page;
        let peerPage = +req.query.peePage;
        return res.status(200).send(await this.entrancedriefService.getEntranceByLoteId(lotId,date,page,peerPage));
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
        let colling = await this.coolingMeat.getCollingByLotInterno(req.params.lotId,+req.query.fridgeId);
        return res.status(200).send(colling);
    }

    async getOutputsCoolingByStatus(req:Request,res:Response){
        let outputsCooling = await this.outputCoolingService.getOutputsCoolingByStatus(req.query.status);
        return res.status(200).send(outputsCooling);
    }

    async getLotMeat(req:Request,res:Response){
        let response = await this.outputCoolingService.getLotMeat();
        return res.status(200).send(response)
    }

    async getHistoryMeatEntrance(req:Request,res:Response){
        let dateStart = req.query.dateStart;
        let dateEnd = req.query.dateEnd;
        let response = await this.entrancesmeatService.getHistoryMeatEntrance(+req.params.entranceId,dateStart,dateEnd);
        return res.status(200).send(response)
    }

    async getHistoryMeatCooling(req:Request,res:Response){
        let dateStart = req.query.dateStart;
        let dateEnd = req.query.dateEnd;
        let response = await this.entrancesmeatService.getHistoryMeatCooling(+req.params.entranceId,dateStart,dateEnd);
        
        return res.status(200).send(response)
    }

    async getHistoryOutputCooling(req:Request,res:Response){
        let dateStart = req.query.dateStart;
        let dateEnd = req.query.dateEnd;
        let response = await this.entrancesmeatService.getHistoryOutputCooling(+req.params.entranceId,dateStart,dateEnd);
        
        return res.status(200).send(response)
    }

    async getHistoryByOutputsFormulations(req:Request,res:Response){
        let outputs:number[]= req.body.outputsCooling;
        let response = await this.entrancesmeatService.getHistoryByOutputsFormulations(outputs);
        
        return res.status(200).send(response)
    }

    async getHistoryByOutputsProcess(req:Request,res:Response){
        let formulationsIds:number[]= req.body.formulationsIds;
        let response = await this.entrancesmeatService.getHistoryByOutputsProcess(formulationsIds);
        
        return res.status(200).send(response)
    }

    async getHistoryByOutputsOvenByProcessId(req:Request,res:Response){
        let processIds:number[]= req.body.processIds;
        let response = await this.entrancesmeatService.getHistoryByOutputsOvenByProcessId(processIds);
        
        return res.status(200).send(response)
    }

    async getHistoryByOutputsPackagingByOvenIds(req:Request,res:Response){
        let ovenProductsIds:number[]= req.body.ovenProductsIds;
        let response = await this.entrancesmeatService.getHistoryByOutputsPackagingByOvenIds(ovenProductsIds);
        
        return res.status(200).send(response)
    }

    async getHistoryByDevolutionsByOvenByOvenIds(req:Request,res:Response){
        let ovenProductsIds:number[]= req.body.ovenProductsIds;
        let response = await this.entrancesmeatService.getHistoryByDevolutionsByOvenByOvenIds(ovenProductsIds);
        
        return res.status(200).send(response)
    }

    async getHistoryByReprocesingsByOvenByOvenIds(req:Request,res:Response){
        let ovenProductsIds:number[]= req.body.ovenProductsIds;
        let response = await this.entrancesmeatService.getHistoryByDevolutionsByOvenByOvenIds(ovenProductsIds);
        
        return res.status(200).send(response)
    }

    async getHistoryByInspectionByOvenByOvenIds(req:Request,res:Response){
        let ovenProductsIds:number[]= req.body.ovenProductsIds;
        let response = await this.entrancesmeatService.getHistoryByInspectionByOvenByOvenIds(ovenProductsIds);
        
        return res.status(200).send(response)
    }
    

}


