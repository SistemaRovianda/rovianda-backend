import { Repository } from "typeorm";
import { PresentationProducts } from "../Models/Entity/Presentation.Products";
import { connect } from "../Config/Db";

export class PresentationProductsRepository {
    private presentationRepository: Repository<PresentationProducts>;

    async getConnection() {
        if (!this.presentationRepository)
            this.presentationRepository = (await connect()).getRepository(PresentationProducts);
    }

    async getPresentationProductsById(id: number) {
        await this.getConnection();
        return await this.presentationRepository.findOne(
            { where: { id } }
        )
    }
}