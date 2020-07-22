import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { SalesRequest } from '../Models/Entity/Sales.Request';

export class SalesRequestRepository{
    private salesRequestRepository:Repository<SalesRequest>;

    async getConnection(){
        if(!this.salesRequestRepository){
            this.salesRequestRepository = (await connect()).getRepository(SalesRequest);
        }
    }

    async getSalesRequest(){
        await this.getConnection();
        return await this.salesRequestRepository.find({
            where: {status: 0}
        });
    }

    async saveSalesProduct(sale:SalesRequest){
        await this.getConnection();
        return await this.salesRequestRepository.save(sale);
    }

    async getLastSales(){
        await this.getConnection();
        return await this.salesRequestRepository.findOne({
            order: {
                requestId: 'DESC'
                }
        });
    }

}