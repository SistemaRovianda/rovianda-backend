import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Process } from '../Models/Entity/Process';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { Grinding } from '../Models/Entity/Grinding';
import { ProcessService } from '../Services/Process.Service';
import { ProductRoviandaService } from '../Services/Product.Rovianda.Service';
import { GrindingService } from '../Services/Grinding.Service';
import { ProcessRepository } from '../Repositories/Process.Repository';
import { FormulationService } from '../Services/Formulation.Service';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { OutputsCoolingService } from '../Services/Outputs.Cooling.Service';



export class GrindingController{

    private processService:ProcessService;
    private grindingService:GrindingService;
    private productRoviandaService:ProductRoviandaService;
    private formulationService:FormulationService;
    private outputsCoolingService:OutputsCoolingService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService(this.firebaseInstance);
        this.grindingService = new GrindingService();
        this.productRoviandaService = new ProductRoviandaService(this.firebaseInstance);
        this.formulationService = new FormulationService();
        this.outputsCoolingService = new OutputsCoolingService();
    }

    async createGrinding(req:Request,res:Response){
        let formulationId:number = +req.params.formulationId;
        await this.grindingService.createGrinding(formulationId,req.body);
        return  res.status(200).send();
    }
}