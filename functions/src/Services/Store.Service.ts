import { StoreRepository } from "../Repositories/Store.Repository";
import { Store } from "../Models/Entity/Store";
import { StoreDTO } from "../Models/DTO/StoreDTO";

export class StoreService{
    private storeRepository:StoreRepository;
    constructor(){
        this.storeRepository = new StoreRepository();;
    }

    async saveStore(storeDTO:StoreDTO){
        if(!storeDTO.name) throw new Error("[400], name is required");
        if(!storeDTO.location) throw new Error("[400], location is required");
        let store = new Store();
        store.name = storeDTO.name;
        store.address = storeDTO.location;
        await this.storeRepository.saveStore(store);
        return "registrado";
        
    }

    async getMaintenanceStore(){
        let maintenanceStore = await this.storeRepository.getMaintenanceStore();
        let response = [];
        maintenanceStore.forEach(i => {
            response.push({
                store: `${i.name}`,
                location: `${i.address}`,
                costTotal: `${i.maintenance[0].cost}`
              }  
            );
        });
        return response;
    }

}