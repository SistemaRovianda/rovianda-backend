import { In, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { Client } from "../Models/Entity/Client";

import { DayVisited } from "../Models/Entity/DayVisited";

export class DayVisitedRepository{

    private repository:Repository<DayVisited>;

    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(DayVisited);
        }
    }

    async saveDayVisited(dayVisited:DayVisited){
        await this.getConnection();
        return await this.repository.save(dayVisited);
    }

    async getDayVisitedById(daysVisitedId:number){
        await this.getConnection();
        return await this.repository.findOne({daysVisitedId});
    }

    async deteleDaysVisited(daysVisitedId:number){
        await this.getConnection();
        return await this.repository.delete({daysVisitedId});
    }

    async getClientsByDayOfVisitByDayAndClientIds(day:number,clients:number[]){
        await this.getConnection();
        
        switch(day){
            case 0:
                return await this.repository.find({where:{saturday:true,client:In(clients)},relations:["client"]});
                break;
            case 1:
                return await this.repository.find({where:{sunday:true,client:In(clients)},relations:["client"]});
                break;
            case 2:
                return await this.repository.find({where:{monday:true,client:In(clients)},relations:["client"]});
                break;
            case 3:
                return await this.repository.find({where:{tuesday:true,client:In(clients)},relations:["client"]});
                break;
            case 4:
                return await this.repository.find({where:{wednesday:true,client:In(clients)},relations:["client"]});
                break;
            case 5:
                return await this.repository.find({where:{thursday:true,client:In(clients)},relations:["client"]});
                break;
            case 6:
                return await this.repository.find({where:{friday:true,client:In(clients)},relations:["client"]});
                break;
            default:
                return [];
                break;
        }
    }

    async getByClient(client:Client){
        await this.getConnection();
        return await this.repository.findOne({client});
    }

}