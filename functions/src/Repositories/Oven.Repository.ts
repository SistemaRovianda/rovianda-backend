import {connect} from '../Config/Db';
import { Repository, Between, In } from 'typeorm';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { OvenProductStatusEnum } from '../Models/Enum/OvenProduct.Status.Enum';

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

    
}