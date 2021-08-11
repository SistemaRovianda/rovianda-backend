import { In, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { PropertiesPackaging } from "../Models/Entity/Properties.Packaging";
import { Packaging } from "../Models/Entity/Packaging";
import { PresentationProducts } from "../Models/Entity/Presentation.Products";
import { LotsStockInventoryPresentation } from "../Models/DTO/PackagingDTO";
import { ProductEndedIventory } from "../Models/DTO/Quality.DTO";

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
            ` SELECT sum(prop.units) as units,round(sum(prop.weight),2) as weight,prop.presentation_id,
            pr.name,pp.type_presentation,pc.lot_id,prop.packaging_id,pc.register_date
            FROM  properties_packaging as prop 
                left join presentation_products as pp on pp.presentation_id=prop.presentation_id 
                left join products_rovianda as pr on pr.id=pp.product_rovianda_id left 
                join packaging as pc on pc.id=prop.packaging_id
                 where if(pp.uni_med="PZ",prop.units>0,prop.weight>0) and prop.active=1 and  pc.product_id not in (select productId from cheeses)
                group by prop.presentation_id,prop.packaging_id order by pc.lot_id;`
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

    async getAllProductsEndedPaginatedAccumulated(offset:number,perPage:number,startDate:string,endDate:string,lot:string){
        await this.getConnection();
        let items:ProductEndedIventory[]= await this.propertiesPackaginRepository.query(`
            select pr.name,pp.type_presentation as presentation,sum(propack.weight) as weight,sum(propack.units) as units,
            sum(propack.output_of_warehouse) as unitsOutput,sum(propack.weight_of_warehouse) as weightOutput
            from properties_packaging as propack left join presentation_products as pp on propack.presentation_id=pp.presentation_id
            left join products_rovianda as pr on pp.product_rovianda_id=pr.id 
            left join packaging as pack on propack.packaging_id=pack.id 
            ${(lot)?` where pack.lot_id like "%${lot}%"`:""}
            ${(startDate && endDate)?((lot)?` and pack.register_date between "${startDate}" and "${endDate}" `:` where pack.register_date between "${startDate}" and "${endDate}" `):``}
            group by propack.presentation_id
            limit ${perPage} offset ${offset}
        `);
        let count:{count:number}[]=await this.propertiesPackaginRepository.query(`
            select count(*) as count from (select pr.name,pp.type_presentation as presentation,sum(propack.weight) as weight,sum(propack.units) as units,
            sum(propack.output_of_warehouse) as unitsOutput,sum(propack.weight_of_warehouse) as weightOutput
            from properties_packaging as propack left join presentation_products as pp on propack.presentation_id=pp.presentation_id
            left join products_rovianda as pr on pp.product_rovianda_id=pr.id 
            left join packaging as pack on propack.packaging_id=pack.id
            ${(lot)?` where pack.lot_id like "%${lot}%"`:""}
            ${(startDate && endDate)?((lot)?` and pack.register_date between "${startDate}" and "${endDate}" `:` where pack.register_date between "${startDate}" and "${endDate}" `):``}
            group by propack.presentation_id) as t;
        `);
        return {
            items,
            count:count[0].count
        }
    }
    async getAllProductsEndedPaginatedSingle(offset:number,perPage:number,startDate:string,endDate:string,lot:string){
        await this.getConnection();
        let items:ProductEndedIventory[]= await this.propertiesPackaginRepository.query(`
            select propack.properties_id as id,pr.name,pp.type_presentation as presentation,propack.weight as weight,propack.units as units,
            propack.output_of_warehouse as unitsOutput,propack.weight_of_warehouse as weightOutput,
            pack.lot_id as lot,pack.register_date as registerDate
            from properties_packaging as propack left join presentation_products as pp on propack.presentation_id=pp.presentation_id
            left join products_rovianda as pr on pp.product_rovianda_id=pr.id 
            left join packaging as pack on propack.packaging_id=pack.id
            ${(lot)?` where pack.lot_id like "%${lot}%"`:""}
            ${(startDate && endDate)?((lot)?` and pack.register_date between "${startDate}" and "${endDate}" `:` where pack.register_date between "${startDate}" and "${endDate}" `):``}
            limit ${perPage} offset ${offset}
        `);
        let count:{count:number}[]=await this.propertiesPackaginRepository.query(`
            select count(*) as count
            from properties_packaging as propack left join presentation_products as pp on propack.presentation_id=pp.presentation_id
            left join products_rovianda as pr on pp.product_rovianda_id=pr.id 
            left join packaging as pack on propack.packaging_id=pack.id
            ${(lot)?` where pack.lot_id like "%${lot}%"`:""}
            ${(startDate && endDate)?((lot)?` and pack.register_date between "${startDate}" and "${endDate}" `:` where pack.register_date between "${startDate}" and "${endDate}" `):``}   
        `);
        return {
            items,
            count:count[0].count
        }
    }

    async getAllProductsInventoryToDiscount(presentationId:number,lotId:string){
        await this.getConnection();
        return await this.propertiesPackaginRepository.query(`
            SELECT propack.properties_id as id,propack.weight,propack.units,propack.presentation_id 
            FROM properties_packaging as propack left join packaging as pack
            on propack.packaging_id=pack.id
            where pack.lot_id="${lotId}" and propack.presentation_id=${presentationId};
        `) as {id:number,weight:number,units:number,presentationId:number}[];
    }

    async UpdateProperty(id:number,units:number,weight:number){
        await this.getConnection();
        return await this.propertiesPackaginRepository.query(`
            update properties_packaging set weight=${weight},units=${units},active=${(units>0)?1:0} where properties_id=${id}
        `);
    }
}

