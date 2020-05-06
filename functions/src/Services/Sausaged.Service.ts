import { SausagedRepository } from "../Repositories/Sausaged.Repository";
import { ProcessRepository } from "../Repositories/Process.Repository";
import { ProductRepository } from "../Repositories/Product.Repository";
import { Sausaged } from "../Models/Entity/Sausaged";
import { Process } from "../Models/Entity/Process";
import { Product } from "../Models/Entity/Product";
import { Request } from "express";

export class SausagedService{
    private sausagedRepository:SausagedRepository;
    private processRepository:ProcessRepository;
    private productRepository:ProductRepository;
    constructor(){
        this.sausagedRepository = new SausagedRepository();
        this.processRepository = new ProcessRepository();
        this.productRepository = new ProductRepository();
    }

    async saveSausaged(sausaged:Sausaged){
        return await this.sausagedRepository.saveSausaged(sausaged);
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