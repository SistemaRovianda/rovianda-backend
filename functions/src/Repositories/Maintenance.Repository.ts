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
        return await this.maintenanceRepository.
        query(`SELECT sum(cost) as cost, mid(date_init from 3 for 5) as mounth FROM maintenance group by mounth;`)
    }
    
}