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

    async saveDevice(storeDevice:StoreDevice){
        await this.getConnection();
        return await this.storeDeviceRepository.save(storeDevice);
    }

    async getCoolingById(id:number){
        await this.getConnection();
        return await this.storeDeviceRepository.findOne({id})
    }

    async getCoolingByDevice(devices:Devices){
        await this.getConnection();
        return await this.storeDeviceRepository.findOne({devices})
    }

    async getCoolingByStore(store:Store){
        await this.getConnection();
        return await this.storeDeviceRepository.findOne({store})
    }

    async getCoolingByStoreDevice(store:Store,devices:Devices){
        await this.getConnection();
        return await this.storeDeviceRepository.findOne({store,devices})
    }
    
}