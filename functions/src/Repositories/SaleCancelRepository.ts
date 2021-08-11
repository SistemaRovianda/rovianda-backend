import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { CancelRequest } from "../Models/DTO/Admin.Sales.Request";
import { SaleCancel } from "../Models/Entity/SaleCancel";

export class SaleCancelRepository{
    
    private repository:Repository<SaleCancel>;
    async getConnection(){
        if(!this.repository) this.repository= (await connect()).getRepository(SaleCancel);
    }

    async findCancelRequestByFolio(folio:string){
        await this.getConnection();
        return await this.repository.findOne({where:{folio},order:{salesCanceledId:"DESC"}});
    }

    async saveCancelSale(saleCancel:SaleCancel){
        await this.getConnection();
        return await this.repository.save(saleCancel);
    }

    async getAllSaleCancelsPending(type:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.repository.query(`
            select sc.folio,us.name as sellerName,sa.date,sa.sale_id as saleId,sc.create_at as createAt
            from sales_canceled as sc left join users as us on sc.seller_id=us.id
            left join sales as sa on sc.folio=sa.folio
            where sc.status="${type}" ${(type!="PENDING")?` and sc.create_at between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z"`:""};
        `) as CancelRequest[];
    }

}