import { EntranceDriefRepository } from "../Repositories/Entrance.Drief.Repository";
import { EntranceDriefDTO } from "../Models/DTO/EntranceDriefDTO";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { EntranceDrief } from "../Models/Entity/Entrances.Drief";
import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";
import { Request } from "express";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";

export class EntranceDriefService{
    private entranceDriefRepository:EntranceDriefRepository;
    private productRepository:ProductRepository;
    private warehouseDriefRepository:WarehouseDriefRepository;
    constructor(){
        this.entranceDriefRepository = new EntranceDriefRepository();
        this.productRepository = new ProductRepository();
        this.warehouseDriefRepository = new WarehouseDriefRepository();
    }

    async saveEntranceDrief(req:Request){
        let entranceDriefDTO:EntranceDriefDTO=req.body;
        if(!entranceDriefDTO.expiration) throw new Error("[400],el parametro expiration es requerido");
        if(!entranceDriefDTO.loteProveedor) throw new Error("[400],el parametro loteProveedor es requerido");
        if(!entranceDriefDTO.odor) throw new Error("[400],el parametro odor es requerido");
        if(!entranceDriefDTO.packing) throw new Error("[400],el parametro packing es requerido");
        if(!entranceDriefDTO.productId) throw new Error("[400],el parametro productId es requerido");
        if(!entranceDriefDTO.proveedor) throw new Error("[400],el parametro proveedor es requerido");
        if(!entranceDriefDTO.quality) throw new Error("[400],el parametro quality es requerido");
        if(!entranceDriefDTO.quantity) throw new Error("[400],el parametro quantity es requerido");
        if(!entranceDriefDTO.strangeMaterial) throw new Error("[400],el parametro strangeMaterial es requerido");
        if(!entranceDriefDTO.texture) throw new Error("[400],el parametro texture es requerido");
        if(!entranceDriefDTO.transport) throw new Error("[400],el parametro transport es requerido");
        if(!entranceDriefDTO.weight) throw new Error("[400],el parametro weight es requerido");
        if(!entranceDriefDTO.color) throw new Error("[400],el parametro color es requerido");
        if(!entranceDriefDTO.date) throw new Error("[400],el parametro date es requerido");

        let product:Product = await this.productRepository.getProductById(entranceDriefDTO.productId);
        if(!product) throw new Error("[400], el producto a recibir no existe");

        let entranceDrief:EntranceDrief = new EntranceDrief();
        entranceDrief.date=entranceDriefDTO.date;
        entranceDrief.expiration=entranceDriefDTO.expiration;
        entranceDrief.loteProveedor=entranceDriefDTO.loteProveedor;
        entranceDrief.paking=entranceDriefDTO.packing;
        entranceDrief.product=product;
        entranceDrief.proveedor= entranceDriefDTO.proveedor;
        entranceDrief.quality=entranceDriefDTO.quality;
        entranceDrief.quantity=entranceDriefDTO.quantity;
        entranceDrief.strangeMaterial=entranceDriefDTO.strangeMaterial;
        entranceDrief.texture=entranceDrief.texture;
        entranceDrief.transport=entranceDriefDTO.transport;
        entranceDrief.weight = entranceDriefDTO.weight;
        entranceDrief.color = entranceDriefDTO.color;
        entranceDrief.isPz = entranceDriefDTO.isPz;
        entranceDrief.observations = entranceDriefDTO.observations;

        let warehouseDrief:WarehouseDrief = new WarehouseDrief();
        warehouseDrief.userId = req.headers.uid as string;
        warehouseDrief.date= entranceDriefDTO.date;
        warehouseDrief.isPz = entranceDriefDTO.isPz;
        warehouseDrief.loteProveedor = entranceDriefDTO.loteProveedor;
        warehouseDrief.observations = entranceDriefDTO.observations;
        warehouseDrief.product = product;
        warehouseDrief.quantity = entranceDriefDTO.quantity;
        warehouseDrief.status = WarehouseStatus.PENDING;
        warehouseDrief.userId = req.headers.uid as string;
        
        this.entranceDriefRepository.saveDrief(entranceDrief);
        this.warehouseDriefRepository.saveWarehouseDrief(warehouseDrief);
    }

}