import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
<<<<<<< HEAD
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
export class DriefRepository{
    private driefRepository:Repository<EntranceDrief>;

    async getConnection(){
        if(!this.driefRepository){
            this.driefRepository = (await connect()).getRepository(EntranceDrief);
        }
    }

    async createEntrancesDrief(entrances_drief:EntranceDrief){
=======
import { EntrancesDrief } from '../Models/Entity/Entrances.Drief';
export class DriefRepository{
    private driefRepository:Repository<EntrancesDrief>;

    async getConnection(){
        if(!this.driefRepository){
            this.driefRepository = (await connect()).getRepository(EntrancesDrief);
        }
    }

    async createEntrancesDrief(entrances_drief:EntrancesDrief){
>>>>>>> 34.-GET-oven-products
        await this.getConnection();
        return await this.driefRepository.save(entrances_drief);
    }

}