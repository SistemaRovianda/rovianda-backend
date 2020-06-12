import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { PropertiesPackaging } from "../Models/Entity/Properties.Packaging";

export class PropertiesPackagingRepository{
    private propertiesPackaginRepository: Repository<PropertiesPackaging>;

    async getConnection(){
        if (!this.propertiesPackaginRepository)
            this.propertiesPackaginRepository = (await connect()).getRepository(PropertiesPackaging);
    }

    async getPropertiesPackaginById(id: number){
        await this.getConnection();
        return await this.propertiesPackaginRepository.findOne({
            where: {id}
        });
    }

    async savePropertiesPackaging(propertyPackagin: PropertiesPackaging){
        await this.getConnection();
        return await this.propertiesPackaginRepository.save(propertyPackagin);
    }
}