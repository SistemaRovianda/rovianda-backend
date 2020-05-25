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

    async getCoolingByLote(loteProveedor:string){
        await this.getConnection();
        return await this.coolingRepository.findOne({loteProveedor});
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

    async getCoollingByFridgeGroup(fridgeId:number){
        await this.getConnection();
        return await this.coolingRepository.query(`
        SELECT * FROM cooling WHERE cooling.fridgeFridgeId = ${fridgeId} GROUP BY cooling.lote_interno`);
    }

    async getCoollingByFridge(loteInterno:string,fridgeId:number){
        await this.getConnection();
        return await this.coolingRepository.query(`
        SELECT cooling.id, cooling.raw_material, cooling.lote_interno, 
        cooling.fridgeFridgeId, fridges.temp 
        FROM cooling 
        INNER JOIN fridges 
        ON fridges.fridge_id = cooling.fridgeFridgeId 
        WHERE cooling.lote_interno = "${loteInterno}" AND cooling.fridgeFridgeId = ${fridgeId}`);
    }
}