import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";
import { WarehouseDTO } from "../Models/DTO/WarehouseDTO";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { EntranceDriefRepository } from "../Repositories/Entrance.Drief.Repository";
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";
import { Request } from "express";

export class WarehouseDriefService{
    private warehouseDriefRepository:WarehouseDriefRepository;
    private productRepository:ProductRepository;
    private entranceDriefRepository:EntranceDriefRepository;
    constructor(){
        this.warehouseDriefRepository = new WarehouseDriefRepository();
        this.productRepository = new ProductRepository();
        this.entranceDriefRepository = new EntranceDriefRepository();
    }

    async updateWarehouseDrief(warehouseDTO:WarehouseDTO,warehouseDriefId:number){
        if(!warehouseDriefId) throw new Error("[400], warehouseDriefId es requerido");
        if(!warehouseDTO.loteId) throw new Error("[400], loteId es requerido");
        if(!warehouseDTO.productId) throw new Error("[400], productId es requerido");
        if(!warehouseDTO.date) throw new Error("[400], date es requerido");
        if(!warehouseDTO.status) throw new Error("[400], status es requerido");
        let product:Product = await this.productRepository.getProductById(warehouseDTO.productId);
        if(!product) throw new Error("[404], el producto no existe");
        let lote:WarehouseDrief[] = await this.warehouseDriefRepository.getWarehouseDriefByLoteIdAndProductId(warehouseDTO.loteId,warehouseDTO.productId);
        if(!lote.length) throw new Error("[404], el lote no existe");
        let warehouseDrief:WarehouseDrief = await this.warehouseDriefRepository.getWarehouseDriefByIds(warehouseDriefId);
        if(!warehouseDrief) throw new Error(`[404], WarehouseDrief whit Id ${warehouseDriefId} not found`);
        
        switch(warehouseDTO.status){
            case WarehouseStatus.CLOSED:
                warehouseDrief.status = WarehouseStatus.CLOSED;
                warehouseDrief.closingDate = warehouseDTO.date;
                break;
            case WarehouseStatus.OPENED:
                warehouseDrief.status = WarehouseStatus.OPENED;
                warehouseDrief.openingDate = warehouseDTO.date;
                break;
            default:
                throw new Error("[400], el valor del status es invalido");
                break;
        }

        await this.warehouseDriefRepository.saveWarehouseDrief(warehouseDrief);
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
                let entranceDrief = await this.entranceDriefRepository.getEntrnaceDriefByLotProduct(warehouseDriefLote[n].lote_proveedor,warehouseDriefLote[n].productId);
                if(entranceDrief[0].quality && entranceDrief[0].expiration && 
                    entranceDrief[0].transport && entranceDrief[0].strange_material &&
                    entranceDrief[0].paking && entranceDrief[0].color &&
                    entranceDrief[0].texture && entranceDrief[0].weight &&
                    entranceDrief[0].odor){
                        response1.push({
                            id: `${warehouseDriefLote[n].productId}`,
                            warehouseDriefId: `${warehouseDriefLote[n].id}`,
                            quantity: `${warehouseDriefLote[n].quantity}`,
                            description: `${warehouseDriefLote[n].description}`
                        });
                    }
            }
            response.push({ 
                loteId: `${warehouseDriefStatus[i].lote_proveedor}`,
                products: response1
            })
        }
        return response;
    }

    async getDriefHistory(lotId:string) {

        let warehouseDrief: WarehouseDrief = await this.warehouseDriefRepository.getWarehouseDriefById(+lotId);

        if (!warehouseDrief)
            throw new Error(`[404], warehouseDrief with lot ${lotId} was not found`);

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

    async getAllWarehouseDrief(){
        let warehouseDrief:WarehouseDrief[] = await this.warehouseDriefRepository.getAllWarehouseDrief();
        let response:any = [];
        warehouseDrief.forEach(i => {
            response.push({
                warehouseDriefId:`${i.id}`,
                loteProveedor: `${i.loteProveedor}`,
                quantity: `${i.quantity}`
            });
        });
        return response;
    }

    async getDataReport(dateInit:string,dateEnd:string){
        if(!dateInit) throw new Error(`[400], initDate is required in query`);
        if(!dateEnd) throw new Error(`[400], finalDate is required in query`);
        if(Date.parse(dateInit)>Date.parse(dateEnd)) throw new Error(`[400], initDate cannot be greater than finalDate`);

        return await this.warehouseDriefRepository.getWarehouseDriefReport(dateInit,dateEnd);
    }
}