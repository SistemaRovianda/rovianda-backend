import { Repository } from "typeorm";
import { PreSalesVinculationSeller } from "../Models/Entity/PreSalesVinculationSeller";
import { connect } from "../Config/Db";

export class PreSalesVinculationSellerRepository{
    private repository:Repository<PreSalesVinculationSeller>;
    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(PreSalesVinculationSeller);
        }
    }

    async savePreSaleVinculationSeller(preSaleVinculationSeller:PreSalesVinculationSeller){
        await this.getConnection();
        return await this.repository.save(preSaleVinculationSeller);
    }
    async getAllPreSalesVinculationSellerByPreSaleSellerId(preSaleSellerId:string){
        await this.getConnection();
        return await this.repository.find({where:{preSaleSellerId}});
    }

    async deletePreSaleVinculation(preSaleVinculation:PreSalesVinculationSeller){
        await this.getConnection();
        return await this.repository.delete(preSaleVinculation);
    }
}