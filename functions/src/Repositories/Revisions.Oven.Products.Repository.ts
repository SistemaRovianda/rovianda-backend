import { RevisionsOvenProducts } from "../Models/Entity/Revisions.Oven.Products";
import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { OvenProducts } from "../Models/Entity/Oven.Products";

export class RevisionsOvenProductsRepository {
    private revisionsOvenProductsRepository: Repository<RevisionsOvenProducts>;

    async getConnection() {
        if (!this.revisionsOvenProductsRepository)
            this.revisionsOvenProductsRepository = (await connect()).getRepository(RevisionsOvenProducts);
    }

    async saveRevisionsOvenProducts(revisionsOvenProducts: RevisionsOvenProducts) {
        await this.getConnection();
        return await this.revisionsOvenProductsRepository.save(revisionsOvenProducts);
    }

    async getByOven(ovenProducts:OvenProducts){
        await this.getConnection();
        return await this.revisionsOvenProductsRepository.find({ovenProducts})
    }
}