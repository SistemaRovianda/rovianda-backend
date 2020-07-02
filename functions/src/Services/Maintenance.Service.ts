import { MaintenanceRepository } from "../Repositories/Maintenance.Repository";
import { Maintenance } from '../Models/Entity/Maintenance';
import { MaintenanceDTO } from '../Models/DTO/MaintenanceDTO';
import { UserRepository } from "../Repositories/User.Repository";
import { Store } from "../Models/Entity/Store";
import { StoreRepository } from "../Repositories/Store.Repository";

export class MaintenanceService{
    private maintenanceRepository:MaintenanceRepository;
    private userRepository:UserRepository;
    private storeRepository:StoreRepository;
    constructor(){
        this.maintenanceRepository = new MaintenanceRepository();
        this.userRepository = new UserRepository();
        this.storeRepository = new StoreRepository();
    }

    async getAllMaintenance(){
        let maintenance:Maintenance[] = await this.maintenanceRepository.getAllMaintenance();
        let response = [];
        maintenance.forEach(i => {
            response.push({
                titleFailure: `${i.title}`,
                date: `${i.dateInit}`,
                image: `${i.picture}`,
                description: `${i.description}`
              }
            );
        });
        return response;
    }

    async createMaintenance(maintenanceDTO:MaintenanceDTO){

        if (!maintenanceDTO.dateInit)  throw new Error("[400],dateInit is required");
        if (!maintenanceDTO.description)  throw new Error("[400],description is required");
        if (!maintenanceDTO.fullName)  throw new Error("[400],fullName is required");
        if (!maintenanceDTO.typeFailure)  throw new Error("[400],typeFailure is required");

        let cadena = maintenanceDTO.fullName.split(" ");
        let user = await this.userRepository.getByFullName(cadena[0],cadena[1],cadena[2])
        if (!user[0])  throw new Error("[404],User not found");

        let maintenance : Maintenance = new Maintenance();
        maintenance.dateInit = maintenanceDTO.dateInit;
        maintenance.description = maintenanceDTO.description;
        maintenance.title = maintenanceDTO.typeFailure;
        maintenance.user = user[0];

        await this.maintenanceRepository.createMaintenance(maintenance);
    }

    async getMaintenanceByStore(store:string){
        if (!store) throw new Error("[400],store is required");
        let getStore:Store = await this.storeRepository.getStoreByName(store);
        if (!getStore) throw new Error("[404],store not found");
        let response:any = [];
        let maintenanceGroupByStore:any = await this.maintenanceRepository.getMaintenanceByStoreId(getStore.id);
        for(let i = 0; i<maintenanceGroupByStore.length; i++){
            console.log(maintenanceGroupByStore[i]);
            let maintenance = await this.maintenanceRepository.getMaintenanceByStoreIdDeviceID(getStore.id,+maintenanceGroupByStore[i].device_id);
            console.log(maintenance);
            let costTotal:number = 0;
            for(let e = 0; e<maintenance.length; e++){
                costTotal = costTotal + parseInt(maintenance[e].cost);
            }
            response.push({
                cost: costTotal,
                objectRepaired: `${maintenanceGroupByStore[i].name}`
            })
        }
        return response;
    }

    async getMaintenanceMounth(){
    let response=  await this.maintenanceRepository.getMaintenanceMounth();
    console.log(response[0].RowDataPacket);
    return response
    }
}