import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
export class DriefRepository{
    private driefRepository:Repository<EntranceDrief>;

    async getConnection(){
        if(!this.driefRepository){
            this.driefRepository = (await connect()).getRepository(EntranceDrief);
        }
    }

    async createEntrancesDrief(entrances_drief:EntranceDrief){
        await this.getConnection();
        return await this.driefRepository.save(entrances_drief);
    }

}