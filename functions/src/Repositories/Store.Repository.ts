import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Store } from '../Models/Entity/Store';

export class StoreRepository{
    private storeRepository:Repository<Store>;

    async getConnection(){
        if(!this.storeRepository){
            this.storeRepository = (await connect()).getRepository(Store);
        }
    }

    async saveStore(store:Store){
        await this.getConnection();
        return await this.storeRepository.save(store);
    }

    async getStoreById(id:number){
        await this.getConnection();
        return await this.storeRepository.findOne({id})
    }

    async getMaintenanceStore(){
        await this.getConnection();
        return await this.storeRepository.createQueryBuilder("store")
    .innerJoin("store.maintenance", "storeMaintenance")
    .select("store.name","store")
    .addSelect("store.address","location")
    .addSelect("SUM(storeMaintenance.cost)", "costTotal")
    .groupBy("store.id")
    .getRawMany();
    }
  
    async getStoreByName(name:string){
        await this.getConnection();
        return await this.storeRepository.findOne({name});
    }
}