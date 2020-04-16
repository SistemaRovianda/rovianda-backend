import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { OutputsPacking } from '../Models/Entity/Outputs.Packing';
export class OutputsPackingRepository{
    private outputsPackingRepository:Repository<OutputsPacking>;

    async getConnection(){
        if(!this.outputsPackingRepository){
            this.outputsPackingRepository = (await connect()).getRepository(OutputsPacking);
        }
    }

    async createOutputsPacking(outputsPacking:OutputsPacking){
        await this.getConnection();
        return await this.outputsPackingRepository.save(outputsPacking);    
    }

    async getAllOutputsPacking(){
        await this.getConnection();
        return await this.outputsPackingRepository.find();
    }

    async getOutputsPackingById(id:number){
        await this.getConnection();
        return await this.outputsPackingRepository.findOne({id})
    }

    async getOutputsPackingByLot(lot:string){
        await this.getConnection();
        return await this.outputsPackingRepository.findOne({
            where: {lote_proveedor: `${lot}`},
        });
    }
}