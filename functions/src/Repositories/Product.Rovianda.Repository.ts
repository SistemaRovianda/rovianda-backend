import { Repository, Like, Between } from "typeorm";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { connect } from "../Config/Db";
import { AdminProductsCatalog } from "../Models/DTO/Admin.Sales.Request";
import { ProductCatalogMetrics } from "../Models/DTO/Quality.DTO";

export class ProductRoviandaRepository {
    private repository: Repository<ProductRovianda>;
    async getConnection() {
        if (!this.repository) {
            this.repository = (await connect()).getRepository(ProductRovianda);
        }
    }

    async saveProductRovianda(productRovianda: ProductRovianda) {
        await this.getConnection();
        return await this.repository.save(productRovianda);
    }

    async getProductRoviandaByName(name: string) {
        await this.getConnection();
        return await this.repository.findOne({ name });
    }

    async getProductRoviandaCode(code:string){
        await this.getConnection();
        return await this.repository.findOne({code})
    }
    async getProductRoviandaById(id: number) {
        await this.getConnection();
        return await this.repository.findOne({
            where: {id},
            relations: ["ingredients","presentationProducts"]
        });
    }

   

    async getProductRoviandaByIds(id: number) {
        await this.getConnection();
        return await this.repository.findOne({
            where: {id},
            relations: ["packaging"]
        });
    }

    async getProductRoviandaByProductId(id: number) {
        await this.getConnection();
        return await this.repository.findOne({id});
    }

    async getProductRoviandaByIdss(id: number) {
        await this.getConnection();
        return await this.repository.findOne({
            where: {id},
            relations: ["ingredients"]
        });
    }

    async deleteProductRoviandaById(id: number) {
        await this.getConnection();
        return await this.repository.delete({ id });
    }

    async getAllProducts() {
        await this.getConnection();
        return await this.repository.find();
    }

    async getAllProductsT() {
        await this.getConnection();
        return await this.repository.find({
            where:{status:true}
        });
    }

    async getLastProductRovianda(){
        await this.getConnection();
        return await this.repository.findOne({
            order: {
                id: 'DESC'
                }
        });
    }
  
    async getProductRoviandaByCode(code:string) {
        await this.getConnection();
        return await this.repository.findOne({code});
    }

    async getProductRoviandaByCodeLike(code:string){
        await this.getConnection();
        return await this.repository.findOne({code:Like(`%${code}`)});
    }

    async getById(id:number){
        await this.getConnection();
        return await this.repository.findOne({id},{relations:["presentationProducts"]});
    }

    async getProductPresentation(id:number){
        await this.getConnection();
        return await this.repository.query(`
        SELECT * FROM presentation_products
        WHERE productsRoviandaId = ${ id };`);
    }

    async getAllProductRoviandaCatalog(){
        await this.getConnection();
        return await this.repository.find({select:["name","imgS3","id","code"]});
    }


    async getByIdWithPresentations(id:number){
        await this.getConnection();
        return await this.repository.findOne({id},{relations:["presentationProducts"]});
    }

    async getAllProductsRovianda(hint:string){
        console.log("HINT: "+hint);
        await this.getConnection();
        let query =`select pp.presentation_id as id,pr.name as product,pp.type_presentation as presentation,pp.price_presentation_public as price,
        pp.price_presentation_min as weight,pp.key_sae as keySae,pp.key_altern as keyAltern,pp.type_product as type,pp.uni_med as uniMed,pp.price_presentation_liquidation as quantityByPresentation,
        pp.esq_key as esqKey,pp.esq_description as esqDescription
        from products_rovianda as pr 
        left join presentation_products as pp on pr.id=pp.product_rovianda_id
        where ${(hint)?`concat(pr.name," ",pp.type_presentation) like "%${hint}%" and `:""} pp.type_product is not null and pp.status=1 order by pr.name;`;
        console.log("Query: "+query);
        return await this.repository.query(query) as AdminProductsCatalog[];
    }

    async getOnlyProductOfQualityArea(){
        await this.getConnection();
        return await this.repository.query(`
        select id,name,status from products_rovianda where id in (
            SELECT distinct(pr.id) FROM products_rovianda as pr left join presentation_products as pp
           on pr.id=pp.product_rovianda_id where pp.type_product="NORMAL" or pp.type_product is null
           );
        `) as {id:number,name:string,status:number}[];
    }

    async unvinculateOfIngredient(productId:number,ingredientId:number){
        await this.getConnection();
        return await this.repository.query(`
            delete from ingredients where productsRoviandaId=${productId} and productCatalogId=${ingredientId}
        `);
    }


    async getWeekDatesByDate(date:string,type:string){
        await this.getConnection();
        let dates:{
            date1:string,
            date2:string,
            date3:string,
            date4:string
        }={
            date1:"",
            date2:"",
            date3:"",
            date4:""
        }
        // ago dates
        let result= await this.repository.query(`
        select date_format(date,"%Y-%m-%d") as date1 from sales where
        ${type}(date)=(select (${type}('${date}T00:00:00.000Z')-1) as ${type}) order by date asc limit 1 offset 0
        `) as {date1:string}[];
        console.log("JSON: "+JSON.stringify(result));
        if(!result.length){
            dates.date1 = `${date}T00:00:00.000Z`;
        }else{
            dates.date1 = result[0].date1;
        }
        let result2= await this.repository.query(`
        select date_format(date,"%Y-%m-%d") as date1 from sales where
        ${type}(date)=(select (${type}('${date}T00:00:00.000Z')-1) as ${type}) order by date desc limit 1 offset 0
        `) as {date1:string}[];
        console.log("JSON: "+JSON.stringify(result2));
        if(!result2.length){
            dates.date2 = `${date}T23:59:59.000Z`;
        }else{
            dates.date2 = result2[0].date1;
        }
        // afterDates
        let result3= await this.repository.query(`
        select date_format(date,"%Y-%m-%d") as date1 from sales where
        ${type}(date)=(select (${type}('${date}T00:00:00.000Z')) as ${type}) order by date asc limit 1 offset 0
        `) as {date1:string}[];
        console.log("JSON: "+JSON.stringify(result3));
        if(!result3.length){
            dates.date3 = `${date}T00:00:00.000Z`;
        }else{
            dates.date3 = result3[0].date1;
        }
        let result4= await this.repository.query(`
        select date_format(date,"%Y-%m-%d") as date1 from sales where
        ${type}(date)=(select (${type}('${date}T00:00:00.000Z')) as ${type}) order by date desc limit 1 offset 0
        `) as {date1:string}[];
        console.log("JSON: "+JSON.stringify(result4));
        if(!result4.length){
            dates.date4 = `${date}T23:59:59.000Z`;
        }else{
            dates.date4 = result4[0].date1;
        }
        return dates;
    }

    async getMetricsProductsIncreaseDecrease(date1:string,date2:string,date3:string,date4){
        await this.getConnection();
        return await this.repository.query(
            `
            select 
            t3.t1Id as productId,t3.t1Product as productName,t3.t1Quantity as quantity1,t3.t2Quantity as quantity2,
            if(t3.t1Quantity=0 and t3.t2Quantity=0,0,if(t3.t1Quantity=0,100,if(t3.t2Quantity=0,-100, if(t3.t1Quantity>t3.t2Quantity, round(-100+((t3.t2Quantity*100)/t3.t1Quantity),2) ,round( (((t3.t2Quantity-t3.t1Quantity)*100)/t3.t1Quantity) ,2) ) )  )  ) as increase 
            from (select * from (
                           select pr.id as t1Id,pr.name as t1Product,round(sum(sub.quantity),2) as t1Quantity from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id
                           left join products_rovianda as pr on sub.product_id=pr.id
                           where sa.date between "${date1}T00:00:00.000Z" and "${date2}T23:59:59.000Z"
                           group by pr.id 
                           UNION 
                           select pr.id as t1Id,pr.name as t1Product,0 as t1Quantity from  products_rovianda as pr left join presentation_products as pp on pr.id=pp.presentation_id
                           where pp.status=1 and pr.id not in (
                           select pr.id as t2Id 
                           from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id
                           left join products_rovianda as pr on sub.product_id=pr.id
                           where sa.date between "${date1}T00:00:00.000Z" and "${date2}T23:59:59.000Z"
                           )
                   ) as t1 left join (
                           select pr.id as t2Id,pr.name as t2Product,round(sum(sub.quantity),2) as t2Quantity from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id
                           left join products_rovianda as pr on sub.product_id=pr.id
                           where sa.date between "${date3}T00:00:00.000Z" and "${date4}T23:59:59.000Z"
                           group by pr.id 
                           UNION 
                           select pr.id as t2Id,pr.name as t2Product,0 as t2Quantity from  products_rovianda as pr  left join presentation_products as pp on pr.id=pp.presentation_id
                           where pp.status=1 and  pr.id not in (
                           select pr.id as t2Id 
                           from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id
                           left join products_rovianda as pr on sub.product_id=pr.id
                           where sa.date between "${date3}T00:00:00.000Z" and "${date4}T23:59:59.000Z"
                           )
                       ) as t2 on t1.t1Id=t2.t2Id ) as t3;
            `
        ) as ProductCatalogMetrics[];
    }
}