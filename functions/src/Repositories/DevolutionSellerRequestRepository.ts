import { Between, In, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { CancelRequest } from "../Models/DTO/Admin.Sales.Request";
import { DevolutionSellerRequest } from "../Models/Entity/DevolutionSellerRequest";

export class DevolutionSellerRequestRepository{

    private repository:Repository<DevolutionSellerRequest>;

    async getConnection(){
        if(!this.repository) this.repository = (await connect()).getRepository(DevolutionSellerRequest);
    }

    async saveDevolutionSellerRequest(devolutionSellerRequest:DevolutionSellerRequest){
        await this.getConnection();
        return await this.repository.save(devolutionSellerRequest);
    }

    async getDevolutionSellerRequestByFolio(folio:string){
        await this.getConnection();
        return await this.repository.findOne({where:{folio,status:"PENDING"},order:{devolutionSellerRequestId:"DESC"}});
    }

    async getDevolutionAcceptedSellerRequestByFolio(folio:string){
        await this.getConnection();
        return await this.repository.findOne({where:{folio},order:{devolutionSellerRequestId:"DESC"}});
    }

    async getDevolutionSellerRequestById(devolutionSellerRequestId:number){
        await this.getConnection();
        return await this.repository.findOne({devolutionSellerRequestId});
    }

    async acceptDevolutionSellerRequest(devolutionSellerRequestId:number){
        await this.getConnection(); 
        return await this.repository.update({devolutionSellerRequestId},{status:"ACCEPTED"});
    }

    async declineDevolutionSellerRequest(devolutionSellerRequestId:number){
        await this.getConnection(); 
        return await this.repository.update({devolutionSellerRequestId},{status:"DECLINED"});
    }
    async updateViewDevolutionSellerRequest(devolutionSellerRequestId:number){
        await this.getConnection(); 
        return await this.repository.update({devolutionSellerRequestId},{viewed:true});
    }

    async getAllPendingDevolutionSellerRequest(){
        await this.getConnection();
        return await this.repository.find({status:"PENDING"});
    }
    async getAllAcceptedDevolutionSellerRequest(){
        await this.getConnection();
        return await this.repository.find({status:"ACCEPTED"});
    }
    async getAllDeclinedDevolutionSellerRequest(){
        await this.getConnection();
        return await this.repository.find({status:"DECLINED"});
    }

    async getAllDevolutionsOfSellerAndDate(sellerId:string,date:string){
        await this.getConnection();
        let dateStart = date+"T00:00:00.000Z";
        let dateEnd = date+"T23:59:59.000Z";
        return await this.repository.query(`
            select devolution_seller_request_id as id,folio,status from devolutions_sellers_requests where devolution_seller_request_id in (
                select max(devolution_seller_request_id) as devolution_seller_request_id 
                from devolutions_sellers_requests where seller_id="${sellerId}" and create_at between "${dateStart}" and "${dateEnd}" group by folio);
        `) as {folio:string,status:string,id:number}[];
    }

    async getEntitiesToDataInitial(devolutionsIds:number[]){
        await this.getConnection();
        return await this.repository.find({where:{devolutionSellerRequestId:In(devolutionsIds)}});
    }

    async getAllSaleDevolutionsPending(type:string,dateStart:string,dateEnd:string,page:string,perPage:string){
        await this.getConnection();
        let items= await this.repository.query(`
            select dsr.devolution_seller_request_id as requestId,dsr.folio,us.name as sellerName,sa.date,sa.sale_id as saleId,dsr.create_at as createAt,dsr.status
            from devolutions_sellers_requests as dsr  left join users as us on dsr.seller_id=us.id
            left join sales as sa on dsr.folio=sa.folio
            where dsr.status="${type}" ${(type!="PENDING" && dateStart && dateEnd)?` and dsr.date_attended between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z"`:""}
            ${(page&&perPage)?` limit ${+perPage} offset ${+page*+perPage} `:""}
        `) as CancelRequest[];
        let count= await this.repository.query(`
        select count(*) as count
        from devolutions_sellers_requests as dsr  left join users as us on dsr.seller_id=us.id
        left join sales as sa on dsr.folio=sa.folio
        where dsr.status="${type}" ${(type!="PENDING" && dateStart && dateEnd)?` and dsr.date_attended between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z"`:""}
        
    `) as {count:number}[];
    return {
        items,
        count:count[0].count
    }
    }

}