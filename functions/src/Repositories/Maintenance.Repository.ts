import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Maintenance } from '../Models/Entity/Maintenance';
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
       let mes = await this.maintenanceRepository.find();
       mes.forEach(i =>{`${i.dateInit}`});

        return await this.maintenanceRepository.createQueryBuilder("maintenance")       
        .select("SUM(maintenance.cost)", "cost")
        .addSelect("maintenance.dateInit","mounth")
        .where("maintenance.dateInit = :mounth", { mounth: mes})
        .groupBy("maintenance.dateInit")
        .getRawMany();
    }
    
}