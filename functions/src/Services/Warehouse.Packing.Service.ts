import { WarehousePackingRepository } from "../Repositories/Warehouse.Packing.Repository";
import { WarehousePacking } from "../Models/Entity/Warehouse.Packing";
import { WarehouseDTO } from "../Models/DTO/WarehouseDTO";
import { ProductRepository } from "../Repositories/Product.Repository";
import { Product } from "../Models/Entity/Product";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";

export class WarehousePackingService{
    private warehousePackingRepository:WarehousePackingRepository;
    private productRepository:ProductRepository;
    constructor(){
        this.warehousePackingRepository = new WarehousePackingRepository();
        this.productRepository = new ProductRepository();
    }
    
    async updateWarehouseStatus(warehousePackinDTO:WarehouseDTO){
        let product:Product = await this.productRepository.getProductById(+warehousePackinDTO.productId);
        if(!product) throw new Error("[404], el producto no existe en la seccion de empaques");
        
        let lote:WarehousePacking = await this.warehousePackingRepository.getWarehousePackingByLoteId(warehousePackinDTO.loteId); 
        if(!lote) throw new Error("[404], el lote indicado en el request no existe");

        switch(warehousePackinDTO.status){
            case WarehouseStatus.OPENED:
                lote.status=WarehouseStatus.OPENED;
                lote.openingDate = warehousePackinDTO.date;
                break;
            case WarehouseStatus.CLOSED:
                lote.status=WarehouseStatus.CLOSED;
                lote.closingDate = warehousePackinDTO.date;
                break;
            default:
                throw new Error("[400], status no valido");
                break;
        }

        await this.warehousePackingRepository.saveWarehousePacking(lote);
        
    }

    async getWarehousePackingById(id:number){
        return await this.warehousePackingRepository.getWarehousePackingfById(id);
    }

    
    async getWarehousePackingByStatus(status:string){
        return await this.warehousePackingRepository.getWarehousePackingByStatus(status);
    }


        async saveWarehousePacking(warehousePacking:WarehousePacking){
            return await this.warehousePackingRepository.saveWarehousePacking(warehousePacking);
        }
    
}