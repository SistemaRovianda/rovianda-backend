import { SausagedRepository } from "../Repositories/Sausaged.Repository";
import { ProcessRepository } from "../Repositories/Process.Repository";
import { ProductRepository } from "../Repositories/Product.Repository";
import { Sausaged } from "../Models/Entity/Sausaged";
import { Process } from "../Models/Entity/Process";
import { Product } from "../Models/Entity/Product";
import { Request } from "express";
import { SausagedDTO } from "../Models/DTO/SausagedDTO";

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
        if(!sausagedDTO.time.hour1) throw new Error("[400], hour1 is required");
        if(!sausagedDTO.time.weightInitial) throw new Error("[400], weightInitial is required");
        if(!sausagedDTO.time.hour2) throw new Error("[400], hour2 is required");
        if(!sausagedDTO.time.weightMedium) throw new Error("[400], weightMedium is required");
        if(!sausagedDTO.time.hour3) throw new Error("[400], hour3 is required");
        if(!sausagedDTO.time.weightFinal) throw new Error("[400], weightFinal is required");
        let sausaged = new Sausaged();
        let processObj:Process = await this.processRepository.findProcessById(+processId);
        if(processObj){
            let product:Product = await this.productRepository.getProductById(sausagedDTO.productId);
            if(product){
                sausaged.date = sausagedDTO.date;
                sausaged.hour1 = sausagedDTO.time.hour1;
                sausaged.hour2 = sausagedDTO.time.hour2;
                sausaged.hour3 = sausagedDTO.time.hour3;
                sausaged.temperature = sausagedDTO.temperature;
                sausaged.weightIni = sausagedDTO.time.weightInitial.toString();
                sausaged.weightMedium = sausagedDTO.time.weightMedium.toString();
                sausaged.weightExit = sausagedDTO.time.weightFinal.toString();
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
}