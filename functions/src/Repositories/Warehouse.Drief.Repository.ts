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

    async saveWarehouseDrief(warehouseDrief:WarehouseDrief){
        await this.getConnection();
        return await this.warehouseDriefRepository.save(warehouseDrief);
    }

    async getWarehouseDriefById(id:number){
        await this.getConnection();
        return await this.warehouseDriefRepository.findOne({id})
    }

    async getWarehouseDriefByLoteId(loteProveedor:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.findOne({loteProveedor});
    }

    async getWarehouseDriefByStatus(status:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.find({
            where: {status: `${status}`},
        });
    }
}