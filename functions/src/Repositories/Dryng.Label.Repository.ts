import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { DryingLabel } from '../Models/Entity/Dryng.Label';
export class DryngLabelRepository{
    private dryngLabekRepository:Repository<DryingLabel>;

    async getConnection(){
        if(!this.dryngLabekRepository){
            this.dryngLabekRepository = (await connect()).getRepository(DryingLabel);
        }
    }

    async createDryngLabel(dryingLabel:DryingLabel){
        await this.getConnection();
        return await this.dryngLabekRepository.save(dryingLabel);
    }

    async getDryngLabelById(id:number){
        await this.getConnection();
        return await this.dryngLabekRepository.findOne(id);
    }

}