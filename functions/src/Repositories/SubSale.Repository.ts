import { Sale } from "../Models/Entity/Sales";
import { SubSales } from "../Models/Entity/Sub.Sales";
import { Between, In, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { User } from "../Models/Entity/User";
import { PreSale } from "../Models/Entity/PreSale";

export class SubSaleRepository{
    private subSaleRepository: Repository<SubSales>;

    async getConnection(){
        if (!this.subSaleRepository)
            this.subSaleRepository = (await connect()).getRepository(SubSales);
    }

    async saveSubSale(subSale:SubSales){
        await this.getConnection();
        return await this.subSaleRepository.save(subSale);
    }

    async getSubSalesBySale(sale:Sale){
        await this.getConnection();
        return await this.subSaleRepository.find({
            where:{ sale},
            relations:["presentation","product"]
        });
    }

    async getSubSalesByPreSale(preSale:PreSale){
        await this.getConnection();
        return await this.subSaleRepository.find({
            where:{ preSale},
            relations:["presentation","product"]
        });
    }

    async getBySeller(seller:User,date:string){
        await this.getConnection();
        let dateFrom = date+"T00:00:00.000Z";
        let dateTo = date+"T23:59:59.0000Z";
        return await this.subSaleRepository.find({where:{ createAt: Between(dateFrom,dateTo) ,sale:{seller}}});
    }

    async findBySaleId(saleId:number){
        await this.getConnection();
        return await this.subSaleRepository.findOne({where:{sale:{saleId}},relations:["sale"]});
    }

    async deleteSubSale(subSale:SubSales){
        await this.getConnection();
        return await this.subSaleRepository.delete(subSale);
    }

}