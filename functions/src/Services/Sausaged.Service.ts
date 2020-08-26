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

export class SausagedService{
    private sausagedRepository:SausagedRepository;
    private processRepository:ProcessRepository;
    private productRepository:ProductRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    constructor(){
        this.sausagedRepository = new SausagedRepository();
        this.processRepository = new ProcessRepository();
        this.productRepository = new ProductRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
    }

    async saveSausaged(sausagedDTO:SausagedDTO,processId:string){
        if(!sausagedDTO.productId) throw new Error("[400], productId is required");
        if(!sausagedDTO.temperature) throw new Error("[400], temperature is required");
        if(!sausagedDTO.date) throw new Error("[400], date is required");
        if(!sausagedDTO.loteMeat) throw new Error("[400], loteMeat is required");
        if(!sausagedDTO.time.hour) throw new Error("[400], hour1 is required");
        if(!sausagedDTO.time.weight) throw new Error("[400], weightInitial is required");
        let sausaged = new Sausaged();
        let processObj:Process = await this.processRepository.getProcessWithSausagedById(+processId);
        if(processObj){
            let product:ProductRovianda = await this.productRoviandaRepository.getById(sausagedDTO.productId);
            if(processObj.sausageId) throw new Error("[409],el proceso ya tiene embutido registrado");
            if(product){
                sausaged.date = sausagedDTO.date;
                sausaged.hour1 = sausagedDTO.time.hour;
                sausaged.temperature = sausagedDTO.temperature;
                sausaged.loteMeat = sausagedDTO.loteMeat
                sausaged.weightIni = sausagedDTO.time.weight.toString();
                sausaged.productId = product;
                let objSausaged:Sausaged = await this.sausagedRepository.saveSausaged(sausaged);
                if(!processObj.loteInterno) { processObj.loteInterno = sausagedDTO.loteMeat; }
                
                processObj.sausageId = objSausaged;
                if(!processObj.product){
                    processObj.product=product;
                }
                processObj.currentProcess = "Embutido";
                await this.processRepository.saveProcess(processObj);
            }else{
                throw new Error("[404], Product not found");
            }
        }else{
            throw new Error("[404], Process not found");
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
        if(!process.sausageId) throw new Error("[404], dont have sausage");
        let sausaged:Sausaged = await this.sausagedRepository.getSausagedById(process.sausageId.id);
        console.log(sausaged)
        let response:any = {};
            response = {
                sausagedId: `${sausaged.id}`,
                product: {
                    id: `${sausaged.productId ? sausaged.productId.id : ""}`,
                    description: `${sausaged.productId? sausaged.productId.name : ""}`
                },
                temperature: `${sausaged.temperature}`,
                date: `${sausaged.date}`,
                time: {
                    hour1: `${sausaged.hour1}`,
                    weightInitial: `${sausaged.weightIni}`,
                    hour2: `${sausaged.hour2}`,
                    weightMedium: `${sausaged.weightMedium}`,
                    hour3: `${sausaged.hour3}`,
                    weightFinal: `${sausaged.weightExit}`
                },
                loteMeat: `${sausaged.loteMeat}`
            };
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