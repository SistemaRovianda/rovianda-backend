import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Maintenance } from '../Models/Entity/Maintenance';
import { Store } from '../Models/Entity/Store';
export class MaintenanceRepository{
    private maintenanceRepository:Repository<Maintenance>;

    async getConnection(){
        if(!this.maintenanceRepository){
            this.maintenanceRepository = (await connect()).getRepository(Maintenance);
        }
    }

    async getAllMaintenance(){
        await this.getConnection();
        return await this.maintenanceRepository.find();
    }

    async createMaintenance(maintenance:Maintenance){
        await this.getConnection();
        return await this.maintenanceRepository.save(maintenance);
    }

    async getMaintenanceMounth(){
        await this.getConnection();
        return await this.maintenanceRepository.createQueryBuilder("maintenance")       
        .select("SUM(maintenance.cost)", "cost")
        .addSelect("maintenance.dateInit","mounth")
        .where("maintenance.dateInit = :mounth", { mounth: mes})
        .groupBy("maintenance.dateInit")
        .getRawMany();
    }
    
    async getMaintenanceByStore(store:Store){
        await this.getConnection();
        return await this.maintenanceRepository.find({store});
    }

    async getMaintenanceByStoreId(storeId:number){
        await this.getConnection();
        return await this.maintenanceRepository.query(`
        SELECT maintenance.device_id, devices.name 
        FROM maintenance 
        INNER JOIN devices ON devices.device_id = maintenance.device_id 
        WHERE store_id = ${storeId} GROUP BY device_id`);
    }

    async getMaintenanceByStoreIdDeviceID(storeId:number,deviceId:number){
        await this.getConnection();
        return await this.maintenanceRepository.query(`
        SELECT maintenance.cost, devices.name FROM maintenance 
        INNER JOIN devices ON devices.device_id = maintenance.device_id 
        WHERE maintenance.store_id = ${storeId} 
        AND maintenance.device_id = ${deviceId}`);
    }

    async getMaintenanceById(id:number){
        await this.getConnection();
        return await this.maintenanceRepository.findOne({id})
    }

    async getMaintenanceByIds(id:number){
        await this.getConnection();
        return await this.maintenanceRepository.query(`
        SELECT * FROM maintenance WHERE maintenance_id = ${id}`);
    }

    async getMaintenanceMounth(){
        await this.getConnection();
        return await this.maintenanceRepository.
        query(`SELECT sum(cost) as cost, mid(date_init from 3 for 5) as mounth FROM maintenance group by mounth;`)
    }

    async getMaintenanceByMounth(mounth:string){
        await this.getConnection();
        return await this.maintenanceRepository.
        query(`SELECT store.name as store , maintenance.title as nameRepair , devices.name as objectRepaired, maintenance.cost 
        FROM maintenance 
        INNER JOIN store ON maintenance.store_id = store.store_id 
        INNER JOIN devices ON maintenance.device_id = devices.device_id
        where substring(maintenance.date,6,2)='${mounth}';`);
    }
    
    async getMaintenanceByObject(){
        await this.getConnection();
        return await this.maintenanceRepository.createQueryBuilder("maintenance")
        .innerJoin("maintenance.devices", "maintenanceDevices")
        .select("maintenanceDevices.name","nameObject")
        .addSelect("SUM(maintenance.cost)", "costTotal")
        .groupBy("maintenanceDevices.name")
        .getRawMany();
    }

}
    /* SELECT * FROM `rovianda-test-dev`.maintenance where date_init BETWEEN CAST('2020-06-21' AS DATE) AND CAST('2020-06-27' AS DATE) order by date_init; */
    
    /* SELECT store.name as store , maintenance.title as nameRepair , devices.name as objectRepaired, maintenance.cost 
    FROM `rovianda-test-dev`.maintenance 
    INNER JOIN store ON maintenance.store_id = store.store_id 
    INNER JOIN devices ON maintenance.device_id = devices.device_id
    where substring(maintenance.date_init,6,2)='07'; */
    