import { In, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { Defrost } from "../Models/Entity/Defrost";
import { OutputsCooling } from "../Models/Entity/outputs.cooling";

export class DefrostRepository{
    private repository:Repository<Defrost>;

    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(Defrost);
        }
    }

    async saveDefrost(defrost:Defrost){
        await this.getConnection();
        return await this.repository.save(defrost);
    }

    async getDefrostById(defrostId:number){
        await this.getConnection();
        return await this.repository.findOne({defrostId},{relations:["outputCooling"]});
    }

    async getAllActive(){
        await this.getConnection();
        return await this.repository.find({status:"ACTIVE"});
    }

    async getAllInactive(){
        await this.getConnection();
        return await this.repository.find({status:"INACTIVE"});
    }
    async getByOutputsCooling(outputCooling:number[]){
        await this.getConnection();
        return await this.repository.find({
            where:{outputCooling:{id:In(outputCooling)}}
        });
    }

    async getByOutputsIds(outputsIds:Array<number>){
        await this.getConnection();
        return await this.repository.find({
            where: { outputCooling: In([outputsIds])}
        });
    }
}