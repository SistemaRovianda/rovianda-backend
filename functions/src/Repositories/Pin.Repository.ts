import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Pin } from '../Models/Entity/Pin';
export class PinRepository{
    private pinRepository:Repository<Pin>;

    async getConnection(){
        if(!this.pinRepository){
            this.pinRepository = (await connect()).getRepository(Pin);
        }
    }

    async getAllPins(){
        await this.getConnection();
        return await this.pinRepository.find();
    }
}