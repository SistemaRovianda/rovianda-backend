import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";
import { WarehouseDTO } from "../Models/DTO/WarehouseDTO";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";
import { Request } from "express";

export class WarehouseDriefService{
    private warehouseDriefRepository:WarehouseDriefRepository;
    private productRepository:ProductRepository;
    constructor(){
        this.warehouseDriefRepository = new WarehouseDriefRepository();
        this.productRepository = new ProductRepository();
    }

    async updateWarehouseDrief(warehouseDTO:WarehouseDTO){
        let product:Product = await this.productRepository.getProductById(warehouseDTO.productId);
        if(!product) throw new Error("[404], el producto no existe");
        let lote:WarehouseDrief[] = await this.warehouseDriefRepository.getWarehouseDriefByLoteIdAndProductId(warehouseDTO.loteId,warehouseDTO.productId);
        if(!lote.length) throw new Error("[404], el lote no existe");
        
        switch(warehouseDTO.status){
            case WarehouseStatus.CLOSED:
                lote[0].status = WarehouseStatus.CLOSED;
                lote[0].closingDate = warehouseDTO.date;
                break;
            case WarehouseStatus.OPENED:
                lote[0].status = WarehouseStatus.OPENED;
                lote[0].openingDate = warehouseDTO.date;
                break;
            default:
                throw new Error("[400], el valor del status es invalido");
                break;
        }

        await this.warehouseDriefRepository.saveWarehouseDrief(lote[0]);
    }

   

    async createWarehouseDrief(warehouseDrief:WarehouseDrief){
        return await this.warehouseDriefRepository.saveWarehouseDrief(warehouseDrief);
    }
    
    async getWarehouseDriefRepositoryById(id:number){
        return await this.warehouseDriefRepository.getWarehouseDriefById(id);
    }

    
    async getWarehouseDriefRepositoryByStatus(status:string){
        let warehouseDriefStatus = await this.warehouseDriefRepository.getWarehouseDriefByStatusGroup(status);
        let response:any = [];
        for(let i = 0; i<warehouseDriefStatus.length; i++){
            let warehouseDriefLote = await this.warehouseDriefRepository.getWarehouseDriefByLoteProveedor(warehouseDriefStatus[i].lote_proveedor,status);
            let response1:any = [];
            for(let n = 0; n<warehouseDriefLote.length; n++){
                response1.push({
                    id: `${warehouseDriefLote[n].productId}`,
                    description: `${warehouseDriefLote[n].description}`
                });
            }
            response.push({ 
                loteId: `${warehouseDriefStatus[i].lote_proveedor}`,
                products: response1
            })
        }
        return response;
    }

    async getDriefHistory(req: Request) {
        let { lotId } = req.params;

        let warehouseDrief: WarehouseDrief = await this.warehouseDriefRepository.getWarehouseDriefById(+lotId);

        if (!warehouseDrief)
            throw new Error(`[404], warehouseDrief with id ${lotId} was not found`);

        let outputs = warehouseDrief.outputDriefs.map(outputDrief => {
            return {
                outputDate: outputDrief.date,
                product: outputDrief.product.description,
                productId: outputDrief.product.id,
                observations: outputDrief.observations
            }
        });

        let response = {
            receptionDate: warehouseDrief.date,
            openingDate: warehouseDrief.openingDate,
            closedDate: warehouseDrief.closingDate,
            outputs
        }

        return response;
    }
}