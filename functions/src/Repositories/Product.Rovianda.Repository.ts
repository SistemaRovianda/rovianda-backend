import { Repository, Like } from "typeorm";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { connect } from "../Config/Db";

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
            relations: ["presentationProducts"]
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
        return await this.repository.find({
            code: Like(`%${code}%`)
        });
    }

    async getById(id:number){
        await this.getConnection();
        return await this.repository.findOne({id});
    }

    async getProductPresentation(id:number){
        await this.getConnection();
        return await this.repository.query(`
        SELECT * FROM presentation_products
        INNER JOIN products_rovianda_presentation
        ON products_rovianda_presentation.presentation_id = presentation_products.presentation_id
        WHERE products_rovianda_presentation.product_id = ${ id };`);
    }

    async getAllProductRoviandaCatalog(){
        await this.getConnection();
        return await this.repository.find({select:["name","imgS3","id"]});
    }


}