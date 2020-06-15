import { Repository } from "typeorm";
import { PropertiesPackaging } from "../Models/Entity/Properties.Packaging";
import { connect } from "../Config/Db";

export class PropertiesPackagingRepository {
    private repository: Repository<PropertiesPackaging>;
    async getConnection() {
        if (!this.repository) {
            this.repository = (await connect()).getRepository(PropertiesPackaging);
        }
    }

    async savePropertiesPackaging(propertiesPackaging: PropertiesPackaging) {
        await this.getConnection();
        return await this.repository.save(propertiesPackaging);
    }

    async getLastPropertiesPackaging(){
        await this.getConnection();
        return await this.repository.query(`SELECT * FROM packaging ORDER BY id DESC LIMIT 1`)
    }

    async findPropiertiesPackagingByPackagingId(id:number){
        await this.getConnection();
        return await this.repository.findOne({
            where: {productId: `${id}`}
        });
    }

    async findPropiertiesPackagingByPresentationId(id:number){
        await this.getConnection();
        return await this.repository.findOne({
            where: {presentationId: `${id}`}
        });
    }

    async findPropiertiesPackagingById(id: number){
        await this.getConnection();
        return await this.repository.findOne({id});
    }

}