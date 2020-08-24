import { EntranceDriefRepository } from "../Repositories/Entrance.Drief.Repository";
import { EntranceDriefDTO } from "../Models/DTO/EntranceDriefDTO";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { EntranceDrief } from "../Models/Entity/Entrances.Drief";
import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";
import { Request } from "express";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { FirebaseHelper } from '../Utils/Firebase.Helper';

export class EntranceDriefService{
    private entranceDriefRepository:EntranceDriefRepository;
    private productRepository:ProductRepository;
    private warehouseDriefRepository:WarehouseDriefRepository;
    constructor(private firebaseHelper:FirebaseHelper){
        this.entranceDriefRepository = new EntranceDriefRepository();
        this.productRepository = new ProductRepository();
        this.warehouseDriefRepository = new WarehouseDriefRepository();
    }


    async saveEntranceDrief(entranceDriefDTO:EntranceDriefDTO, req:Request){
        
        if(!entranceDriefDTO.expiration== null) throw new Error("[400],el parametro expiration es requerido");
        if(!entranceDriefDTO.lotProveedor) throw new Error("[400],el parametro loteProveedor es requerido");
        if(!entranceDriefDTO.odor==null) throw new Error("[400],el parametro odor es requerido");
        if(!entranceDriefDTO.paking==null) throw new Error("[400],el parametro packing es requerido");
        if(!entranceDriefDTO.productId) throw new Error("[400],el parametro productId es requerido");
        if(!entranceDriefDTO.proveedorid) throw new Error("[400],el parametro proveedorId es requerido");
        if(entranceDriefDTO.quality == null) throw new Error("[400],el parametro quality es requerido");
        if(entranceDriefDTO.strangeMaterial == null) throw new Error("[400],el parametro strangeMaterial es requerido");
        if(entranceDriefDTO.texture == null) throw new Error("[400],el parametro texture es requerido");
        if(entranceDriefDTO.transport == null) throw new Error("[400],el parametro transport es requerido");
        if(entranceDriefDTO.weight == null) throw new Error("[400],el parametro weight es requerido");
        if(entranceDriefDTO.color == null) throw new Error("[400],el parametro color es requerido");
        if(entranceDriefDTO.date == null) throw new Error("[400],el parametro date es requerido");

        let product:Product = await this.productRepository.getProductById(entranceDriefDTO.productId);
        if(!product) throw new Error("[400], el producto a recibir no existe");
        
        let entranceDrief:EntranceDrief = new EntranceDrief();
        
        entranceDrief.date=entranceDriefDTO.date; 
        entranceDrief.expiration=entranceDriefDTO.expiration;
        entranceDrief.loteProveedor=entranceDriefDTO.lotProveedor;
        entranceDrief.paking=entranceDriefDTO.paking;
        entranceDrief.product=product;
        entranceDrief.proveedor= entranceDriefDTO.proveedorid;
        entranceDrief.quality=entranceDriefDTO.quality;
        entranceDrief.quantity=entranceDriefDTO.quantity;
        entranceDrief.strangeMaterial=entranceDriefDTO.strangeMaterial;
        entranceDrief.texture=entranceDriefDTO.texture;
        entranceDrief.transport=entranceDriefDTO.transport;
        entranceDrief.weight = entranceDriefDTO.weight;
        entranceDrief.color = entranceDriefDTO.color;
        entranceDrief.isPz = entranceDriefDTO.isPz;
        entranceDrief.observations = entranceDriefDTO.observations;
        entranceDrief.odor = entranceDriefDTO.odor;

        if(entranceDriefDTO.quality==true && entranceDriefDTO.expiration==true && entranceDriefDTO.transport==true
            && entranceDriefDTO.strangeMaterial==true && entranceDriefDTO.paking==true && entranceDriefDTO.color==true &&
            entranceDriefDTO.texture==true && entranceDriefDTO.weight==true && entranceDriefDTO.odor==true){

                let warehouseDrief:WarehouseDrief = new WarehouseDrief();
        
                warehouseDrief.userId = req.headers.uid as string;
                warehouseDrief.date= entranceDriefDTO.date;
                warehouseDrief.isPz = entranceDriefDTO.isPz;
                warehouseDrief.loteProveedor = entranceDriefDTO.lotProveedor;
                warehouseDrief.observations = entranceDriefDTO.observations;
                warehouseDrief.product = product;
                warehouseDrief.quantity = entranceDriefDTO.quantity;
                warehouseDrief.status = WarehouseStatus.PENDING
                await this.warehouseDriefRepository.saveWarehouseDrief(warehouseDrief);
            }

        
        let entranceDriefSaved:EntranceDrief=await this.entranceDriefRepository.saveDrief(entranceDrief);
    
        return entranceDriefSaved.id;
    }

    async reportEntranceDrief(driefId:number){
        if(!driefId) throw new Error("[400], driefId is required");
        let drief:EntranceDrief = await this.entranceDriefRepository.getEntranceDriefById(driefId);
        if(!drief) throw new Error("[404], not found");
        return drief;
    }

    async reportEntrancesDriefs(dateInit:string,dateEnd:string){
        if(!dateInit) throw new Error(`[400], initDate is required in query`);
        if(!dateEnd) throw new Error(`[400], finalDate is required in query`);
        if (!Date.parse(dateInit)) throw new Error("[400], initDate has not a valid value");
        if (!Date.parse(dateEnd)) throw new Error("[400], finDate has not a valid value");
        if(Date.parse(dateInit)>Date.parse(dateEnd)) throw new Error(`[400], initDate cannot be greater than finalDate`);
        let driefs:EntranceDrief[]= await this.entranceDriefRepository.getEntrancesDriefs(dateInit,dateEnd);

        if(!driefs.length)
        throw new Error("[404], No Entrances driefs found, can not generate report");

        return driefs;
    }
}