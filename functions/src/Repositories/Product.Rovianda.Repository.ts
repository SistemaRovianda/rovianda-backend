import { Repository } from "typeorm";
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
            where: {id}
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
}