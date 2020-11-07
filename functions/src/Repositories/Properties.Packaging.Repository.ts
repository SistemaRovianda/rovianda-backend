import { MoreThan, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { PropertiesPackaging } from "../Models/Entity/Properties.Packaging";
import { Packaging } from "../Models/Entity/Packaging";
import { PresentationProducts } from "../Models/Entity/Presentation.Products";

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
            relations: ["presentationId", "boxPackaging"]
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
  
    async findPropiertiesPackagingById(id: number){
        await this.getConnection();
        return await this.propertiesPackaginRepository.findOne({id});
    }

    async getLastPropertiesPackaging(){
        await this.getConnection();
        return await this.propertiesPackaginRepository.query(`SELECT * FROM packaging ORDER BY id DESC LIMIT 1`)
    }

    async findPropiertiesPackaging(id: number){
        await this.getConnection();
        return await this.propertiesPackaginRepository.find({
            relations:["presentationId"],
            where:{ id :`${id}`}
        });
    }

    async findPropiertiesPackagings(packaging: Packaging){
        await this.getConnection();
        return await this.propertiesPackaginRepository.find({
            relations:["presentation"],
            where:{ packaging}
        });
    }

    async getPropertiesPackagingByPackagingAndPresentationAndCount(packaging:Packaging,presentation:PresentationProducts,count:number){
        await this.getConnection();
        return await this.propertiesPackaginRepository.findOne({
            where: {packaging,presentation,units:MoreThan(count)} 
        });
    }
}

