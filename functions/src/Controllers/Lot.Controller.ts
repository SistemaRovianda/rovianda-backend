import {Request,Response} from 'express';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { Cooling } from '../Models/Entity/Cooling';
import { OutputsDrief } from '../Models/Entity/Outputs.Drief';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { OutputsCoolingService } from '../Services/Outputs.Cooling.Service';
import { CoolingService } from '../Services/Cooling.Service';
import { OutputsDriefService } from '../Services/Outputs.Drief.Service';
import { WarehouseDriefService } from '../Services/Warehouse.Drief.Service';
import { TYPE } from '../Models/Enum/Type.Lot';
export class LotController{

    private outputsCoolingService:OutputsCoolingService;
    private coolingService:CoolingService;
    private outputsDriefService:OutputsDriefService;
    private warehouseDriefService:WarehouseDriefService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.outputsCoolingService = new OutputsCoolingService();
        this.coolingService = new CoolingService();
        this.outputsDriefService = new OutputsDriefService();
        this.warehouseDriefService = new WarehouseDriefService();
    }

    async getAllOutputsCooling(req:Request,res:Response){
        let {type,status} = req.query;
        let response:any = [];
        if(TYPE.FRIDGE == type){
            let coolingStatus:Cooling[] = await this.coolingService.getCoollingByStatus(status);
            for (let i = 0; i<coolingStatus.length; i++) {
                let outputCoolling:OutputsCooling = await this.outputsCoolingService.getOutputsCoolingByLot(coolingStatus[i].lote_interno);
                if(outputCoolling){
                    response.push({
                        lote: outputCoolling.lote_interno
                    });
                }
            }
        }
        if(TYPE.DRIEF == type){
            let wareHouseDriefStatus:WarehouseDrief[] = await this.warehouseDriefService.getWarehouseDriefRepositoryByStatus(status);
            for (let i = 0; i<wareHouseDriefStatus.length; i++) {
                let outputDrief:OutputsDrief = await this.outputsDriefService.getOutputsDriefByLot(wareHouseDriefStatus[i].lote_proveedor);
                if(outputDrief){
                    response.push({
                        lote: outputDrief.lote_proveedor
                    });
                }
            }
        }
        return res.status(200).send(response);
    }

}