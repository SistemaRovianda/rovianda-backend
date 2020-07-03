import { SausagedRepository } from "../Repositories/Sausaged.Repository";
import { ProcessRepository } from "../Repositories/Process.Repository";
import { ProductRepository } from "../Repositories/Product.Repository";
import { Sausaged } from "../Models/Entity/Sausaged";
import { Process } from "../Models/Entity/Process";
import { Product } from "../Models/Entity/Product";
import { Request } from "express";
import { SausagedDTO,SausagedUpdateDTO } from "../Models/DTO/SausagedDTO";

export class SausagedService{
    private sausagedRepository:SausagedRepository;
    private processRepository:ProcessRepository;
    private productRepository:ProductRepository;
    constructor(){
        this.sausagedRepository = new SausagedRepository();
        this.processRepository = new ProcessRepository();
        this.productRepository = new ProductRepository();
    }

    async saveSausaged(sausagedDTO:SausagedDTO,processId:string){
        if(!sausagedDTO.productId) throw new Error("[400], productId is required");
        if(!sausagedDTO.temperature) throw new Error("[400], temperature is required");
        if(!sausagedDTO.date) throw new Error("[400], date is required");
        if(!sausagedDTO.time.hour) throw new Error("[400], hour1 is required");
        if(!sausagedDTO.time.weight) throw new Error("[400], weightInitial is required");
        let sausaged = new Sausaged();
        let processObj:Process = await this.processRepository.getProcessWithSausagedById(+processId);
        if(processObj){
            let product:Product = await this.productRepository.getProductById(sausagedDTO.productId);
            if(processObj.sausageId) throw new Error("[409],el proceso ya tiene embutido registrado");
            if(product){
                sausaged.date = sausagedDTO.date;
                sausaged.hour1 = sausagedDTO.time.hour;
                sausaged.temperature = sausagedDTO.temperature;
                sausaged.weightIni = sausagedDTO.time.weight.toString();
                sausaged.productId = product;
                await this.sausagedRepository.saveSausaged(sausaged);
                let objSausaged:Sausaged = await this.sausagedRepository.getLastSausaged();
                processObj.sausageId = objSausaged[0];
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
        let sausaged:Sausaged[] = await this.sausagedRepository.getSausagedByProcess(+req.params.processId);
        let response:any = {};
        sausaged.forEach( async (i:any) => {
            response = {
                product: {
                    id: `${i.product_id}`,
                    description: `${i.description}`
                },
                temperature: `${i.temperature}`,
                date: `${i.date}`,
                time: {
                    hour1: `${i.hour1}`,
                    weightInitial: `${i.weight_ini}`,
                    hour2: `${i.hour2}`,
                    weightMedium: `${i.weight_medium}`,
                    hour3: `${i.hour3}`,
                    weightFinal: `${i.weight_exit}`
                }
            };
        });
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


}