import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { ProcessIngredientFormulation } from "../Models/Entity/ProcessIngredientFormulation";

export class ProcessIngredientFormulationRepository{

    private repository:Repository<ProcessIngredientFormulation>;

    async getConnection(){
        if(!this.repository) this.repository =  (await connect()).getRepository(ProcessIngredientFormulation);
    }

    async saveProcessIngredientFormulation(processIngredientFormulation:ProcessIngredientFormulation){
        await this.getConnection();
        return await this.repository.save(processIngredientFormulation);
    }

    async getByFormulation(formulationId:number){
        await this.getConnection();
        return await this.repository.findOne({where:{
            formulationId
        }});
    }

}