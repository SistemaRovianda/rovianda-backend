import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Packaging } from '../Models/Entity/Packaging';
export class PackagingRepository{
    private packagingRepository:Repository<Packaging>;

    async getConnection(){
        if(!this.packagingRepository){
            this.packagingRepository = (await connect()).getRepository(Packaging);
        }
    }

    async savePackaging(packaging:Packaging){
        await this.getConnection();
        return await this.packagingRepository.save(packaging);
    }

    async getAllPackaging(){
        await this.getConnection();
        return await this.packagingRepository.find();
    }

    async getHistoryPackaging(lotId:number){
        await this.getConnection();
        return await this.packagingRepository.createQueryBuilder("packaging")
        .innerJoin("packaging.productId", "*")
        .innerJoin("products_rovianda.id", "*")
        .innerJoin("process.id", "*")
        .getMany();
    }
    
    async getPackagingByLotId(lotId:number){
        await this.getConnection();
        return await this.packagingRepository.findOne({
            where: {lotId: `${lotId}`}
        });
    }
  
    async findPackagingById(id:number){
        await this.getConnection();
        return await this.packagingRepository.findOne({
            where:{id:`${id}`},
            relations:["productId","userId"]
        });
    }

    async getLastPackaging(){
        await this.getConnection();
        return await this.packagingRepository.query(`SELECT * FROM packaging ORDER BY id DESC LIMIT 1`)
    }

    async getPackaging(){
        await this.getConnection();
        return await this.packagingRepository.find({
            relations:["productId","propertiesPackaging"]
         }
        );
    }

    async findPropiertiesPackagingById(id:number){
        await this.getConnection();
        return await this.packagingRepository.query(`
        SELECT * FROM properties_packaging
        WHERE properties_packaging.packaging_id = ${id};`);
    }
}