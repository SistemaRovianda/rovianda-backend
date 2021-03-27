import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Inspection } from '../Models/Entity/Inspection';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
export class InspectionRepository{
    private inspectionRepository:Repository<Inspection>;

    async getConnection(){
        if(!this.inspectionRepository){
            this.inspectionRepository = (await connect()).getRepository(Inspection);
        }
    }

    async getInspectionById(id:number){
        await this.getConnection();
        return await this.inspectionRepository.findOne({
            where: {id}
        });
    }

    async getLastInspection(){
        await this.getConnection();
        return await this.inspectionRepository.query(`SELECT * FROM inspection ORDER BY id DESC LIMIT 1`)
    }

    async getProductInspection(productId:number){
        await this.getConnection();
        return await this.inspectionRepository.find(
            { relations: ["productId"] }
        );
    }

    async createInspection(inspection:Inspection){
        await this.getConnection();
        return await this.inspectionRepository.save(inspection);
    }

    async getInspectionByLot(lot:string){
        await this.getConnection();
        return await this.inspectionRepository.findOne({
            where: {lotId: `${lot}`}
        });
    }
    async getInspectionsByLot(lot:string){
        await this.getConnection();
        return await this.inspectionRepository.find({
            where: {lotId: `${lot}`}
        });
    }

    async getInspectionsByNewLotAndProduct(newLot:string,product:ProductRovianda){
        await this.getConnection();
        return await this.inspectionRepository.find({
            where: {lotId:newLot,productId:product}
        });
    }

    async getByProcessId(processId:number){
        await this.getConnection();
        return await this.inspectionRepository.find({
            where:{processId}
        });
    }

    async getAllHistoryByOvenIds(ovenIds:number[]){
        await this.getConnection();
        let ids="(";
        for(let id of ovenIds){
            ids+=`${id},`;
        }
        ids+=")";
        ids=ids.replace(",)",")");
        return await this.inspectionRepository.query(`
        
        `);
    }
}