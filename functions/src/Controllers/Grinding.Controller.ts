import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Process } from '../Models/Entity/Process';
import { Grinding } from '../Models/Entity/Grinding';
import { ProcessService } from '../Services/Process.Service';
import { GrindingService } from '../Services/Grinding.Service';
import { ProcessRepository } from '../Repositories/Process.Repository';

export class GrindingController{

    private processService:ProcessService;
    private grindingService:GrindingService;

    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService();
        this.grindingService = new GrindingService();
    }

    async createGrinding(req:Request,res:Response){
        let {rawMaterial,process,weight,date} = req.body;
        let processId = req.params.processId;
        if (!rawMaterial) return res.status(400).send({ msg: 'rawMaterial is required'});
        if (!process) return res.status(400).send({ msg: 'process is required'});
        if (!weight) return res.status(400).send({ msg: 'weight is required'});
        if (!date) return res.status(400).send({ msg: 'date is required'});
        if (!processId) return res.status(400).send({ msg: 'processId is required'});
        let grinding = new Grinding();
        try{
            let processObj:Process = await this.processService.getProcessById(+processId);
            if(processObj){
                grinding.process = process;
                grinding.date = date;
                grinding.raw = rawMaterial;
                grinding.weight = weight;
                await this.grindingService.saveGrinding(grinding);
                let objGrinding:Grinding = await this.grindingService.getLastGrinding();
                processObj.grindingId = objGrinding[0];
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