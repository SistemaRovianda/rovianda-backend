import { MaintenanceRepository } from "../Repositories/Maintenance.Repository";
import { Maintenance } from '../Models/Entity/Maintenance';
import { response } from 'express';
import { MaintenanceDTO,MaintenanceUpdateDTO } from '../Models/DTO/MaintenanceDTO';
import { UserRepository } from "../Repositories/User.Repository";
import { Store } from "../Models/Entity/Store";
import { StoreRepository } from "../Repositories/Store.Repository";
import { Devices } from "../Models/Entity/Devices";
import { DeviceRepository } from "../Repositories/Device.Repository";
import { FirebaseHelper } from "../Utils/Firebase.Helper";
import { File } from "../Models/Entity/Files";
import { StoreDevice } from "../Models/Entity/Store.Devices";
import { StoreDeviceRepository } from "../Repositories/Store.Device.Repository";

export class MaintenanceService{
    private maintenanceRepository:MaintenanceRepository;
    private userRepository:UserRepository;
    private storeRepository:StoreRepository;
    private deviceRepository:DeviceRepository;
    private storeDeviceRepository:StoreDeviceRepository;
    constructor(private firebaseHelper: FirebaseHelper){
        this.maintenanceRepository = new MaintenanceRepository();
        this.userRepository = new UserRepository();
        this.storeRepository = new StoreRepository();
        this.deviceRepository = new DeviceRepository();
        this.storeDeviceRepository = new StoreDeviceRepository();
    }

    async getAllMaintenance(){
        let maintenance:Maintenance[] = await this.maintenanceRepository.getAllMaintenance();
        let response = [];
        maintenance.forEach(i => {
            response.push({
                titleFailure: `${i.title}`,
                date: `${i.date}`,
                image: `${i.picture}`,
                description: `${i.description}`,
                maintenanceId: `${i.id}`,
                userId: `${i.user.id}`,
                user: `${i.user.name} ${i.user.firstSurname} ${i.user.lastSurname}`
              }
            );
        });
        return response;
    }

    async getMaintenanceById(maintenanceId:number){
        if (!maintenanceId)  throw new Error("[400],maintenanceId is required");
        let maintenance:Maintenance = await this.maintenanceRepository.getMaintenanceById(maintenanceId);
        if (!maintenance)  throw new Error("[404],maintenance not found");
        let response = {
            titleFailure: `${maintenance.title}`,
            date: `${maintenance.date}`,
            image: `${maintenance.picture}`,
            description: `${maintenance.description}`,
            maintenanceId: `${maintenance.id}`,
            userId: `${maintenance.user.id}`,
            user: `${maintenance.user.name} ${maintenance.user.firstSurname} ${maintenance.user.lastSurname}`
        }
        return response
    }

    async createMaintenance(maintenanceDTO:MaintenanceDTO){

        if (!maintenanceDTO.dateInit)  throw new Error("[400],name is required");
        if (!maintenanceDTO.description)  throw new Error("[400],description is required");
        if (!maintenanceDTO.fullName)  throw new Error("[400],fullName is required");
        if (!maintenanceDTO.typeFailure)  throw new Error("[400],typeFailure is required");
        if (!maintenanceDTO.image)  throw new Error("[400],image is required");

        let cadena = maintenanceDTO.fullName.split(" ");
        let user = await this.userRepository.getByFullName(cadena[0],cadena[1],cadena[2])
        if (!user[0])  throw new Error("[404],User not found");

        let photo = Buffer.from(maintenanceDTO.image, 'base64');
        let urlOfImage: string = await this.firebaseHelper.uploadImage(`${maintenanceDTO.dateInit.replace(/\//g, "")}/${maintenanceDTO.typeFailure}/`, photo);

        let maintenance : Maintenance = new Maintenance();
        maintenance.date = maintenanceDTO.dateInit;
        maintenance.description = maintenanceDTO.description;
        maintenance.title = maintenanceDTO.typeFailure;
        maintenance.user = user[0];
        maintenance.status = "OPENED";
        maintenance.picture = urlOfImage;

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
        return response

    }
    async uppdateMaintenance(maintenanceId:number,maintenanceUpdateDTO:MaintenanceUpdateDTO){
        if (!maintenanceUpdateDTO.description)  throw new Error("[400],description is required");
        if (!maintenanceUpdateDTO.image)  throw new Error("[400],image is required");
        if (!maintenanceUpdateDTO.storeId)  throw new Error("[400],storeId is required");
        if (!maintenanceUpdateDTO.cost)  throw new Error("[400],cost is required");
        if (!maintenanceUpdateDTO.description)  throw new Error("[400],description is required");
        if (!maintenanceUpdateDTO.deviceId)  throw new Error("[400],deviceId is required");
        if (!maintenanceId)  throw new Error("[400],maintenanceId is required");;
        let store:Store = await this.storeRepository.getStoreById(maintenanceUpdateDTO.storeId);
        if (!store)  throw new Error("[404],store not found");
        let device:Devices = await this.deviceRepository.getDeviceById(maintenanceUpdateDTO.deviceId);
        if (!device)  throw new Error("[404],device not found");
        let maintenance = await this.maintenanceRepository.getMaintenanceById(maintenanceId);
        if (!maintenance)  throw new Error("[404],maintenance not found");
        let photo = Buffer.from(maintenanceUpdateDTO.image, 'base64');
        let urlOfImage: string = await this.firebaseHelper.uploadImage(`${maintenanceUpdateDTO.description}/${maintenanceId}/`, photo);
    
        maintenance.descriptionEnd = maintenanceUpdateDTO.description;
        maintenance.picture = urlOfImage;
        maintenance.store = store;
        maintenance.cost = maintenanceUpdateDTO.cost.toString();
        maintenance.status = "CLOSED";
        maintenance.devices = device;

        await this.maintenanceRepository.createMaintenance(maintenance);
    }

    async getMaintenanceByMounth(mounth:string){    

        if(parseInt(mounth)<=0 || parseInt(mounth)>12)throw new Error("[400],Invalid mounth");
        return await this.maintenanceRepository.getMaintenanceByMounth(mounth);
    }

    async getMaintenanceObject(dateInit:string,dateEnd:string){    
        if(!dateInit)throw new Error("[400],dateInit in query is required");
        if(!dateEnd)throw new Error("[400],dateEnd in query is required");
        return await this.maintenanceRepository.getMaintenanceObject(dateInit,dateEnd);
    }

    async getMaintenanceByObject(dateInit:string,dateEnd:string,object:string){    
        if(!dateInit)throw new Error("[400],dateInit in query is required");
        if(!dateEnd)throw new Error("[400],dateEnd in query is required");
        if(!object)throw new Error("[400],object in path is required");

        let maintenanceObject = await this.maintenanceRepository.getMaintenanceByObjectName(object);
        if(!maintenanceObject)throw new Error(`[400],object ${object} not found`);

        return await this.maintenanceRepository.getMaintenanceByObject(dateInit,dateEnd,object);

    }

    async getMaintenanceApparatus(dateInit:string,dateEnd:string){    
        if(!dateInit)throw new Error("[400],dateInit in query is required");
        if(!dateEnd)throw new Error("[400],dateEnd in query is required");

        return await this.maintenanceRepository.getMaintenanceApparatus(dateInit,dateEnd);
    }

    async getMaintenanceApparatusByMounth(mounth:string){    
        if(!mounth)throw new Error("[400],dateInit in query is required");
        if(parseInt(mounth)<=0 || parseInt(mounth)>12)throw new Error("[400],Invalid mounth");
        return await this.maintenanceRepository.getMaintenanceApparatusByMounth(mounth);
    }

    async getMaintenanceByWeek(week:string){    
        if(!week)throw new Error("[400],week in path is required");
        if(parseInt(week)<0 || parseInt(week)>53)throw new Error("[400],Invalid week");
        return await this.maintenanceRepository.getMaintenanceByWeek(week);
    }

    async getAllDevicesStore(){
        let store:Store[] = await this.storeRepository.getStores();
        let response:any = [];
        for(let i = 0; i < store.length; i++){
            let storeDevice:StoreDevice[] = await this.storeDeviceRepository.getStoreDevicesByStore(store[i]);
            let response2:any = [];
            for(let e = 0; e < storeDevice.length; e++){
                //console.log(storeDevice);
                response2.push({
                    id: `${storeDevice[e].devices.id}`,
                    name: `${storeDevice[e].devices.name}`,
                    model: `${storeDevice[e].devices.model}`,
                    cost: `${storeDevice[e].devices.costDevice}`,
                    description: `${storeDevice[e].devices.description}`
                })
            }
            response.push({
                storeId: `${store[i].id}`,
                name: `${store[i].name}`,
                devices: response2
            })
        }
        return response;
    }

    async getStoreMaintenance(dateIni:string,dateFin:string){
        if(!dateIni)throw new Error("[400],dateIni in query is required");
        if(!dateFin)throw new Error("[400],dateEnd in query is required");
        let response:any = [];
        let manintenance = await this.maintenanceRepository.getMaintenanceByDates(dateIni,dateFin);
        for(let i = 0; i < manintenance.length; i++){
            let aDevice:any = [];
            let storeMa = await this.maintenanceRepository.getMaintenanceByDatesStore(dateIni,dateFin,manintenance[i].store_id);
            for(let e = 0; e < storeMa.length; e++){
                let device:Devices = await this.deviceRepository.getDeviceById(+storeMa[e].device_id);
                aDevice.push({
                    deviceId: device.id,
                    name: device.name,
                    costMaintenance: storeMa[e].cost
                })
            }
            let store:Store = await this.storeRepository.getStoreById(+manintenance[i].store_id)
            response.push({
                storeId: store.id,
                store: store.name,
                devices: aDevice
            })
        }
        return response
    }
}