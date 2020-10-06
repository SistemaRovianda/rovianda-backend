import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { CatCFDIUses } from "../Models/Entity/Cat.CFDI.Uses";

export class CatCFDIUsesRepository{
    private catCFDIUsesRepository: Repository<CatCFDIUses>;

    async getConnection(){
        if(!this.catCFDIUsesRepository)
            this.catCFDIUsesRepository = (await connect()).getRepository(CatCFDIUses);
    }


    async getAllCFDIUses(){
        await this.getConnection();
        return await this.catCFDIUsesRepository.find({
            order: { cCFDIUse: "ASC"}
        })
    }
}