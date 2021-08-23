import { In, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { DevolutionEntityToDevolutionTicket } from "../Models/DTO/Sales.ProductDTO";
import { DevolutionOldSubSales } from "../Models/Entity/DevolutionOldSubSales";

export class DevolutionOldSubSaleRepository{

    private repository:Repository<DevolutionOldSubSales>;

    async getConnection(){
        if(!this.repository)  this.repository = (await connect()).getRepository(DevolutionOldSubSales);
    }

    async saveDevolutionOldSubSales(devolutionOldSubSales:DevolutionOldSubSales){
        await this.getConnection();
        return await this.repository.save(devolutionOldSubSales);
    }
    async getDevolutionOldSubSales(devolutionOldSubSaleId:number){
        await this.getConnection();
        return await this.repository.findOne({devolutionOldSubSaleId});
    }
    async getDevolutionOldSubSalesBySaleId(saleId:number){
        await this.getConnection();
        return await this.repository.find({saleId});
    }

    async getDevolutionOldSubSalesBySubSaleId(subSaleId:number,folio:string){
        await this.getConnection();
        return await this.repository.query(`
            select sum(doss.quantity) as quantity,sum(doss.amount) as amount,doss.sub_sale_id_identifier as subSaleId from devolutions_olds_sub_sales as doss where devolution_request_id in 
            (select devolution_app_request_id from devolutions_sellers_requests 
                where folio ="${folio}" and status="ACCEPTED") 
                where doss.sub_sale_id_identifier=${subSaleId}
        `) as {quantity:number,amount:number,subSaleId:number}[];
    }

    async getAllDevolutionsSubSalesBySellerAndDate(devolutionsRequestIds:number[]){
        await this.getConnection();
        return await this.repository.find({where:{devolutionRequestId:In(devolutionsRequestIds),type:"MODIFIED"}});
    }

    async getByDevolutionRequestIdAndType(devolutionRequestId:number,type:string){
        await this.getConnection();
        return await this.repository.find({where:{devolutionRequestId,type}});
    }

    async getByDevolutionRequestIdAndTypeToTicket(devolutionRequestId:number,type:string){
        await this.getConnection();
        return await this.repository.query(`
            select dss.quantity,dss.amount,pr.name,pp.type_presentation as presentation,pp.uni_med as uniMed
            from devolutions_olds_sub_sales as dss left join products_rovianda as pr
            on dss.product_id=pr.id left join presentation_products as pp 
            on dss.presentation_id=pp.presentation_id
            where dss.devolution_request_id=${devolutionRequestId} and type="${type}"
        `) as DevolutionEntityToDevolutionTicket[];
    }

}