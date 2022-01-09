import { Repository } from "typeorm"
import { connect } from "../Config/Db";
import { Process } from "../Models/Entity/Process";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { SubProductToOven } from "../Models/Entity/SubProduct"

export class SubProductToOvenRepository{

    private repository:Repository<SubProductToOven>;

    async getConnection(){
        if(!this.repository) this.repository = (await connect()).getRepository(SubProductToOven);
    }

    async createSubProductToOven(subProductOven:SubProductToOven){
        await this.getConnection();
        return await this.repository.save(subProductOven);
    }

    async getAllSubProductToOvenByProcess(process:Process){
        await this.getConnection();
        return await this.repository.find({process,status:"ACTIVE"});
    }

    async getSubProductToOvenById(subProductToOvenId:number){
        await this.getConnection();
        return await this.repository.findOne({subProductId:subProductToOvenId});
    }

    async getSubProductToOvenByProductIdAndProcessId(productRovianda:ProductRovianda,process:Process){
        await this.getConnection();
        return await this.repository.findOne({process,productRovianda});
    }

    async deleteSubProductToOven(subProducToOvenId:number){
        await this.getConnection();
        return await this.repository.update({subProductId:subProducToOvenId},{status:"DELETED"});
    }

}