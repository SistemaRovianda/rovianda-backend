import { SausagedRepository } from "../Repositories/Sausaged.Repository";
import { ProcessRepository } from "../Repositories/Process.Repository";
import { ProductRepository } from "../Repositories/Product.Repository";
import { Sausaged } from "../Models/Entity/Sausaged";
import { Process } from "../Models/Entity/Process";
import { Product } from "../Models/Entity/Product";
import { Request } from "express";
import { SausagedDTO,SausagedUpdateDTO } from "../Models/DTO/SausagedDTO";
import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { Formulation } from "../Models/Entity/Formulation";
import { FormulationRepository } from "../Repositories/Formulation.Repository";
import { ProcessStatus } from "../Models/Enum/ProcessStatus";
import { DefrostRepository } from "../Repositories/Defrost.Repository";
import { Defrost } from "../Models/Entity/Defrost";

export class SausagedService{
    private sausagedRepository:SausagedRepository;
    private processRepository:ProcessRepository;
    private productRepository:ProductRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    private formulationRepository:FormulationRepository;
    private defrostRepository:DefrostRepository;
    constructor(){
        this.sausagedRepository = new SausagedRepository();
        this.processRepository = new ProcessRepository();
        this.productRepository = new ProductRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.formulationRepository= new FormulationRepository();
        this.defrostRepository = new DefrostRepository();
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

    async saveSausaged(sausagedsDTO:Array<SausagedDTO>,formulationId:number){
        for(let sausagedDTO of sausagedsDTO){
            if(!sausagedDTO.temperature) throw new Error("[400], temperature is required");
            if(!sausagedDTO.date) throw new Error("[400], date is required");
            if(!sausagedDTO.defrostId) throw new Error("[400], defrostId is required");
            if(!sausagedDTO.time.hour) throw new Error("[400], hour1 is required");
            if(!sausagedDTO.time.weight) throw new Error("[400], weightInitial is required");
            let formulation:Formulation = await this.formulationRepository.getByFormulationId(formulationId);
            let process:Process =null;
            if(formulation.process){
                process = formulation.process;
            }else{
                process = await this.createProcessInter();
                process.formulation  = formulation;
            }
            let defrost:Defrost = await this.defrostRepository.getDefrostById(sausagedDTO.defrostId);
            let sausaged = new Sausaged();
            sausaged.date = sausagedDTO.date;
            sausaged.hour1 = sausagedDTO.time.hour;
            sausaged.temperature = sausagedDTO.temperature;
            sausaged.loteMeat = defrost.outputCooling.rawMaterial.rawMaterial;
            sausaged.weightIni = sausagedDTO.time.weight.toString();
            sausaged.productId = formulation.productRovianda;
            let objSausaged:Sausaged = await this.sausagedRepository.saveSausaged(sausaged);
            
            if(process.sausage.length){
                process.sausage.push(objSausaged);
            }else{
                process.sausage=[objSausaged];
            }

            process.currentProcess = "Embutido";
            await this.processRepository.saveProcess(process);
        }
        //return await this.sausagedRepository.saveSausaged(sausaged);
    }

    async getLastSausaged(){
        return await this.sausagedRepository.getLastSausaged();
    }

    // async getSausagedByProcess(processId:number){
    //     return await this.sausagedRepository.getSausagedByProcess(processId);
    // }
    
    async getSausagedByProcess(req:Request){
        if(!req.params.processId) throw new Error("[400], processId is required");
        let process:Process = await this.processRepository.getProcessWithSausagedById(+req.params.processId);
        if(!process) throw new Error("[404], process not found");
        console.log(process)
        let response:Array<any>=new Array<any>();
        for(let sausage of process.sausage){
            response.push( {
                sausagedId: `${sausage.id}`,
                product: {
                    id: `${sausage.productId ? sausage.productId.id : ""}`,
                    description: `${sausage.productId? sausage.productId.name : ""}`
                },
                temperature: `${sausage.temperature}`,
                date: `${sausage.date}`,
                time: {
                    hour1: `${sausage.hour1}`,
                    weightInitial: `${sausage.weightIni}`,
                    hour2: `${sausage.hour2}`,
                    weightMedium: `${sausage.weightMedium}`,
                    hour3: `${sausage.hour3}`,
                    weightFinal: `${sausage.weightExit}`
                },
                loteMeat: `${sausage.loteMeat}`
            });
        }
        
            
        return response;
    }

    async updateSausaged(sausagedUpdateDTO:SausagedUpdateDTO,sausageId:number){
        if(!sausagedUpdateDTO.hour) throw new Error("[400], hour is required");
        if(!sausagedUpdateDTO.weight) throw new Error("[400], weight is required");
        if(!sausageId) throw new Error("[400], sausageId is required");
        let sausaged:Sausaged = await this.sausagedRepository.getSausagedById(sausageId);
        if(!sausaged) throw new Error("[400], sausaged not found");
        if(!sausaged.hour2 && !sausaged.weightMedium){
            sausaged.hour2 = sausagedUpdateDTO.hour;
            sausaged.weightMedium = sausagedUpdateDTO.weight.toString();
        }else{
            if(!sausaged.hour3 && !sausaged.weightExit && sausaged.hour2 && sausaged.weightMedium){
                sausaged.hour3 = sausagedUpdateDTO.hour;
                sausaged.weightExit = sausagedUpdateDTO.weight.toString();
            }else{
                throw new Error("[404], Time and weight are already registered");
            }   
        }
        await this.sausagedRepository.saveSausaged(sausaged);
    }


    async getSausagedByProcessId(id:number){
        return await this.sausagedRepository.getSausagedById(id);
    }
}