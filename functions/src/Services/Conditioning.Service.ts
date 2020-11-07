import { ConditioningRepository } from '../Repositories/Conditioning.Repository';
import { Conditioning } from '../Models/Entity/Conditioning';
import { conditioningDetails, ConditioningDTO } from '../Models/DTO/ConditioningDTO';
import { Process } from '../Models/Entity/Process';
import { ProcessRepository } from '../Repositories/Process.Repository';

import { ProductRepository } from '../Repositories/Product.Repository';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';

import { OutputsCoolingService } from './Outputs.Cooling.Service';
import { FormulationService } from './Formulation.Service';
import { Formulation } from '../Models/Entity/Formulation';
import { FormulationRepository } from '../Repositories/Formulation.Repository';
import { ProcessService } from './Process.Service';
import { ProcessStatus } from '../Models/Enum/ProcessStatus';
import { Defrost } from '../Models/Entity/Defrost';
import { DefrostRepository } from '../Repositories/Defrost.Repository';
import { DefrostFormulationRepository } from '../Repositories/DefrostFormulation.Repository';
import { DefrostFormulation } from '../Models/Entity/Defrost.Formulation';


export class ConditioningService{
    private conditioningRepository:ConditioningRepository;
    private processRepository:ProcessRepository;
    private defrostFormulationRepository:DefrostFormulationRepository;
    private formulationService:FormulationService;
    private formulationRepository:FormulationRepository;
    
    constructor(){
        this.conditioningRepository = new ConditioningRepository();
        this.processRepository = new ProcessRepository();
        this.defrostFormulationRepository = new DefrostFormulationRepository();
        this.formulationService = new FormulationService();
        this.formulationRepository = new FormulationRepository();
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
    async createConditioningByFormulationId(conditioningsDTO:Array<ConditioningDTO>, formulationId:number){
        let formulation:Formulation = await this.formulationRepository.getByFormulationId(formulationId);
        if(!formulation) throw new Error("[404], formulation record does not exist");
        let process:Process;
        if(formulation.process){
            process = formulation.process;
            if(process.conditioning && !process.conditioning.length){
                process.conditioning = new Array();
            }
        }else{
            process = await this.createProcessInter();
            process.formulation = formulation;
            process.product = formulation.productRovianda;
            if(formulation.status=="TAKED") throw new Error("[400], formulacion ya asignada");
            formulation.status="TAKED";
            process.conditioning=new Array();
            await this.formulationRepository.saveFormulation(formulation);
        }
    
    for(let conditioningDTO of conditioningsDTO ){
        if (conditioningDTO.bone == null)  throw new Error("[400],bone is required");
        if (conditioningDTO.clean == null)  throw new Error("[400],clean is required");
        if (conditioningDTO.healthing == null)  throw new Error("[400],healthing is required");
        if (!conditioningDTO.weight)  throw new Error("[400],weight is required");
        if (conditioningDTO.weight<1) throw new Error("[400],el peso no puede ser menor a 1");
        if (!conditioningDTO.temperature)  throw new Error("[400],temperature is required");
        if (!conditioningDTO.date)  throw new Error("[400],date is required");
        
    
    
    let defrostFormulation:DefrostFormulation = await this.defrostFormulationRepository.getDefrostFormulation(conditioningDTO.defrostId);
    let conditioning :Conditioning = new Conditioning();
    conditioning.raw = defrostFormulation.defrost.outputCooling.rawMaterial.rawMaterial;
    conditioning.bone = conditioningDTO.bone;
    conditioning.clean = conditioningDTO.clean;
    conditioning.healthing = conditioningDTO.healthing;
    conditioning.weight = conditioningDTO.weight;
    conditioning.temperature = conditioningDTO.temperature;
    conditioning.date = conditioningDTO.date;
    conditioning.lotId  = defrostFormulation.defrost.outputCooling.loteInterno;
            process.currentProcess = "Acondicionamiento ";
            if(process.conditioning && process.conditioning.length){
                process.conditioning.push(conditioning);
            }else{
                process.conditioning = [conditioning];
            }        
        }
        await this.processRepository.createProcess(process);    
    }


    async getConditioningById(conditioning_id:number){
        return await this.conditioningRepository.getConditioningById(conditioning_id);
    }

    async getConditioning(processId:string){
        let process:Process = await this.processRepository.findConditioningByProcessId(+processId);
        console.log(process)
        if(!process) throw new Error("[404], no existe el proceso");
        let response:Array<conditioningDetails> = new Array();
        if(process.conditioning && process.conditioning.length){
        for(let conditioning of process.conditioning){
            response.push({
                conditioningId: conditioning.id,
                lotId: conditioning.lotId,
                bone: conditioning.bone,
                clean: conditioning.clean,
                date: conditioning.date,
                healthing: conditioning.healthing,
                rawMaterial: conditioning.raw,
                temperature: conditioning.temperature,
                weight: conditioning.weight,
                formulation:{
                 id:  process.formulation.id,
                 lotDay: process.formulation.lotDay
                }
            });
        }}
        
        return response;
    }

    async getConditioningByProcessId(id:number){
        return await this.conditioningRepository.getConditioningById(id);
    }
}