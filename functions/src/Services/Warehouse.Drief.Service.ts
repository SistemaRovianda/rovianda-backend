import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";
import { WarehouseDTO } from "../Models/DTO/WarehouseDTO";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";

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
        let lote:WarehouseDrief = await this.warehouseDriefRepository.getWarehouseDriefByLoteId(warehouseDTO.loteId);
        if(!lote) throw new Error("[404], el lote no existe");
        
        switch(warehouseDTO.status){
            case WarehouseStatus.CLOSED:
                lote.status = WarehouseStatus.CLOSED;
                lote.closingDate = warehouseDTO.date;
                break;
            case WarehouseStatus.OPENED:
                lote.status = WarehouseStatus.OPENED;
                lote.openingDate = warehouseDTO.date;
                break;
            default:
                throw new Error("[400], el valor del status es invalido");
                break;
        }

        await this.warehouseDriefRepository.saveWarehouseDrief(lote);
    }

   

    async createWarehouseDrief(warehouseDrief:WarehouseDrief){
        return await this.warehouseDriefRepository.saveWarehouseDrief(warehouseDrief);
    }
    
    async getWarehouseDriefRepositoryById(id:number){
        return await this.warehouseDriefRepository.getWarehouseDriefById(id);
    }

    
    async getWarehouseDriefRepositoryByStatus(status:string){
        return await this.warehouseDriefRepository.getWarehouseDriefByStatus(status);
    }
}