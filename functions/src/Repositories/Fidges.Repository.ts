import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Fidges } from '../Models/Entity/Fidges';
export class FidgesRepository{
    private fidgesRepository:Repository<Fidges>;

    async getConnection(){
        if(!this.fidgesRepository){
            this.fidgesRepository = (await connect()).getRepository(Fidges);
        }
    }

    async saveFidges(fidges:Fidges){
        await this.getConnection();
        return await this.fidgesRepository.save(fidges);
    }
}