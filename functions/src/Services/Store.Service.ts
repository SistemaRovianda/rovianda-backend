import { StoreRepository } from "../Repositories/Store.Repository";
import { Store } from "../Models/Entity/Store";
import { StoreDTO } from "../Models/DTO/StoreDTO";
import { DeviceRepository } from "../Repositories/Device.Repository";
import { MaintenanceRepository } from "../Repositories/Maintenance.Repository";
import { Maintenance } from "../Models/Entity/Maintenance";

export class StoreService{
    private storeRepository:StoreRepository;
    private maintenanceRepository:MaintenanceRepository;
    constructor(){
        this.storeRepository = new StoreRepository();;
        this.maintenanceRepository= new MaintenanceRepository();
    }

    async saveStore(storeDTO:StoreDTO){
        if(!storeDTO.name) throw new Error("[400], name is required");
        if(!storeDTO.location) throw new Error("[400], location is required");
        let store = new Store();
        store.name = storeDTO.name;
        store.location = storeDTO.location;
        store.reference = storeDTO.reference
        await this.storeRepository.saveStore(store);
        return "registrado";
        
    }
    async getMaintenanceStore(){
        return await this.storeRepository.getMaintenanceStore();
    }

    async getStores(){
        let stores:Store[] = await this.storeRepository.getStores();
        let response:any = [];
        for(let store of stores){
            let maintenances:Maintenance[] = await this.maintenanceRepository.getMaintenanceByStore(store);
            let devices=[];
            let devicesNames = [];
            for(let main of maintenances){
                if(!devicesNames.includes(main.devices.name)){
                devices.push({
                    deviceId:main.devices.id,
                    name: main.devices.name
                });
                devicesNames.push(main.devices.name);
            }
            }
            response.push({
                storeId: store.id,
                name: store.name,
                location: store.location,
                reference: store.reference,
                devices
            });
        
        }
        return response;
    }


}