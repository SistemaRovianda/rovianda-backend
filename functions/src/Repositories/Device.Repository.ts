import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Devices } from '../Models/Entity/Devices';

export class DeviceRepository{
    private deviceRepository:Repository<Devices>;

    async getConnection(){
        if(!this.deviceRepository){
            this.deviceRepository = (await connect()).getRepository(Devices);
        }
    }

    async saveDevice(device:Devices){
        await this.getConnection();
        return await this.deviceRepository.save(device);
    }

    async getDeviceById(id:number){
        await this.getConnection();
        return await this.deviceRepository.findOne({id})
    }

    async getDeviceByName(name:string){
        await this.getConnection();
        return await this.deviceRepository.findOne({name})
    }

    async getLastDevice(){
        await this.getConnection();
        console.log("consulta")
        return await this.deviceRepository.findOne({ 
            order : {  
                id:"DESC" 
                } 
        });
    }
    
}