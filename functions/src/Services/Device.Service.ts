import { DeviceRepository } from '../Repositories/Device.Repository';
import { StoreRepository } from '../Repositories/Store.Repository';
import { StoreDeviceRepository } from '../Repositories/Store.Device.Repository';
import { Devices } from '../Models/Entity/Devices';
import { Store } from '../Models/Entity/Store';
import { StoreDevice } from '../Models/Entity/Store.Devices';
import { DeviceDTO } from '../Models/DTO/DeviceDTO';

export class DeviceService{
    private deviceRepository:DeviceRepository;
    private storeRepository:StoreRepository;
    private storeDeviceRepository:StoreDeviceRepository;
    constructor(){
        this.deviceRepository = new DeviceRepository();
        this.storeRepository = new StoreRepository();
        this.storeDeviceRepository = new StoreDeviceRepository();
    }

    async saveDevice(deviceDTO:DeviceDTO){
        if(!deviceDTO.name) throw new Error("[400], falta el parametro name");
        if(!deviceDTO.model) throw new Error("[400], falta el parametro model");
        if(!deviceDTO.costDevice) throw new Error("[400], falta el parametro costDevice");
        if(!deviceDTO.storeId) throw new Error("[400], falta el parametro storeId");
        if(!deviceDTO.date) throw new Error("[400], falta el parametro date");
        if(!deviceDTO.description) throw new Error("[400], falta el parametro description");
        let store:Store = await this.storeRepository.getStoreById(deviceDTO.storeId);
        if(!store) throw new Error("[404], no se encontro tienda");
        let device:Devices = await this.deviceRepository.getDeviceByName(deviceDTO.name,deviceDTO.model)
        console.log(device)
        let storeDevice:StoreDevice = new StoreDevice();
        if(device){
            let devieStore = await this.storeDeviceRepository.getByStoreDevice(deviceDTO.storeId,device.id);
            console.log(devieStore)
            if(!devieStore[0]){
                console.log(device);
                storeDevice.devices = device;
                storeDevice.store = store;
                return await this.storeDeviceRepository.saveStoreDevice(storeDevice);
            }else{
                throw new Error("[404], El aparato ya esta registrado en la tienda");
            }
        }else{
            let saveDevice:Devices = new Devices();
            saveDevice.name = deviceDTO.name;
            saveDevice.model = deviceDTO.model;
            saveDevice.costDevice = deviceDTO.costDevice.toString();
            saveDevice.date = deviceDTO.date;
            saveDevice.description = deviceDTO.description;
            await this.deviceRepository.saveDevice(saveDevice);
            let lastDevice:Devices = await this.deviceRepository.getLastDevice();
            console.log(lastDevice);
            storeDevice.store = store;
            storeDevice.devices = lastDevice;
            return await this.storeDeviceRepository.saveStoreDevice(storeDevice);
        }
    }

}