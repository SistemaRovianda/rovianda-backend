import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { CodeAccess } from "../Models/Entity/CodesAccess";

export class CodeAccessRepository{
    private repository:Repository<CodeAccess>;
    async getConnection(){
        if(!this.repository) this.repository = (await connect()).getRepository(CodeAccess);
    }

    async saveCodeAccess(codeAccess:CodeAccess){
        await this.getConnection();
        return await this.repository.save(codeAccess);
    }

    async getCodeAccessByUserId(userId:string){
        await this.getConnection();
        return await this.repository.findOne({userId});
    }
    async getCodeAccessByCode(code:string){
        await this.getConnection();
        return await this.repository.findOne({code});
    }

    async deleteCodeAccess(codeAccessId:number){
        await this.getConnection();
        return await this.repository.delete({codeAccessId});
    }
}