import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Reprocessing } from '../Models/Entity/Reprocessing';
import { Defrost } from '../Models/Entity/Defrost';
import { Process } from '../Models/Entity/Process';


export class ReprocessingRepository{
    private reprocessingRepository:Repository<Reprocessing>;

    async getConnection(){
        if(!this.reprocessingRepository){
            this.reprocessingRepository = (await connect()).getRepository(Reprocessing);
        }
    }
    async saveRepocessing(reprocessing:Reprocessing){
        await this.getConnection();
        return await this.reprocessingRepository.save(reprocessing);
    }

    async getByProcess(process:Process){
        await this.getConnection();
        return await this.reprocessingRepository.find({process});
    }
    async getReprocessingById(id:number){
        await this.getConnection();
        return await this.reprocessingRepository.findOne({id})
    }

    async getByDefrost(defrost:Defrost){
        await this.getConnection();
        return await this.reprocessingRepository.find({defrost});
    }

    async getAllReprocesingActive(){
        await this.getConnection();
        return await this.reprocessingRepository.find({active:true});
    }

    async getByNewLote(newLote:string){
        await this.getConnection();
        return await this.reprocessingRepository.find({packagingReprocesingOvenLot:newLote});
    }

    async getAllHistoryOfOvenIds(ovenIds:number[]){
        await this.getConnection();
        let ids="(";
        for(let id of ovenIds){
            ids+=`${id},`;
        }
        ids+=")";
        ids=ids.replace(",)","");
        return await this.reprocessingRepository.query(`
        select re.id,re.date,re.allergens,re.weigth as weight,re.used,re.process_used,re.lot_reprocesing_oven 
        from reprocessing as re right join oven_products as oven on re.lot_reprocesing_oven=oven.new_lote 
        where oven.id in ${ids}
        `);
    }

}