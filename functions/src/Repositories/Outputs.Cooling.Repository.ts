import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
export class OutputsCoolingRepository{
    private outputsCoolingRepository:Repository<OutputsCooling>;

    async getConnection(){
        if(!this.outputsCoolingRepository){
            this.outputsCoolingRepository = (await connect()).getRepository(OutputsCooling);
        }
    }

    async getAllOutputsCooling(){
        await this.getConnection();
        return await this.outputsCoolingRepository.find();
    }

    async getOutputsCoolingById(id:number){
        await this.getConnection();
        return await this.outputsCoolingRepository.findOne({id})
    }

    async getOutputsCoolingByLot(lot:string){
        await this.getConnection();
        return await this.outputsCoolingRepository.findOne({
            where: {lote_interno: `${lot}`},
        });
    }
}