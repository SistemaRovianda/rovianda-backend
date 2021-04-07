import { Sale } from "../Models/Entity/Sales";
import { SubSales } from "../Models/Entity/Sub.Sales";
import { Between, In, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { User } from "../Models/Entity/User";

export class SubSaleRepository{
    private subSaleRepository: Repository<SubSales>;

    async getConnection(){
        if (!this.subSaleRepository)
            this.subSaleRepository = (await connect()).getRepository(SubSales);
    }

    async getSubSalesBySale(sale:Sale){
        await this.getConnection();
        return await this.subSaleRepository.find({
            where:{ sale},
            relations:["presentation","product"]
        });
    }

    async getBySeller(seller:User,date:string){
        await this.getConnection();
        let dateFrom = date+"T00:00:00.000Z";
        let dateTo = date+"T23:59:59.0000Z";
        return await this.subSaleRepository.find({where:{ createAt: Between(dateFrom,dateTo) ,sale:{seller}}});
    }


}