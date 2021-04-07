import { Between, In, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { Client } from "../Models/Entity/Client";
import { VisitClientOperation } from "../Models/Entity/VisitClientOperation";

export class VisitClientOperationRepository{
    private repository:Repository<VisitClientOperation>;
    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(VisitClientOperation);
        }
    }

    async saveVisitClientOperation(visit:VisitClientOperation){
        await this.getConnection();
        return await this.repository.save(visit);
    }

    async getVisitClientOperationById(visitId:number){
        await this.getConnection();
        return await this.repository.findOne({visitId});
    }

    async deteleVisitClientOperation(visitId:number){
        await this.getConnection();
        return await this.repository.delete({visitId});
    }

    async findByDateAndClient(date:string,client:Client){
        await this.getConnection();
        return await this.repository.findOne({where:{date,client},relations:["client"]});
    }

    async getByClientOfSellerIdsAndDate(clientsId:number[],date:string){
        await this.getConnection();
        return await this.repository.find({
            where:{ client:{id:In(clientsId)},date},relations:["client"]
        });
    }
}