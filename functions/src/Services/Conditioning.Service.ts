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


export class ConditioningService{
    private conditioningRepository:ConditioningRepository;
    private processRepository:ProcessRepository;
    private defrostRepository:DefrostRepository;
    private formulationService:FormulationService;
    private formulationRepository:FormulationRepository;
    
    constructor(){
        this.conditioningRepository = new ConditioningRepository();
        this.processRepository = new ProcessRepository();
        this.defrostRepository = new DefrostRepository();
        this.formulationService = new FormulationService();
        this.formulationRepository = new FormulationRepository();
    }
    async createProcessInter():Promise<Process>{
        let process:Process = new Process();
        let today = new Date();
        today.setHours(today.getHours()-5)
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
    async createConditioningByProcessId(conditioningsDTO:Array<ConditioningDTO>, formulationId:number){
    for(let conditioningDTO of conditioningsDTO ){
        if (conditioningDTO.bone == null)  throw new Error("[400],bone is required");
        if (conditioningDTO.clean == null)  throw new Error("[400],clean is required");
        if (conditioningDTO.healthing == null)  throw new Error("[400],healthing is required");
        if (!conditioningDTO.weight)  throw new Error("[400],weight is required");
        if (conditioningDTO.weight<1) throw new Error("[400],el peso no puede ser menor a 1");
        if (!conditioningDTO.temperature)  throw new Error("[400],temperature is required");
        if (!conditioningDTO.date)  throw new Error("[400],date is required");
        let formulation:Formulation = await this.formulationRepository.getByFormulationId(formulationId);
        if(!formulation) throw new Error("[404], formulation record does not exist");
        let process:Process;
        if(formulation.process){
            process = formulation.process;
        }else{
            process = await this.createProcessInter();
            process.formulation = formulation;
        }
    
    if(!formulation) throw new Error("[400], no existe esa formulación");
    if(formulation.status=="TAKED") throw new Error("[400], formulacion ya asignada");
    formulation.status="TAKED";
    let defrost:Defrost = await this.defrostRepository.getDefrostById(conditioningDTO.defrostId);
    let conditioning :Conditioning = new Conditioning();
    conditioning.raw = defrost.outputCooling.rawMaterial.rawMaterial;
    conditioning.bone = conditioningDTO.bone;
    conditioning.clean = conditioningDTO.clean;
    conditioning.healthing = conditioningDTO.healthing;
    conditioning.weight = conditioningDTO.weight;
    conditioning.temperature = conditioningDTO.temperature;
    conditioning.productId = formulation.productRovianda;
    conditioning.date = conditioningDTO.date;
    conditioning.lotId  = defrost.outputCooling.loteInterno
            await this.formulationService.updateFormulation(formulation);
            process.currentProcess = "Acondicionamiento ";
            if(process.conditioning && process.conditioning.length){
                process.conditioning.push(conditioning);
            }else{
                process.conditioning = [conditioning];
            }
            return await this.processRepository.createProcess(process);    
        }
    }


    async getConditioningById(conditioning_id:number){
        return await this.conditioningRepository.getConditioningById(conditioning_id);
    }

    async getConditioning(processId:string){
    
        if (!processId) throw new Error("[400], processId in path is required");
        let process:Process = await this.processRepository.findProcessById(+processId)
        if(!process)throw new Error("[404], No existe proceso");
        console.log(process);
       
        let conditioning:Process = await this.processRepository.findConditioningByProcessId(+processId);
        console.log(conditioning)
        if(conditioning.conditioning==null) throw new Error("[404], no existe acondicionamiento relacionado a este proceso");
        

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
                product:{
                    id: conditioning.productId.id,
                    description: conditioning.productId.name
                }
                
            });
        }}
        
        return response;
    }

    async getConditioningByProcessId(id:number){
        return await this.conditioningRepository.getConditioningById(id);
    }
}