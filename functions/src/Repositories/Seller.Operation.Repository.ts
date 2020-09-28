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

    async getLastSellerOperation(sellerId:string){
        await this.getConnection();
        return await this.repository.query(`select seller_operation_id as sellerOperationId from seller_operations where seller_id="${sellerId}" and eating_time_end='' order by seller_operation_id DESC LIMIT 1;`) as Array<{sellerOperationId:number}>;
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