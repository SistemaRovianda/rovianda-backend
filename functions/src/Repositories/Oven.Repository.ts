import {connect} from '../Config/Db';
import { Repository, Between, In } from 'typeorm';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { OvenProductStatusEnum } from '../Models/Enum/OvenProduct.Status.Enum';
import { OvensInventory } from '../Models/DTO/Quality.DTO';

export class OvenRepository{
    private ovenRepository:Repository<OvenProducts>;

    async getConnection(){
        if(!this.ovenRepository){
            this.ovenRepository = (await connect()).getRepository(OvenProducts);
        }
    }

    async getOvenProducts(){
            
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.query(`
        SELECT oven_products.id, oven_products.pcc, oven_products.oven,  
        oven_products.new_lote, oven_products.date, 
        oven_products.product_id, products_rovianda.name 
        FROM oven_products INNER JOIN products_rovianda WHERE oven_products.product_id = products_rovianda.id`);
    }

    async findByProcessIdsAndStatus(processIds:number[],status:string){
        await this.getConnection();
        return await this.ovenRepository.find({
            where:{processId:In(processIds),status}
        });
    }

    async findByProcessIds(processIds:number[]){
        await this.getConnection();
        return await this.ovenRepository.find({where:{processId:In(processIds)}});
    }

    async getOvenStatus(status){
        await this.getConnection();
        return await this.ovenRepository.find({status});
    }

    async getOvenProductById(ovenProduct_id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.findOne({
            where:{ id: ovenProduct_id},
            relations:["product","revisions"]
         });
    }

    async getOvenProductByIds(id:string){
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.findOne({newLote:id});
    }

    async getOvenProductByProductId(product_id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.query(`SELECT * FROM oven_products WHERE product_id = ${product_id}`)
    }

    async getOvenProductByProduct(product:ProductRovianda){
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.findOne({product})
    }

    async getOvenProductByLot(newLote:string){
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.findOne({
            where:{newLote :`${newLote}`}
            });
    }

    async findOvenProductById(id: number){
        await this.getConnection();
        return await this.ovenRepository.createQueryBuilder()
        .where("id = :id",{id})
        .getOne();
    }

   
    async saveOvenProduct(ovenProduct: OvenProducts){
        await this.getConnection();
        return await this.ovenRepository.save(ovenProduct);
    }

    async getOvenProductsById(id:number){
        await this.getConnection();
        return await this.ovenRepository.findOne({
            id
        });
    }

    async getOvenProductsByIdWithRevisionsWithProduct(id:number){
        await this.getConnection();
        return await this.ovenRepository.findOne({
            id
        },{relations:["revisions"]});
    }

    async ById(id:number){
        await this.getConnection();
        return await this.ovenRepository.findOne({id});
    }

    async getLastOven(){
        await this.getConnection();
        return await this.ovenRepository.query(`SELECT * FROM oven_products ORDER BY id DESC LIMIT 1`)
    }

    async getProductsByOvenClosed(){
        await this.getConnection();
        return this.ovenRepository.find({
            where: {status : OvenProductStatusEnum.CLOSED},
            relations: ["product"]
        });
    }

    async saveOvenUser(ovenUser: OvenProducts){
        await this.getConnection();
        return await this.ovenRepository.save(ovenUser);
    }

    async getOvenProductsByDates(dateInit:string,dateEnd:string){
        await this.getConnection();
        return await this.ovenRepository.find({
            order : { date:"ASC" },
            where:{ date: Between(dateInit, dateEnd)},
            relations: ["revisions","product"]
    });
    }

    async getOvensByNewLotAndProduct(newLote:string,product:ProductRovianda){
        await this.getConnection();
        return await this.ovenRepository.findOne({newLote,product})
    }
    async getOvensByNewLot(newLote:string){
        await this.getConnection();
        return await this.ovenRepository.findOne({newLote})
    }

    async getOvenByProcessId(processId:number){
        await this.getConnection();
        return await this.ovenRepository.find({processId})
    }

    async getAllHistoryByProcessIds(processIds:number[]){
        await this.getConnection();
        let ids="(";
        for(let id of processIds){
            ids+=`${id},`;
        }
        ids+=")";
        ids=ids.replace(",)",")");
        return await this.ovenRepository.query(`
        select ov.id as ovenId,ov.date,ov.estimated_time as time,ov.oven,ov.new_lote as newLot,pr.name as product 
        from oven_products as ov left join products_rovianda as pr on ov.product_rovianda_id=pr.id 
        where ov.processId in ${ids}
        `);
    }


    async getAllOvensByDatesAndLotPaginated(offset:number,perPage:number,startDate:string,endDate:string,lot:string){
        await this.getConnection();
        let items:OvensInventory[]=await this.ovenRepository.query(`
            select op.id,form.lot_day as antLot,op.new_lote as newLot,op.status,op.date as createAt,pr.name,t.oven_temp as ovenTemp
            from oven_products as op left join process as pro on op.processId=pro.id 
            left join formulation as form on pro.formulationId=form.id
            left join products_rovianda as pr on op.product_rovianda_id=pr.id
            left join (
                select * from revisions_oven_products where id in 
                (SELECT max(id) as id FROM revisions_oven_products where oven_product_id in (
                    select id from oven_products as op
                    ${lot?` where op.new_lote like "%${lot}%" `:""}
                    ${(startDate && endDate)?((lot)?` and op.date between "${startDate}" and "${endDate}" `:` where op.date between "${startDate}" and "${endDate}"`):``} 
                ))
            ) as t on op.id=t.id
            ${lot?` where op.new_lote like "%${lot}%" `:""}
            ${(startDate && endDate)?((lot)?` and op.date between "${startDate}" and "${endDate}" `:` where op.date between "${startDate}" and "${endDate}"`):``}
            limit ${perPage} offset ${offset}
        `) as OvensInventory[];
        let count:{count:number}[]=await this.ovenRepository.query(`
            SELECT count(*) as count
            from oven_products as op left join process as pro on op.processId=pro.id 
            left join formulation as form on pro.formulationId=form.id
            left join products_rovianda as pr on op.product_rovianda_id=pr.id
            ${lot?` where op.new_lote like "%${lot}%" `:""}
            ${(startDate && endDate)?((lot)?` and op.date between "${startDate}" and "${endDate}" `:` where op.date between "${startDate}" and "${endDate}"`):``}
        `) as {count:number}[];
        return {
            items,
            count: count[0].count
        }
    }

    async getAllLotsByProduct(productRovianda:ProductRovianda){
        await this.getConnection();
        return await this.ovenRepository.find({
            product:productRovianda,
            status: "CLOSED"
        });
    }

    async getAllLotsByProductAndDate(productRovianda:ProductRovianda,date:string){
        await this.getConnection();
        return await this.ovenRepository.find({
            where:{
            product:productRovianda,
            date
            }
        });
    }
    
}