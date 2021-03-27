import { In, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { PropertiesPackaging } from "../Models/Entity/Properties.Packaging";
import { Packaging } from "../Models/Entity/Packaging";
import { PresentationProducts } from "../Models/Entity/Presentation.Products";
import { LotsStockInventoryPresentation } from "../Models/DTO/PackagingDTO";

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

    async getPropertiesPackagingByPackagingAndPresentationAndCount(packaging:Packaging,presentation:PresentationProducts){
        await this.getConnection();
        return await this.propertiesPackaginRepository.find({
            where: {packaging,presentation,active:true} 
        });
    }

    async findByPackagings(packagings:Packaging){
        await this.getConnection();
        return await this.propertiesPackaginRepository.find({
            where:{
            packaging: packagings
            },relations:["presentation"]});
    }

    async getPropertiesPackagingOfPackaging(packaging:Packaging){
        await this.getConnection();
        return await this.propertiesPackaginRepository.find({packaging});
    }

    async getAllPropertiesPackaging(){
        await this.getConnection();
        return (await this.propertiesPackaginRepository.query(
            `SELECT sum(prop.units) as units,round(sum(prop.weight),2) as weight,prop.presentation_id,pr.name,pp.type_presentation,pc.lot_id,prop.packaging_id FROM bd_rovianda.properties_packaging as prop 
            inner join presentation_products as pp on pp.presentation_id=prop.presentation_id inner join products_rovianda as pr on pr.id=pp.product_rovianda_id inner join packaging as pc on pc.id=prop.packaging_id
            and pc.lot_id not in (select code from cheeses)
            group by prop.packaging_id,prop.presentation_id;`
        )) as LotsStockInventoryPresentation[];
    }

    async getAllHistoryByOvenIds(ovenIds:number[]){
        await this.getConnection();
        let ids = "(";
        for(let id of ovenIds){
            ids+=`${id},`;
        }
        ids+=")";
        ids=ids.replace(",)","");
        return await this.propertiesPackaginRepository.query(`
        select propack.properties_id as exitNumber,pack.id as exitPackaging,pack.register_date as registerDate,pack.lot_id as lotDay,
        pack.expiration,pack.active,propack.output_of_warehouse as quantity,propack.weight_of_warehouse as weight,propack.weight,pr.name,pre.type_presentation as presentation from
        packaging as pack right join properties_packaging as propack on pack.id=propack.packaging_id right join products_rovianda as pr
        on pr.id=pack.product_id right join presentation_products as pre on propack.presentation_id=pre.presentation_id 
        where pack.oven_product_id in ${ids}
        `);
    }
}

