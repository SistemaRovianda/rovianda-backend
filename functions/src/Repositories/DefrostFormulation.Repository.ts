import { Repository } from "typeorm";
import { connect } from "../Config/Db";
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
}