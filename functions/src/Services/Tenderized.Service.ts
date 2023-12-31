import { TenderizedRepository } from '../Repositories/Tenderized.Repository';
import { Tenderized } from '../Models/Entity/Tenderized';
import { TenderizedDetails, TenderizedDTO } from '../Models/DTO/TenderizedDTO';
import { Product } from '../Models/Entity/Product';
import { ProductRepository } from '../Repositories/Product.Repository';
import { Process } from '../Models/Entity/Process';
import { ProcessRepository } from '../Repositories/Process.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { ProcessStatus } from '../Models/Enum/ProcessStatus';
import { Formulation } from '../Models/Entity/Formulation';
import { FormulationRepository } from '../Repositories/Formulation.Repository';
import { DefrostFormulation } from '../Models/Entity/Defrost.Formulation';
import { DefrostFormulationRepository } from '../Repositories/DefrostFormulation.Repository';
import { Defrost } from '../Models/Entity/Defrost';
import { DefrostRepository } from '../Repositories/Defrost.Repository';


export class TenderizedService{
    private tenderizedRepository : TenderizedRepository;
    private productRepository : ProductRepository;
    private processRepository :ProcessRepository;
    private productRoviandaRepository: ProductRoviandaRepository;
    private formulationRepository:FormulationRepository;
    private defrostFormulationRepository:DefrostFormulationRepository;
    private defrostRepository:DefrostRepository;
    constructor(){
        this.tenderizedRepository = new TenderizedRepository();
        this.productRepository = new ProductRepository();
        this.processRepository = new ProcessRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.formulationRepository = new FormulationRepository();
        this.defrostFormulationRepository = new DefrostFormulationRepository();
        this.defrostRepository = new DefrostRepository();
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
    
    async createTenderized(tenderizedDTO:Array<TenderizedDTO>, formulationId:number){
        let formulation:Formulation = await this.formulationRepository.getByFormulationId(formulationId);
        if(!formulation) throw new Error("[404], no existe la formulacion");
        
        let process:Process=null;
        if(formulation.process){
            process = formulation.process;
            if(!process.tenderized){
            process.tenderized = new Array<Tenderized>();
            }
        }else{
            process = await this.createProcessInter();
            process.tenderized = new Array<Tenderized>();
            process.product = formulation.productRovianda;
            process.formulation=formulation;
            if(formulation.status=="TAKED") throw new Error("[404], la salida de formulacion ya fue tomada");
            formulation.status ="TAKED";
            await this.formulationRepository.saveFormulation(formulation);
        }
        process.typeProcess = formulation.typeFormulation;
        if(formulation.ingredientsIds!=null){
            process.ingredientsIds=formulation.ingredientsIds;
        }
        for(let tenderizedDto of tenderizedDTO){
            if(!tenderizedDto.date) throw new Error("[400], falta el parametro date");
            if(!tenderizedDto.percentage) throw new Error("[400], falta el parametro percentage");
            if(!tenderizedDto.temperature) throw new Error("[400], falta el parametro temperature");
            if(!tenderizedDto.weight) throw new Error("[400], falta el parametro weight");
            if(!tenderizedDto.weightSalmuera) throw new Error("[400], falta el parametro weightSalmuera");
            if(!tenderizedDto.defrostId) throw new Error("[400], falta el parametro defrostId");
            if(!tenderizedDto.lotId) throw new Error("[400], falta el parametro lotId");
            let tenderizedToSave:Tenderized = new Tenderized();
            let defrostFormulation:DefrostFormulation = await this.defrostFormulationRepository.getDefrostFormulation(tenderizedDto.defrostId);
            let defrost:Defrost = await this.defrostRepository.getDefrostById(defrostFormulation.defrost.defrostId);
            defrostFormulation.defrost=defrost;
            tenderizedToSave.date = tenderizedDto.date;
            tenderizedToSave.loteMeat = defrostFormulation.defrost.outputCooling.loteInterno;
            tenderizedToSave.percentInject = tenderizedDto.percentage;
            tenderizedToSave.raw = defrostFormulation.defrost.outputCooling.rawMaterial.rawMaterial;
            tenderizedToSave.temperature = tenderizedDto.temperature;
            tenderizedToSave.weight = tenderizedDto.weight;
            tenderizedToSave.weightSalmuera = tenderizedDto.weightSalmuera;
            process.tenderized.push(tenderizedToSave);
        }
        
        formulation.status="TAKED";
    
        process.currentProcess = "Inyecion-Tenderizado";
        await this.formulationRepository.saveFormulation(formulation);
        return await this.processRepository.saveProcess(process);
    }
    
    async getTenderizedById(id:number){
        return await this.tenderizedRepository.getTenderizedById(id);
    }

    async getProductTenderized(processid:number){
        return await this.tenderizedRepository.getProductTenderized(processid);
    }

    async getTenderized(processId:string){
    
        if (!processId) throw new Error("[400], processId in path is required");
        let process:Process = await this.processRepository.findProcessById(+processId)
        if(!process)throw new Error("[404], No existe proceso");
        let response:Array<TenderizedDetails> = new Array();
        if(process.tenderized && process.tenderized.length){
        for(let tenderized of process.tenderized){
            response.push({
                tenderizedId: tenderized.id,
                lotId: tenderized.loteMeat,
                temperature: tenderized.temperature,
                weight: tenderized.weight,
                weightSalmuera: tenderized.weightSalmuera,
                percentage: tenderized.percentInject,
                date: tenderized.date,
                rawMaterial:tenderized.raw,
                formulation: process.formulation.lotDay
            });
            }
        }
        return response;
    
    }

    async getTenderizedByProcessId(id:number){
        return await this.tenderizedRepository.getTenderizedById(id);
    }
}