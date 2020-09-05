import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Cooling } from '../Models/Entity/Cooling';
export class CoolingRepository{
    private coolingRepository:Repository<Cooling>;

    async getConnection(){
        if(!this.coolingRepository){
            this.coolingRepository = (await connect()).getRepository(Cooling);
        }
    }

    async getCoolingByLote(loteInterno:string){
        await this.getConnection();
        return await this.coolingRepository.findOne({loteInterno});
    }

    async saveCooling(cooling:Cooling){
        await this.getConnection();
        return await this.coolingRepository.save(cooling);
    }

    async getCoolingById(id:number){
        await this.getConnection();
        return await this.coolingRepository.findOne({id})
    }

    async getCoollingByStatus(status:string){
        await this.getConnection();
        return await this.coolingRepository.find({
            where: {status: `${status}`},
        });
    }

    async getCoollingByFridgeGroup(fridgeId:number,status:string){
        await this.getConnection();
        return await this.coolingRepository.query(`
        SELECT * FROM cooling WHERE cooling.fridgeFridgeId = ${fridgeId} 
        AND cooling.status = "${status}" GROUP BY cooling.lote_interno`);
    }

    async getCoollingByFridge(loteInterno:string,fridgeId:number,status:string){
        await this.getConnection();
        return await this.coolingRepository.query(`
        SELECT cooling.id, raw.raw_material, cooling.lote_interno, 
        cooling.fridgeFridgeId, fridges.temp 
        FROM cooling 
        INNER JOIN fridges 
        ON fridges.fridge_id = cooling.fridgeFridgeId 
        INNER JOIN raw 
        ON raw.id = cooling.raw_material_id 
        WHERE cooling.lote_interno = "${loteInterno}" AND cooling.status = "${status}" AND cooling.fridgeFridgeId = ${fridgeId}`);
    }

    async getCollingByLotInterno(loteInterno:string){
        await this.getConnection();
        return await this.coolingRepository.find({
            where: {loteInterno: `${loteInterno}`},
        });
    }

    async getCoolingByStatusOpenClose(){
        await this.getConnection();
        return await this.coolingRepository.query(`
        SELECT * FROM cooling 
        WHERE status = "OPENED" 
        OR status = "CLOSED"
        `);
    }


    async getCoolingByFridgeId(fridgeId:number){
        await this.getConnection();
        return await this.coolingRepository.findOne({
            where:{ fridge:`${fridgeId}`} 
        });
    }

    async getCoolingByLotInter(loteInterno:string){
        await this.getConnection();
        return await this.coolingRepository.find({loteInterno})
    }

}