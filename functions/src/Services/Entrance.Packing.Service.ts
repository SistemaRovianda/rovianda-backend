import { EntrancePackingRepository } from "../Repositories/Entrance.Packing.Repository";
import {  EntrancePackingDTO } from "../Models/DTO/EntrancePackingDTO";
import { EntrancePacking } from "../Models/Entity/Entrances.Packing";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { WarehousePacking } from "../Models/Entity/Warehouse.Packing";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { Request } from "express";
import { WarehousePackingRepository } from "../Repositories/Warehouse.Packing.Repository";
import { User } from "../Models/Entity/User";
import { UserRepository } from "../Repositories/User.Repository";

export class EntrancePackingService{
    private entrancePackingRepository:EntrancePackingRepository;
    private productRepository:ProductRepository;
    private warehousePackingRepository:WarehousePackingRepository;
    private userRepository:UserRepository;
    constructor(){
        this.entrancePackingRepository = new EntrancePackingRepository();
        this.productRepository = new ProductRepository();
        this.warehousePackingRepository = new WarehousePackingRepository();
        this.userRepository = new UserRepository();
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
        if(!entrancePackingDTO.verifitId) throw new Error("[400],el parametro verifitId es requerido");
        if(!entrancePackingDTO.makeId) throw new Error("[400],el parametro makeId es requerido");
        if(entrancePackingDTO.quality == null ) throw new Error("[400],el parametro quality es requerido");
        if(entrancePackingDTO.paking == null ) throw new Error("[400],el parametro paking es requerido");
        if(entrancePackingDTO.quantity == null ) throw new Error("[400],el parametro quantity es requerido");
        if(entrancePackingDTO.strageMaterial == null ) throw new Error("[400],el parametro strangeMaterial es requerido");
        if(entrancePackingDTO.transport == null ) throw new Error("[400],el parametro transport es requerido");
        let verifit:User = await this.userRepository.getUserById(entrancePackingDTO.verifitId);
        if(!verifit) throw new Error("[404], verifit no encontrado");
        let make:User = await this.userRepository.getUserById(entrancePackingDTO.makeId);
        if(!make) throw new Error("[404], make no encontrado");

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
        entrancePacking.quality = entrancePackingDTO.quality;
        entrancePacking.quantity = entrancePackingDTO.quantity;
        entrancePacking.strangeMaterial = entrancePackingDTO.strageMaterial;
        entrancePacking.paking = entrancePackingDTO.paking;
        entrancePacking.transport = entrancePackingDTO.transport;
        entrancePacking.make = make;
        entrancePacking.verifit = verifit;

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
        let id:any = await this.entrancePackingRepository.getLastEntrnacePacking();
        return id[0].id;
    }

    async getReportPacking(pakingId:number){
        if(!pakingId) throw new Error("[400],pakingId is required");
        let packing:EntrancePacking = await this.entrancePackingRepository.getBypakingId(pakingId);
        console.log(packing)
        if(!packing) throw new Error("[400],packing not found");
        return packing;
    }

    async getReportEntrysPacking(dateInit:string,dateEnd:string){
        if(!dateInit) throw new Error(`[400], initDate is required in query`);
        if(!dateEnd) throw new Error(`[400], finalDate is required in query`);
        if(Date.parse(dateInit)>Date.parse(dateEnd)) throw new Error(`[400], iniDate cannot be greater than finDate`);
        let packing:EntrancePacking[]= await this.entrancePackingRepository.getEntrysPacking(dateInit,dateEnd);
        return packing;
    }

}