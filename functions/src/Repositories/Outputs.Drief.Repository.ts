import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { OutputsDrief } from '../Models/Entity/Outputs.Drief';
export class OutputsDriefRepository{
    private outputsDriefRepository:Repository<OutputsDrief>;

    async getConnection(){
        if(!this.outputsDriefRepository){
            this.outputsDriefRepository = (await connect()).getRepository(OutputsDrief);
        }
    }

    async createOutputsDrief(outputsDrief:OutputsDrief){
        await this.getConnection();
        return await this.outputsDriefRepository.save(outputsDrief);
    }

    async getAllOutputsDrief(){
        await this.getConnection();
        return await this.outputsDriefRepository.find();
    }

    async getOutputsDriefById(id:number){
        await this.getConnection();
        return await this.outputsDriefRepository.findOne({id})
    }

    async getOutputsDriefByLot(lot:string){
        await this.getConnection();
        return await this.outputsDriefRepository.findOne({
            where: {lote_proveedor: `${lot}`},
        });
    }
}