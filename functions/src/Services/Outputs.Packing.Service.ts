import { OutputsPackingRepository } from "../Repositories/Outputs.Packing.Repository";
import { OutputsPacking } from '../Models/Entity/Outputs.Packing';
import { WarehouseExitPackingDTO } from "../Models/DTO/WarehouseDTO";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { WarehousePacking } from "../Models/Entity/Warehouse.Packing";
import { WarehousePackingRepository } from "../Repositories/Warehouse.Packing.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";

export class OutputsPackingService{
    private outputsPackingRepository:OutputsPackingRepository;
    private productRepository:ProductRepository;
    private warehousePackingRep:WarehousePackingRepository;
    constructor(){
        this.outputsPackingRepository = new OutputsPackingRepository();
        this.productRepository = new ProductRepository();
        this.warehousePackingRep = new WarehousePackingRepository();
    }

    async createOutputsPacking(outputsPackingDTO:WarehouseExitPackingDTO){
        
        let product:Product = await this.productRepository.getProductById(outputsPackingDTO.productId);
        if(!product) throw new Error("[404], producto no existe");
        let lote:WarehousePacking = await this.warehousePackingRep.getWarehousePackingByLoteId(outputsPackingDTO.loteId);
        if(!lote) throw new Error("[404], lote no existe");
        if(lote.status==WarehouseStatus.CLOSED) throw new Error("[409], el lote ya esta cerrado");
        if(lote.status==WarehouseStatus.PENDING) throw new Error("[409], el lote no ah sido abierto");

        let outputsPacking = new OutputsPacking();
        outputsPacking.loteProveedor = outputsPackingDTO.loteId;
        outputsPacking.operatorOutlet = outputsPackingDTO.name;
        outputsPacking.product = product;
        outputsPacking.quantity = outputsPackingDTO.quantity;
        outputsPacking.date=outputsPackingDTO.date;
        outputsPacking.warehousePacking=lote;
        return await this.outputsPackingRepository.createOutputsPacking(outputsPacking);
    }

    async getAlloutputsPacking(){
        return await this.outputsPackingRepository.getAllOutputsPacking();
    }

    async getOutputsPackingById(id:number){
        return await this.outputsPackingRepository.getOutputsPackingById(id);
    }

    async getOutputsPackingByLot(lot:string){
        return await this.outputsPackingRepository.getOutputsPackingByLot(lot);
    }
    
}