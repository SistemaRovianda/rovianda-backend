import { Repository } from "typeorm";
import { SubOrderMetadata } from "../Models/Entity/SubOrder.Sale.Seller.Metadata";
import { connect } from "../Config/Db";

export class SubOrderMetadataRepository{

    private repository:Repository<SubOrderMetadata>;

    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(SubOrderMetadata);
        }
    }

    async saveSubOrderMetadata(subOrderMetadata:SubOrderMetadata){
        await this.getConnection();
        return await this.repository.save(subOrderMetadata);
    }


}