import {connect} from '../Config/Db';
import { Repository, Between } from 'typeorm';
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

    async getOvenStatus(status){
        await this.getConnection();
        return await this.ovenRepository.find({status});
    }

    async getOvenProductById(ovenProduct_id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.findOne({
            where:{ id:`${ovenProduct_id}`},
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
        return await this.ovenRepository.query(`
        SELECT * 
        FROM oven_products 
        INNER JOIN revisions_oven_products ON revisions_oven_products.ovenProductsId = oven_products.id 
        INNER JOIN products_rovianda ON products_rovianda.id = oven_products.product_id 
        WHERE oven_products.id = ${id};`
        );
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

    async getOvensByNewLot(newLote:string){
        await this.getConnection();
        return await this.ovenRepository.find({newLote})
    }

    
}