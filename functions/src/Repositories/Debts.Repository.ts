import { Repository } from "typeorm";
import { Debts } from "../Models/Entity/Debts";
import { connect } from "../Config/Db";

export class DebtsRepository{
    private debtsRepository:Repository<Debts>;
    async getConnection(){
        if(!this.debtsRepository){
            this.debtsRepository = (await connect()).getRepository(Debts);
        }
    }

    async saveDebts(deb:Debts){
        await this.getConnection();
        return await this.debtsRepository.save(deb);
    }

    async payDeb(debId:number){
        await this.getConnection();
        await this.debtsRepository.query(`update debts set status=0 where debt_id=${debId}`);
    }

}