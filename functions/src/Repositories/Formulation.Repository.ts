import { Formulation } from "../Models/Entity/Formulation";
import { Repository } from "typeorm";
import { connect } from "../Config/Db";

export class FormulationRepository{
    private formulatioRepository: Repository<Formulation>;

    async getConnection(){
        if(!this.formulatioRepository)
            this.formulatioRepository = (await connect()).getRepository(Formulation);
    }

    async saveFormulation(formulation: Formulation){
        await this.getConnection();
        return await this.formulatioRepository.save(formulation);
    }
    
}