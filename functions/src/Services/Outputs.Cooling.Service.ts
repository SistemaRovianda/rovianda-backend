import { OutputsCoolingRepository } from "../Repositories/Outputs.Cooling.Repository";
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { OutputMeatDTO } from "../Models/DTO/Output.Meat.DTO";
import { Product } from "../Models/Entity/Product";
import { Raw } from '../Models/Entity/Raw';
import { ProductRepository } from "../Repositories/Product.Repository";
import { Cooling } from "../Models/Entity/Cooling";
import { CoolingRepository } from "../Repositories/Cooling.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { OutputsCoolingStatus } from '../Models/Enum/OutputsCoolingStatus';
import { RawRepository } from '../Repositories/Raw.Repository';

export class OutputsCoolingService{
    private outputsCoolingRepository:OutputsCoolingRepository;
    private productRepository:ProductRepository;
    private coolingRepository:CoolingRepository;
    private rawRepository:RawRepository;
    constructor(){
        this.outputsCoolingRepository = new OutputsCoolingRepository();
        this.productRepository = new ProductRepository();
        this.coolingRepository= new CoolingRepository();
        this.rawRepository = new RawRepository();
    }

    async createOutputsCooling(outputsMeat:OutputMeatDTO){

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
        outputsCooling.status = OutputsCoolingStatus.NOTUSED;
        
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
        console.log("entra")
        if(!status) throw new Error("[400], status is required");
        if(status == OutputsCoolingStatus.NOTUSED || status == OutputsCoolingStatus.USED){
            
            let outputsCooling:OutputsCooling[] = await this.outputsCoolingRepository.getOutputsCoolingByStatus(status);
            let response:any = [];
            if(outputsCooling.length){
            response = outputsCooling.map(i => {
                if(i.status == status){
                    return {
                        lotId:`${i.loteInterno}`,
                        quantity: `${i.quantity}`,
                        outputId: `${i.id}`,
                        name: `${i.rawMaterial.rawMaterial}`
                    };
                }
            
            });
            }
            return response;
        }else{
            throw new Error("[409], status incorrect");
        }
        // let outputsCooling:OutputsCooling[] = await this.outputsCoolingRepository.getOutputsCoolingByStatus(status);
        // let response:any = [];
        // outputsCooling.forEach(i => {
        //     response.push({
        //         lotId:`${i.loteInterno}`,
        //         quantity: `${i.quantity}`,
        //         outputId: `${i.id}`
        //     });
        // });
        // return response;
    }

    async getLotMeat(){
        let cooling = await this.coolingRepository.getCoolingByStatusOpenClose();
        let response:any = []
        console.log(cooling)
        for(let i = 0; i < cooling.length; i++){
            console.log(cooling[i].lote_interno);
            let outputsCooling:OutputsCooling = await this.outputsCoolingRepository.getOutputsCoolingByLot(cooling[i].lote_interno);
            if(outputsCooling){
                console.log(outputsCooling)
                if(outputsCooling.status == "NOTUSED"){
                    response.push({
                        outputsCoolingId: `${outputsCooling.id}`,
                        lot: `${outputsCooling.loteInterno}`
                    })
                }
            }
        }
        return response;
    }

    async getOutputsCoolingByRawIdAndStatus(status:string,rawMaterial:Raw){
        return await this.outputsCoolingRepository.getOutputCoolingByRawAndStatus(status,rawMaterial);
    }

    async updateOutputCooling(outputCooling:OutputsCooling){
        return await this.outputsCoolingRepository.createOutputsCooling(outputCooling);
    }
    
}