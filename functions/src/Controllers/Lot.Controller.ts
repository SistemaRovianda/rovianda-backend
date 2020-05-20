import {Request,Response} from 'express';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { Cooling } from '../Models/Entity/Cooling';
import { OutputsDrief } from '../Models/Entity/Outputs.Drief';
import { OutputsPacking } from '../Models/Entity/Outputs.Packing';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
import { WarehousePacking } from '../Models/Entity/Warehouse.Packing';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { OutputsCoolingService } from '../Services/Outputs.Cooling.Service';
import { OutputsPackingService } from '../Services/Outputs.Packing.Service';
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
        if(!(status==LOTESTATUS.OPENED || status ==LOTESTATUS.CLOSED)) throw new Error("[400], status parameter value is invalid");
        let response = null;
        if(TYPE.FRIDGE == type){
            let coolingStatus:Cooling[] = await this.coolingService.getCoollingByStatus(status);
            response = coolingStatus.map((record:Cooling)=>{return {loteId:record.loteInterno,name: record.rawMaterial}})
        }
        if(TYPE.DRIEF == type){
            let wareHouseDriefStatus:WarehouseDrief[] = await this.warehouseDriefService.getWarehouseDriefRepositoryByStatus(status);
            response = wareHouseDriefStatus.map((record:WarehouseDrief)=>{
                return {loteId:record.loteProveedor,name:record.product.description}
            })
        }
        if(TYPE.PACKING == type){
            let wareHousePackingStatus:WarehousePacking[] = await this.warehousePackingService.getWarehousePackingByStatus(status);
            response= wareHousePackingStatus.map((record:WarehousePacking)=>{
                return {loteId:record.loteProveedor,name:record.product.description}
            })
        }
        return res.status(200).send(response);
    }

    async getOutputIngredients(req: Request, res: Response){
        let ingredients = await this.outputsDriefServices.getOutputIngredients();
        return res.status(200).send(ingredients);
    }
}