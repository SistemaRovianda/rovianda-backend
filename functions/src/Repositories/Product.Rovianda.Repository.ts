import { Repository, Like, Between } from "typeorm";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { connect } from "../Config/Db";
import { AdminProductsCatalog } from "../Models/DTO/Admin.Sales.Request";

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
        pp.price_presentation_min as weight,pp.key_sae as keySae,pp.key_altern as keyAltern,pp.type_product as type,pp.uni_med as uniMed,pp.price_presentation_liquidation as quantityByPresentation
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

}