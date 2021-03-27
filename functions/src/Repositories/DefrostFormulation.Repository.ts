import { In, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { Defrost } from "../Models/Entity/Defrost";
import { DefrostFormulation } from "../Models/Entity/Defrost.Formulation";

export class DefrostFormulationRepository{
    private repository:Repository<DefrostFormulation>;
    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(DefrostFormulation);
        }
    }

    async getDefrostFormulation(defrostFormulationId:number){
        await this.getConnection();
        return await this.repository.findOne({defrostFormulationId})
    }

    async getDefrostFormulationByDefrost(defrost:Defrost){
        await this.getConnection();
        return await this.repository.findOne({defrost});
    }
    async getDefrostFormulationByDefrostWithFormulation(defrost:Defrost){
        await this.getConnection();
        return await this.repository.findOne({defrost},{relations:["formulation"]});
    }

    async findByDefrostIds(defrosts:Defrost[]){
        await this.getConnection();
        return await this.repository.find({where:{defrost:In(defrosts)}});
    }
}