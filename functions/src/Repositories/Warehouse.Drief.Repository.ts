import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
export class WarehouseDriefRepository{
    private warehouseDriefRepository:Repository<WarehouseDrief>;

    async getConnection(){
        if(!this.warehouseDriefRepository){
            this.warehouseDriefRepository = (await connect()).getRepository(WarehouseDrief);
        }
    }

    async getWarehouseDriefById(id:number){
        await this.getConnection();
        return await this.warehouseDriefRepository.findOne({id})
    }

    async getWarehouseDriefByStatus(status:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.find({
            where: {status: `${status}`},
        });
    }
}