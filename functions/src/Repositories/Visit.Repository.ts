import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { ClientVisitData } from "../Models/DTO/Client.DTO";
import { VisitEntity } from "../Models/Entity/VisitEntity";


export class VisitRepository{
    private repository:Repository<VisitEntity>;
    async getConnection(){
        if(!this.repository) this.repository = (await connect()).getRepository(VisitEntity);
    }

    async saveVisit(visit:VisitEntity){
        await this.getConnection();
        return await this.repository.save(visit);
    }

    async getVisit(clientId:number,date:string){
        await this.getConnection();
        return await this.repository.findOne({client:{id:clientId},date});
    }

    async getVisitsBySellerAndDate(sellerId:string,date:string){
        await this.getConnection();
        return await this.repository.query(`select vr.visit_id as visitId,vr.observations,vr.visited,vr.amount,cl.name as clientName,cl.key_client as code,cl.latitude,cl.longitude
        from visit_records as vr 
        left join clients as cl on vr.client_id=cl.clients_client_id
        where vr.date="${date}" and cl.seller_owner="${sellerId}";`) as ClientVisitData[];
    }

    
}