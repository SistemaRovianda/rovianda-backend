import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { CatPaymentTypes } from "../Models/Entity/Cat.Payment.Types";

export class CatPaymentTypesRepository{
    private catPaymentTypesRepository: Repository<CatPaymentTypes>;

    async getConnection(){
        if (!this.catPaymentTypesRepository)
            this.catPaymentTypesRepository = (await connect()).getRepository(CatPaymentTypes);
    }

    async getAllPaymentTypes(){
        await this.getConnection();
        return await this.catPaymentTypesRepository.find({
            order: { cPaymentShape : "ASC"}
        });
    }
}