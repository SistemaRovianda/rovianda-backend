import { EntrancePackingRepository } from "../Repositories/Entrance.Packing.Repository";
import {  EntrancePackingDTO } from "../Models/DTO/EntrancePackingDTO";
import { EntrancePacking } from "../Models/Entity/Entrances.Packing";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { WarehousePacking } from "../Models/Entity/Warehouse.Packing";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { Request } from "express";
import { WarehousePackingRepository } from "../Repositories/Warehouse.Packing.Repository";

export class EntrancePackingService{
    private entrancePackingRepository:EntrancePackingRepository;
    private productRepository:ProductRepository;
    private warehousePackingRepository:WarehousePackingRepository;
    constructor(){
        this.entrancePackingRepository = new EntrancePackingRepository();
        this.productRepository = new ProductRepository();
        this.warehousePackingRepository = new WarehousePackingRepository();
    }

    async saveEntrancePacking(req:Request){
        let entrancePackingDTO:EntrancePackingDTO = req.body;
        let userId=req.headers.authorization;
        if(!userId) throw new Error("[403],Credenciales invalidas");
        if(!entrancePackingDTO.date) throw new Error("[400],el parametro date es requirido");
        if(!entrancePackingDTO.isPz) throw new Error("[400],el parametro isPz es requerido");
        if(!entrancePackingDTO.lotProveedor) throw new Error("[400],el parametro lotProveedor es requerido");
        if(!entrancePackingDTO.productId) throw new Error("[400],el parametro productId es requerido");
        if(!entrancePackingDTO.proveedor) throw new Error("[400],el parametro proveedor es requerido");
        if(entrancePackingDTO.quality == null ) throw new Error("[400],el parametro quality es requerido");
        if(entrancePackingDTO.quantity == null ) throw new Error("[400],el parametro quantity es requerido");
        if(entrancePackingDTO.strageMaterial == null ) throw new Error("[400],el parametro strangeMaterial es requerido");
        if(entrancePackingDTO.transport == null ) throw new Error("[400],el parametro transport es requerido");
        

        let product:Product = await this.productRepository.getProductById(entrancePackingDTO.productId);
        if(!product) throw new Error("[400],el producto a recibir no existe en el catalogo");

        let entrancePacking:EntrancePacking = new EntrancePacking();
        entrancePacking.date = entrancePackingDTO.date;
        entrancePacking.isPz = entrancePackingDTO.isPz;
        entrancePacking.loteProveedor = entrancePackingDTO.lotProveedor;
        entrancePacking.proveedor = entrancePackingDTO.proveedor;
        entrancePacking.observations = entrancePackingDTO.observations;
        entrancePacking.product = product
        entrancePacking.proveedor = entrancePackingDTO.proveedor;
        entrancePacking.quality = entrancePacking.quality;
        entrancePacking.quantity = entrancePackingDTO.quantity;
        entrancePacking.strangeMaterial = entrancePackingDTO.strageMaterial;
        entrancePacking.transport = entrancePackingDTO.transport;

        let warehousePacking:WarehousePacking = new WarehousePacking();
        warehousePacking.isPz = entrancePackingDTO.isPz;
        warehousePacking.loteProveedor = entrancePackingDTO.lotProveedor;
        warehousePacking.observations = entrancePackingDTO.observations;
        warehousePacking.product = product;
        warehousePacking.quantity = entrancePackingDTO.quantity;
        warehousePacking.status = WarehouseStatus.PENDING;
        warehousePacking.userId= req.headers.uid as string;
        warehousePacking.date = entrancePackingDTO.date;
        await this.warehousePackingRepository.saveWarehousePacking(warehousePacking);
        await this.entrancePackingRepository.saveEntracenPacking(entrancePacking);
    }
}