import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { CoolingService } from '../Services/Cooling.Service';
import { OutputsDriefService } from '../Services/Outputs.Drief.Service';
import { WarehouseDriefService } from '../Services/Warehouse.Drief.Service';
import { WarehousePackingService } from '../Services/Warehouse.Packing.Service';
import { TYPE, LOTESTATUS } from '../Models/Enum/Type.Lot';
export class LotController{

    
    private coolingService:CoolingService;
    private outputsDriefServices: OutputsDriefService;
    private warehouseDriefService:WarehouseDriefService;
    private warehousePackingService:WarehousePackingService
    constructor(private firebaseInstance:FirebaseHelper){
        this.coolingService = new CoolingService();
        this.outputsDriefServices = new OutputsDriefService();
        this.warehouseDriefService = new WarehouseDriefService();
        this.warehousePackingService = new WarehousePackingService();
    }

    async getAllLots(req:Request,res:Response){
        let {type,status} = req.query;
        if(!(status==LOTESTATUS.OPENED || status ==LOTESTATUS.CLOSED || status==LOTESTATUS.PENDING)) throw new Error("[400], status parameter value is invalid");
        let response = null;
        if(TYPE.DRIEF == type){
            let wareHouseDriefStatus = await this.warehouseDriefService.getWarehouseDriefRepositoryByStatus(status);
            response = wareHouseDriefStatus;
        }
        if(TYPE.PACKING == type){
            let wareHousePackingStatus = await this.warehousePackingService.getWarehousePackingByStatus(status);
            response= wareHousePackingStatus;
        }
        return res.status(200).send(response);
    }

    async getOutputIngredients(req: Request, res: Response){
        let ingredients = await this.outputsDriefServices.getOutputIngredients();
        return res.status(200).send(ingredients);
    }

    async getIngredientsLots(req: Request, res: Response){
        let lots:[]= req.body.lotsId;
        let ingredients = await this.outputsDriefServices.getIngredients(lots);
        return res.status(200).send(ingredients);
    }

    async getPackingHistory(req: Request, res: Response){
        let response = await this.warehousePackingService.getPackingHistory(req);
        return res.status(200).send(response);
    }  
    
    async getDriefHistory(req: Request, res: Response){
        let response = await this.warehouseDriefService.getDriefHistory(req.params.lotId);
        return res.status(200).send(response);
    }

}