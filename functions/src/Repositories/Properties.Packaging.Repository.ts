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
            where: {id},
            relations: ["presentationProduct", "boxPackaging"]
        });
    }

    async savePropertiesPackaging(propertyPackagin: PropertiesPackaging){
        await this.getConnection();
        return await this.propertiesPackaginRepository.save(propertyPackagin);
    }
  
    async findPropiertiesPackagingByPackagingId(id:number){
        await this.getConnection();
        return await this.propertiesPackaginRepository.findOne({
            where: {productId: `${id}`}
        });
    }

    async findPropiertiesPackagingByPresentationId(id:number){
        await this.getConnection();
        return await this.propertiesPackaginRepository.findOne({
            where: {presentationId: `${id}`}
        });
    }

    async getLastPropertiesPackaging(){
        await this.getConnection();
        return await this.propertiesPackaginRepository.query(`SELECT * FROM packaging ORDER BY id DESC LIMIT 1`)
    }
}