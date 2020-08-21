import { Sale } from "../Models/Entity/Sales";
import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { User } from "../Models/Entity/User";

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

    async getSalleSellerByDateUser(seller:string,date:string){
        await this.getConnection();
        return await this.saleRepository.find({
            where:{ seller, date},
            relations:["client"]
        });
    }
}