import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { EndDay } from "../Models/Entity/EndDay";

export class EndDayRepository{
    private repository:Repository<EndDay>;
    async getConnection(){
        if(!this.repository) this.repository = (await connect()).getRepository(EndDay);
    }
    async saveEndDay(endDay:EndDay){
        await this.getConnection();
        return await this.repository.save(endDay);
    }
    async getEndDayByDayAndSellerId(endDay:String,sellerId:string){
        await this.getConnection();
        return await this.repository.findOne({where:{date:endDay,sellerId}});
    }
}