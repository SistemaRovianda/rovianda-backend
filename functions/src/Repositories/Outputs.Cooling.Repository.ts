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
        return await this.outputsCoolingRepository.findOne({id},{relations:["rawMaterial"]})
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
    
    async getOutputsCoolingByLotInter(loteInterno:string){
        await this.getConnection();
        return await this.outputsCoolingRepository.query(`
        SELECT cooling.opening_date as startOutput,
	           outputs_cooling.output_date as endOutput
        FROM cooling 
        INNER JOIN outputs_cooling ON outputs_cooling.lote_interno = cooling.lote_interno
        WHERE cooling.lote_interno = "${loteInterno}"`);
    }

    async getOutputsCoolingByLotInterno(loteInterno:string){
        await this.getConnection();
        return await this.outputsCoolingRepository.find({loteInterno})
    }

    async getOutputCoolingByRawIdAndStatus(status:string,rawMaterialId:number){
        await this.getConnection();
        return await this.outputsCoolingRepository.query(`
        select oc.lote_interno as lotId,oc.quantity,oc.id as outputId from outputs_cooling as oc where oc.status="${status}" and oc.raw_material_id=${rawMaterialId}
        `);  
    }
}