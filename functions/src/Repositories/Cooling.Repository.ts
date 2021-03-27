import {connect} from '../Config/Db';
import { Between, Repository } from 'typeorm';
import { Cooling } from '../Models/Entity/Cooling';
import { Raw } from '../Models/Entity/Raw';
import { Fridge } from '../Models/Entity/Fridges';
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

    async getCoolingByIdAndStatus(id:number,status:string){
        await this.getConnection();
        return await this.coolingRepository.findOne({id,status})
    }

    async getCoollingByStatus(status:string){
        await this.getConnection();
        return await this.coolingRepository.find({
            where: {status: `${status}`},
        });
    }

    async getCoolingByLotInterBetweenDates(lotId:string,loteProveedor:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.coolingRepository.find({
            loteInterno:lotId,openingDate:Between(dateStart,dateEnd),loteProveedor
        });
    }

    async getCoolingByLotInterBetweenDatesHistory(lotId:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.coolingRepository.query(
            `select id as coolingId,opening_date as openingDate,closing_date as closedDate from cooling where lote_interno ="${lotId}" and opening_date between ${dateStart} and ${dateEnd} and status<>"PENDING" ;`
        );
        // return await this.coolingRepository.find({
        //     loteInterno:lotId,openingDate:Between(dateStart,dateEnd)
        // });
    }

    async getCoollingByFridgeGroup(fridgeId:number,status:string){
        await this.getConnection();
        return await this.coolingRepository.query(`
        SELECT lote_interno,id,lote_proveedor,quantity,userId,status,opening_date,closing_date,fridgeFridgeId,raw_material_id 
        FROM cooling WHERE fridgeFridgeId = ${fridgeId} 
        AND status = "${status}"`);
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

    async getCollingByLotInterno(loteInterno:string,fridge:Fridge){
        await this.getConnection();
        return await this.coolingRepository.find({
            where: {loteInterno: `${loteInterno}`},
            // where: {loteInterno: `${loteInterno}`,fridge},
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