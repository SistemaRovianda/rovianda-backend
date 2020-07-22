import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { SaleSeller } from '../Models/Entity/Sale.Seller';

export class SalesSellerRepository{
    private salesSellerRepository:Repository<SaleSeller>;

    async getConnection(){
        if(!this.salesSellerRepository){
            this.salesSellerRepository= (await connect()).getRepository(SaleSeller);
        }
    }

    async saveSalesSeller(sale:SaleSeller){
        await this.getConnection();
        return await this.salesSellerRepository.save(sale);
    }

    async getLastSaleSeller(){
        await this.getConnection();
        return await this.salesSellerRepository.findOne({
            order: {
                id: 'DESC'
                }
        });
    }

}