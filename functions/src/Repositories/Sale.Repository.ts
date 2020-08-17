import { Sale } from "../Models/Entity/Sales";
import { Repository } from "typeorm";
import { connect } from "../Config/Db";

export class SaleRepository{
    private saleRepository: Repository<Sale>;

    async getConnection(){
        if (!this.saleRepository)
            this.saleRepository = (await connect()).getRepository(Sale);
    }

    async getSaleById(id: number){
        await this.getConnection();
        return await this.saleRepository.find({
            where: {id}
        });
    }
}