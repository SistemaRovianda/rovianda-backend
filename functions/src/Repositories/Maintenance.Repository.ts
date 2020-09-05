import {connect} from '../Config/Db';
import { Repository, Between } from 'typeorm';
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
        query(`SELECT sum(cost) as cost, mid(date from 3 for 5) as mounth FROM maintenance group by mounth;`)
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
    
    async getMaintenanceObject(dateInit:string,dateEnd:string){
        await this.getConnection();
        return await this.maintenanceRepository.query(
        `SELECT devices.name as nameObject, SUM(maintenance.cost) as costTotal
        FROM maintenance
        INNER JOIN devices ON maintenance.device_id = devices.device_id
        WHERE maintenance.date BETWEEN '${dateInit}' AND '${dateEnd}'
        GROUP BY devices.name;`);
    }

    async getMaintenanceByObject(dateInit:string, dateEnd:string,object:string){
        await this.getConnection();
        return await this.maintenanceRepository.query(`
        SELECT store.name as store, store.address as location, sum(maintenance.cost) as cost
        FROM .maintenance
        INNER JOIN store ON store.store_id = maintenance.store_id
        where maintenance.device_id = (SELECT devices.device_id FROM devices where devices.name = '${object}')
        and  maintenance.date BETWEEN '${dateInit}' AND '${dateEnd}';`)
    }

    async getMaintenanceByObjectName(object:string){
        await this.getConnection();
        return await this.maintenanceRepository.createQueryBuilder("maintenance")
        .innerJoin("maintenance.devices", "devices")
        .where("devices.name = :name", { name: `${object}` })
        .getOne(); 
    }

    async getMaintenanceApparatus(dateInit:string, dateEnd:string){
        await this.getConnection();
        return await this.maintenanceRepository.query(`
        SELECT devices.cost_device as cost , substring(maintenance.date,1,7) as mounth 
        FROM devices
        INNER JOIN maintenance ON maintenance.device_id = devices.device_id 
        WHERE maintenance.date BETWEEN '${dateInit}' AND '${dateEnd}'
        GROUP BY devices.device_id;`)
    }

    async getMaintenanceApparatusByMounth(mounth:string){
        await this.getConnection();
        return await this.maintenanceRepository.createQueryBuilder("maintenance")
        .innerJoin("maintenance.devices", "devicesMaintenance")
        .innerJoin("maintenance.store", "storeMaintenance")
        .select("storeMaintenance.name","store")
        .addSelect("devicesMaintenance.name","repaired") 
        .addSelect("SUM(maintenance.cost)", "cost")
        .andWhere("substring(maintenance.date,6,2)= :mounth",{mounth:`${mounth}`})
        .groupBy("devicesMaintenance.name")
        .getRawMany();
    }

    async getMaintenanceByWeek(week:string){
        await this.getConnection();
        return await this.maintenanceRepository.createQueryBuilder("maintenance")
        .innerJoin("maintenance.store", "storeMaintenance")
        .innerJoin("maintenance.user", "userMaintenance")
        .select("maintenance.id","id")
        .addSelect("maintenance.title","titleFailure") 
        .addSelect(`CONCAT(userMaintenance.name," ",userMaintenance.first_surname," ",userMaintenance.last_surname) `,"nameReport")
        .addSelect("maintenance.description","description") 
        .addSelect("maintenance.date","date") 
        .addSelect("storeMaintenance.name","store")  
        .addSelect("SUM(maintenance.cost)", "cost")
        .andWhere("week(maintenance.date,2)= :week",{week:`${week}`})
        .groupBy("maintenance.id")
        .getRawMany();

    }

    async getMaintenanceByDates(dateInit:string,dateFin:string){
        await this.getConnection();
        return await this.maintenanceRepository.query(`
        SELECT * FROM maintenance 
        WHERE date 
        BETWEEN "${dateInit}" AND "${dateFin}"
        GROUP BY store_id;
        `);
    }

    async getMaintenanceByDatesStore(dateInit:string,dateFin:string,storeId:number){
        await this.getConnection();
        return await this.maintenanceRepository.query(`
        SELECT * FROM maintenance 
        WHERE date 
        BETWEEN "${dateInit}" AND "${dateFin}" 
        AND store_id = ${storeId}
        `);
    }
}

    /* SELECT * FROM `rovianda-test-dev`.maintenance where date_init BETWEEN CAST('2020-06-21' AS DATE) AND CAST('2020-06-27' AS DATE) order by date_init; */
    
    /* SELECT store.name as store , maintenance.title as nameRepair , devices.name as objectRepaired, maintenance.cost 
    FROM `rovianda-test-dev`.maintenance 
    INNER JOIN store ON maintenance.store_id = store.store_id 
    INNER JOIN devices ON maintenance.device_id = devices.device_id
    where substring(maintenance.date_init,6,2)='07'; */
    