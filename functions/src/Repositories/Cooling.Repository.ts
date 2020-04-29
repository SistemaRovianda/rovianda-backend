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
}