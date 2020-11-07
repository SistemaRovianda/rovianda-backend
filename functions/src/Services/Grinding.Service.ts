import { GrindingRepository } from "../Repositories/Grinding.Repository";
import { Grinding } from "../Models/Entity/Grinding";
import { Request } from "express";
import { Process } from "../Models/Entity/Process";
import { ProcessRepository } from "../Repositories/Process.Repository";
import { GrindingForm } from "../Models/DTO/GrindingForm";
import { Formulation } from "../Models/Entity/Formulation";
import { FormulationRepository } from "../Repositories/Formulation.Repository";
import { ProcessStatus } from "../Models/Enum/ProcessStatus";
import { Raw } from "../Models/Entity/Raw";
import { RawRepository } from "../Repositories/Raw.Repository";
import { DefrostRepository } from "../Repositories/Defrost.Repository";
import { Defrost } from "../Models/Entity/Defrost";
import { DefrostFormulation } from "../Models/Entity/Defrost.Formulation";
import { DefrostFormulationRepository } from "../Repositories/DefrostFormulation.Repository";

export class GrindingService{
    private grindingRepository:GrindingRepository;
    private processRepository: ProcessRepository;
    private formulationRepository:FormulationRepository;
    private rawRepository:RawRepository;
    private defrostFormulationRepository:DefrostFormulationRepository;
    constructor(){
        this.grindingRepository = new GrindingRepository();
        this.processRepository = new ProcessRepository();
        this.formulationRepository = new FormulationRepository();
        this.rawRepository = new RawRepository();
        this.defrostFormulationRepository = new DefrostFormulationRepository();
    }

    async createProcessInter():Promise<Process>{
        let process:Process = new Process();
        let today = new Date();
        today.setHours(today.getHours()-6)
        let dd:any = today.getDate();
        let mm:any = today.getMonth()+1; 
        let yyyy:any = today.getFullYear();
        if(dd<10) { dd='0'+dd; } 
        if(mm<10) { mm='0'+mm; }
        let date = `${yyyy}-${mm}-${dd}`;
        process.status = ProcessStatus.ACTIVE;
        process.createAt = date;
        return await this.processRepository.saveProcess(process);
    }

    async getGrindingById(id:number){
        return await this.grindingRepository.getGrindingById(id);
    }

    async createGrinding(formulationId:number,grindingsForm:Array<GrindingForm>){
        let formulation:Formulation = await this.formulationRepository.getByFormulationIdAndProcess(formulationId);
        if(!formulation) throw new Error("[404],no existe la formulacion indicada");
        let processObj:Process = null;
        if(!formulation.process){
            processObj = await this.createProcessInter();
            processObj.formulation = formulation;
            processObj.grinding = new Array<Grinding>();
            if(formulation.status=="TAKED") throw new Error("[409], formulation already taked");
            formulation.status="TAKED";
            await this.formulationRepository.saveFormulation(formulation);
        }else{
            processObj = formulation.process;
            if(!processObj.grinding){
                processObj.grinding = new Array<Grinding>();
            }
        }
        
        for(let grindingForm of grindingsForm){
            if (!grindingForm.process) throw new Error('[400],process is required');
            if (!grindingForm.weight) throw new Error('[400],weight is required');
            if (!grindingForm.date) throw new Error('[400],date is required');
            if (!grindingForm.defrostId) throw new Error('[400],defrost is required');

        
        
        
        processObj.product = formulation.productRovianda;
        let defrostFormulation:DefrostFormulation = await this.defrostFormulationRepository.getDefrostFormulation(grindingForm.defrostId);
        
            let grinding = new Grinding();
            grinding.singleProcess=grindingForm.process;
            grinding.date = grindingForm.date;
            grinding.raw = defrostFormulation.defrost.outputCooling.rawMaterial;
            grinding.weight = grindingForm.weight;
            grinding.lotId = defrostFormulation.defrost.outputCooling.loteInterno;
            
            processObj.grinding.push(grinding);
            
        }
        processObj.currentProcess = "Molienda";
        await this.processRepository.saveProcess(processObj);
        
    }

    async getGrindingByProcessId(req: Request){
        let id = req.params.processId;
        let process: Process = await this.processRepository.getProcessWithGrindingById(+id);
        let response = new Array();

        
        if(process.grinding.length){
            for(let grinding of process.grinding){
                let grindingEntity:Grinding = await this.grindingRepository.getGrindingWithRaw(grinding.id);
                response = process.grinding.map((x)=> {
                    return {
                    process: x.singleProcess,
                    weight: x.weight,
                    date: x.date,
                    rawMaterial: grindingEntity.raw.rawMaterial,
                    formulation: process.formulation.lotDay
                }
                });
            }
           
        }
        return response;
    
    }

    async saveGrinding(grinding:Grinding){
        return await this.grindingRepository.saveGrinding(grinding);
    }

    async getLastGrinding(){
        return await this.grindingRepository.getLastGrinding();
    }
    
}