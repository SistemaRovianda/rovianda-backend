import { CoolingRepository } from "../Repositories/Cooling.Repository";
import { Cooling } from '../Models/Entity/Cooling';

import { ProductRepository } from "../Repositories/Product.Repository";
import { Fridge } from "../Models/Entity/Fridges";
import { FridgeRepository } from "../Repositories/Fridges.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { WarehouseCollingDTO } from "../Models/DTO/WarehouseDTO";

export class CoolingService{
    private coolingRepository:CoolingRepository;
    private productRepository:ProductRepository;
    private fridgeRepository:FridgeRepository;
    constructor(){
        this.coolingRepository = new CoolingRepository();
        this.productRepository = new ProductRepository();
        this.fridgeRepository = new FridgeRepository();
    }

    async updateStatus(coolingDTO:WarehouseCollingDTO){
        // let product = await this.productRepository.getProductById(coolingDTO.productId);
        // if(!product) throw new Error("[404], producto no existe");
        let fridge = await this.fridgeRepository.getFridgeById(coolingDTO.fridgeId);
        if(!fridge[0]) throw new Error("[404], refrigerador no existe");
        let lote:Cooling = await this.coolingRepository.getCoolingByLote(coolingDTO.loteId);
        if(!lote) throw new Error("[404],el lote no existe");
    
        switch(coolingDTO.status){
            case WarehouseStatus.CLOSED:
                lote.status = WarehouseStatus.CLOSED;
                lote.closingDate = coolingDTO.date;
                break;
            case WarehouseStatus.OPENED:
                lote.status = WarehouseStatus.OPENED;
                lote.openingDate = coolingDTO.date;
                break;
            default:
                throw new Error("[400], estatus no valido");
                break;
        }
        await this.coolingRepository.saveCooling(lote);

    }

    async createCooling(cooling:Cooling){
        return await this.coolingRepository.saveCooling(cooling);
    }
    
    async getCoolingById(id:number){
        return await this.coolingRepository.getCoolingById(id);
    }

    
    async getCoollingByStatus(status:string){
        return await this.coolingRepository.getCoollingByStatus(status);
    }
}