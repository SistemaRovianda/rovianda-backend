import { SausagedRepository } from "../Repositories/Sausaged.Repository";
import { ProcessRepository } from "../Repositories/Process.Repository";
import { ProductRepository } from "../Repositories/Product.Repository";
import { Sausaged } from "../Models/Entity/Sausaged";
import { Process } from "../Models/Entity/Process";
import { Product } from "../Models/Entity/Product";
import { Request } from "express";
import { SausagedDTO,SausagedUpdateDTO, SausageHourRequest } from "../Models/DTO/SausagedDTO";
import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { Formulation } from "../Models/Entity/Formulation";
import { FormulationRepository } from "../Repositories/Formulation.Repository";
import { ProcessStatus } from "../Models/Enum/ProcessStatus";
import { DefrostRepository } from "../Repositories/Defrost.Repository";
import { Defrost } from "../Models/Entity/Defrost";
import { DefrostFormulation } from "../Models/Entity/Defrost.Formulation";
import { DefrostFormulationRepository } from "../Repositories/DefrostFormulation.Repository";

export class SausagedService{
    private sausagedRepository:SausagedRepository;
    private processRepository:ProcessRepository;
    private productRepository:ProductRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    private formulationRepository:FormulationRepository;
    private defrostFormulationRepository:DefrostFormulationRepository;
    constructor(){
        this.sausagedRepository = new SausagedRepository();
        this.processRepository = new ProcessRepository();
        this.productRepository = new ProductRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.formulationRepository= new FormulationRepository();
        this.defrostFormulationRepository = new DefrostFormulationRepository();
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
        let formulation:Formulation = await this.formulationRepository.getByFormulationId(formulationId);
        if(!formulation) throw new Error("[404], no existe la formulacion con el id: "+formulationId);
        
            let process:Process =null;
            if(formulation.process){
                process = formulation.process;
                if(!process.sausage || !process.sausage.length){
                    process.sausage = new Array<Sausaged>();
                }
            }else{
                process = await this.createProcessInter();
                process.formulation  = formulation;
                process.product = formulation.productRovianda;
                process.sausage = new Array<Sausaged>();
                if(formulation.status=="TAKED") throw new Error("[409], formulation already taked");
                formulation.status="TAKED";
                await this.formulationRepository.saveFormulation(formulation);
            }
        for(let sausagedDTO of sausagedsDTO){
            if(!sausagedDTO.temperature) throw new Error("[400], temperature is required");
            if(!sausagedDTO.date) throw new Error("[400], date is required");
            if(!sausagedDTO.defrostId) throw new Error("[400], defrostId is required");
            if(!sausagedDTO.time.hour1) throw new Error("[400], hour1 is required");
            if(!sausagedDTO.time.weightInitial) throw new Error("[400], weightInitial is required");
            
            let defrostFormulation:DefrostFormulation = await this.defrostFormulationRepository.getDefrostFormulation(sausagedDTO.defrostId);
            if(!defrostFormulation) throw new Error("[404], no existe la salida de enfriamiento con id: "+sausagedDTO.defrostId);
            
            let sausaged = new Sausaged();
            sausaged.date = sausagedDTO.date;
            sausaged.hour1 = sausagedDTO.time.hour1;
            sausaged.temperature = sausagedDTO.temperature;
            sausaged.loteMeat = defrostFormulation.defrost.outputCooling.loteInterno;
            sausaged.weightIni = sausagedDTO.time.weightInitial.toString();
            sausaged.raw = defrostFormulation.defrost.outputCooling.rawMaterial.rawMaterial;
            
            process.sausage.push(sausaged);
            
        }
        process.currentProcess = "Embutido";
        await this.processRepository.saveProcess(process);
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
        
        let response:Array<any>=new Array<any>();
        for(let sausage of process.sausage){
            response.push( {
                sausagedId: `${sausage.id}`,
                product: {
                    id: `${process.product.id}`,
                    description: `${process.product.name}`
                },
                temperature: `${sausage.temperature}`,
                date: `${sausage.date}`,
                time: {
                    hour1: `${sausage.hour1}`,
                    weightInitial: `${sausage.weightIni}`,
                    hour2:sausage.hour2,
                    weightMedium:sausage.weightMedium,
                    hour3: sausage.hour3,
                    weightFinal: sausage.weightExit
                },
                lotId: `${sausage.loteMeat}`,
                formulation:{
                    id: process.formulation.id,
                    lotDay: process.formulation.lotDay
                },
                rawMaterial: sausage.raw
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

    async updateHours(sausageId:number,sausageHourRequest:SausageHourRequest){
        let sausage:Sausaged = await this.sausagedRepository.getSausagedById(sausageId);
        if(!sausage) throw new Error("[404], no existe el registro de embutido");
        if(sausageHourRequest.hour==2){
            sausage.hour2=sausageHourRequest.hourSaved;
            sausage.weightMedium=sausageHourRequest.weigthSaved;
        }else if(sausageHourRequest.hour==3){
            sausage.hour3=sausageHourRequest.hourSaved;
            sausage.weightExit=sausageHourRequest.weigthSaved;
        }
        await this.sausagedRepository.saveSausaged(sausage);
    }
}