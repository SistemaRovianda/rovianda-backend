import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { Devolution } from "../Models/Entity/Devolution";
import { OvenProducts } from "../Models/Entity/Oven.Products";

export class DevolutionRepository{
    private repository:Repository<Devolution>;

    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(Devolution);    
        }
    }

    async saveDevolution(devolution:Devolution){
        await this.getConnection();
        return await this.repository.save(devolution);
    }

    async getDevolutionById(id:number){
        await this.getConnection();
        return await this.repository.findOne({id});
    }

    async getDevolutionByOvenProduct(ovenProduct:OvenProducts){
        await this.getConnection();
        return await this.repository.find({ovenProduct});
    }

    async getAllHistoryByOvenIds(ovenIds:number[]){
        await this.getConnection();
        let ids ="(";
        for(let id of ovenIds){
            ids+=`${id},`;
        }
        ids+=")";
        ids=ids.replace(",)",")");
        return await this.repository.query(`
        select dev.id,dev.units,dev.lot_id as lotDay,dev.date,pro.name,pre.type_presentation as presentation from devolutions as dev right join 
        oven_products as oven on dev.oven_product_id=oven.id right join presentation_products as pre 
        on dev.presentation_id=pre.presentation_id right join products_rovianda as pro on pre.product_rovianda_id=pro.id
        where oven_product_id in ${ids}
        `);
    }
}