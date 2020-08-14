import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { Raw } from '../Models/Entity/Raw';
export class OutputsCoolingRepository{
    private outputsCoolingRepository:Repository<OutputsCooling>;

    async getConnection(){
        if(!this.outputsCoolingRepository){
            this.outputsCoolingRepository = (await connect()).getRepository(OutputsCooling);
        }
    }

    async createOutputsCooling(outputsCooling:OutputsCooling){
        await this.getConnection();
        return await this.outputsCoolingRepository.save(outputsCooling);
    }

    async getAllOutputsCooling(){
        await this.getConnection();
        return await this.outputsCoolingRepository.find();
    }

    async getOutputsCoolingById(id:number){
        await this.getConnection();
        return await this.outputsCoolingRepository.findOne({id})
    }

    async getOutputsCoolingByLot(loteInterno:string){
        await this.getConnection();
        return await this.outputsCoolingRepository.findOne({loteInterno});
    }

    async getOutputsCoolingByStatus(status:string){
        await this.getConnection();
        return await this.outputsCoolingRepository.find({status});
    }

    async getOutputsCoolingByRaw(rawMaterial:Raw){
        await this.getConnection();
        return await this.outputsCoolingRepository.find({rawMaterial});
    }

    async getByStatusAndLoteInterno(lote:string,status:string){
        await this.getConnection();
        return await this.outputsCoolingRepository.query(`
        SELECT * FROM outputs_cooling 
        WHERE lote_interno = "${lote}" 
        AND status = "${status}"`);
    }
    
}