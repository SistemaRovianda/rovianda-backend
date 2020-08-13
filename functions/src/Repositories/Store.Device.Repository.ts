import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { StoreDevice } from '../Models/Entity/Store.Devices';
import { Devices } from '../Models/Entity/Devices';
import { Store } from '../Models/Entity/Store';

export class StoreDeviceRepository{
    private storeDeviceRepository:Repository<StoreDevice>;

    async getConnection(){
        if(!this.storeDeviceRepository){
            this.storeDeviceRepository = (await connect()).getRepository(StoreDevice);
        }
    }

    async saveStoreDevice(storeDevice:StoreDevice){
        await this.getConnection();
        return await this.storeDeviceRepository.save(storeDevice);
    }

    async getStoreDeviceById(id:number){
        await this.getConnection();
        return await this.storeDeviceRepository.findOne({id})
    }

    async getStoreDeviceByDevice(devices:Devices){
        await this.getConnection();
        return await this.storeDeviceRepository.findOne({devices})
    }

    async getStoreDeviceByStore(store:Store){
        await this.getConnection();
        return await this.storeDeviceRepository.findOne({store})
    }

    async getStoreDevicesByStore(store:Store){
        await this.getConnection();
        return await this.storeDeviceRepository.find({store})
    }

    async getByStoreDevice(storeId:number,devicesId:number){
        await this.getConnection();
        return await this.storeDeviceRepository.query(`
        SELECT * FROM store_devices WHERE store_id = ${storeId} 
        AND device_id = ${devicesId}`);
    }
    
}