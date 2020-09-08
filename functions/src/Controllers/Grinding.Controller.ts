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
        let {rawMaterial,process,weight,date,productId,loteMeat} = req.body;
        let processId = req.params.processId;
        if (!rawMaterial) return res.status(400).send({ msg: 'rawMaterial is required'});
        if (!process) return res.status(400).send({ msg: 'process is required'});
        if (!weight) return res.status(400).send({ msg: 'weight is required'});
        if (!date) return res.status(400).send({ msg: 'date is required'});
        if (!processId) return res.status(400).send({ msg: 'processId is required'});
        if (!loteMeat) return res.status(400).send({ msg: 'loteMeat is required'});
        let product:ProductRovianda = await this.productRoviandaService.getById(+productId);
        if (!product) return res.status(404).send({ msg: 'Product Rovianda Not found'});
        
        try{
            let processObj:Process = await this.processService.getProcessWithGrindingById(+processId);
            if(processObj.grindingId) throw new Error("[409],El proceso ya tiene molienda registrado");
            if(processObj){

                let formulationObj=await this.formulationService.getFormulationOutputCoolingId(loteMeat);
                if(!formulationObj) return res.status(404).send({ msg: 'No existe la salida de carne en formulacion'});
                formulationObj.status="TAKED";
                await this.formulationService.updateFormulation(formulationObj);
                processObj.product = product;
                let grinding = new Grinding();
                grinding.process = process;
                grinding.date = date;
                grinding.raw = rawMaterial;
                grinding.weight = weight;
                grinding.product = product;

                

                let objGrinding:Grinding = await this.grindingService.saveGrinding(grinding);
                
                if(!processObj.loteInterno){ processObj.loteInterno = formulationObj.loteInterno; }
                if(!processObj.outputLotRecordId){
                    processObj.outputLotRecordId = loteMeat;
                    let outputCooling:OutputsCooling = await this.outputsCoolingService.getOutputsCoolingById(loteMeat);
                    outputCooling.status="TAKED";
                    await this.outputsCoolingService.updateOutputCooling(outputCooling);
                }
                processObj.grindingId = objGrinding;
                
                if(!processObj.product){
                    processObj.product = product;
                }
                processObj.currentProcess = "Molienda";
                await this.processService.updateProcessProperties(processObj);
                return res.status(201).send();
            }else{
                return res.status(404).send({msg: "Process not found"});
            }
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    }
}