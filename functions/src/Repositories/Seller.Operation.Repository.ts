import { Repository } from "typeorm";
import { SellerOperation } from "../Models/Entity/Seller.Operations";
import { connect } from "../Config/Db";
import { User } from "../Models/Entity/User";

export class SellerOperationRepository{
    private repository:Repository<SellerOperation>;
    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(SellerOperation);
        }
    }

    async saveSellerOperation(sellerOperation:SellerOperation){
        await this.getConnection();
        return await this.repository.save(sellerOperation);
    }

    async getAllSellerOpetations(){
        await this.getConnection();
        return await this.repository.find();
    }

    async getSellerOperationById(sellerOperationId:number){
        await this.getConnection();
        return await this.repository.findOne({sellerOperationId});
    }

    async getSellerOperationByDateUser(date:string,seller:User){
        await this.getConnection();
        return await this.repository.findOne({seller,date});
    }

}