import { OutputsCoolingRepository } from "../Repositories/Outputs.Cooling.Repository";
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { OutputMeatDTO } from "../Models/DTO/Output.Meat.DTO";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { Cooling } from "../Models/Entity/Cooling";
import { CoolingRepository } from "../Repositories/Cooling.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";

export class OutputsCoolingService{
    private outputsCoolingRepository:OutputsCoolingRepository;
    private productRepository:ProductRepository;
    private coolingRepository:CoolingRepository;
    constructor(){
        this.outputsCoolingRepository = new OutputsCoolingRepository();
        this.productRepository = new ProductRepository();
        this.coolingRepository= new CoolingRepository();
    }

    async createOutputsCooling(outputsMeat:OutputMeatDTO){

        let lote:Cooling = await this.coolingRepository.getCoolingByLote(outputsMeat.loteId);
        if(!lote) throw new Error("[404],no existe el lote");

        let colling:Cooling = await this.coolingRepository.getCoolingById(outputsMeat.materialId)
        if(!colling) throw new Error("[404],no existe materialId");
        if(colling.status==WarehouseStatus.CLOSED) throw new Error("[409], el lote esta cerrado");
        if(colling.status==WarehouseStatus.PENDING) throw new Error("[409], el lote no ah sido abierto");

        let outputsCooling:OutputsCooling = new OutputsCooling();
        outputsCooling.loteInterno = outputsMeat.loteId;
        outputsCooling.rawMaterial = colling.rawMaterial;
        outputsCooling.observations = outputsMeat.observations;
        outputsCooling.outputDate = outputsMeat.date;
        outputsCooling.quantity = outputsMeat.quantity;
        
        return await this.outputsCoolingRepository.createOutputsCooling(outputsCooling);
    }
    
    async getAlloutputsCooling(){
        return await this.outputsCoolingRepository.getAllOutputsCooling();
    }

    async getOutputsCoolingById(id:number){
        return await this.outputsCoolingRepository.getOutputsCoolingById(id);
    }

    async getOutputsCoolingByLot(lot:string){
        return await this.outputsCoolingRepository.getOutputsCoolingByLot(lot);
    }

    async getOutputsCoolingByStatus(status:string){
        let outputsCooling:OutputsCooling[] = await this.outputsCoolingRepository.getOutputsCoolingByStatus(status);
        let response:any = [];
        outputsCooling.forEach(i => {
            response.push({
                lotId:`${i.loteInterno}`,
                quantity: `${i.quantity}`,
                outputId: `${i.id}`
            });
        });
        return response;
    }
    
}