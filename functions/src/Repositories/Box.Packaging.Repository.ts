import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { BoxPackaging } from '../Models/Entity/Box.Packaging';
export class BoxPackagingRepository{
    private boxPackagingRepository:Repository<BoxPackaging>;

    async getConnection(){
        if(!this.boxPackagingRepository){
            this.boxPackagingRepository = (await connect()).getRepository(BoxPackaging);
        }
    }

    async createBoxPackaging(boxPackaging:BoxPackaging){
        await this.getConnection();
        return await this.boxPackagingRepository.save(boxPackaging);
    }

    async getMaxBox(){
        await this.getConnection();
        let max = await this.boxPackagingRepository
        .createQueryBuilder("box_packaging")
        .select("MAX(box_packaging.count_end)", "max")
        .getRawOne();

        return max;
    }

    async findBoxPackagingByPropiertiesId(id:number){
        await this.getConnection();
        return await this.boxPackagingRepository.findOne({
            where:{ propertiesId : id }
        });
    }
}