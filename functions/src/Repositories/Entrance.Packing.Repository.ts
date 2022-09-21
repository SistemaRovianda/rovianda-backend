import { Repository, Between } from "typeorm";
import { connect } from "../Config/Db";
import { EntrancePacking } from "../Models/Entity/Entrances.Packing";
import { times } from "lodash";
import { Product } from "../Models/Entity/Product";
import { InventoryTypeQuality, OutputsOfWarehouse } from "../Models/DTO/Quality.DTO";

export class EntrancePackingRepository{
    private repository:Repository<EntrancePacking>;
    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(EntrancePacking);
        }
    }

    async saveEntracenPacking(entranceDrief:EntrancePacking){
        await this.getConnection();
        return await this.repository.save(entranceDrief);
    }

    async getEntrancePacking(entrancePackingId:number){
        await this.getConnection();
        return await this.repository.findOne({id:entrancePackingId});
    }

    async deleteEntracePacking(entrancePackingId:number){
        await this.getConnection();
        return await this.repository.delete({id:entrancePackingId});
    }

    async getLastEntrnacePacking(){
        await this.getConnection();
        return await this.repository.query(`SELECT * FROM entrances_packing ORDER BY id DESC LIMIT 1`)
    }

    async getBypakingId(id:number){
        await this.getConnection();
        return await this.repository.findOne(
            {id},
            {relations: ["product","make"]}
        );
    }

    async getEntrysPacking(dateInit:string,dateEnd:string){
        await this.getConnection();
        return await this.repository.find({
            order : { date:"ASC" },
            where:{ date : Between(dateInit, dateEnd)},
            relations: ["product","verifit","make"]
    });
    }

    async getEntrnacePackingByLotProduct(loteProveedor:string, productId:number){
        await this.getConnection();
        return await this.repository.query(`
        SELECT * FROM entrances_packing WHERE lote_proveedor = "${loteProveedor}" AND productId = ${productId}
        `);
    }

    async getEntrnacePackingByLotProveedorProduct(loteProveedor:string,product:Product){
        await this.getConnection()
        return await this.repository.findOne(
            {loteProveedor,product},
            {relations:["product"]});
    }

    async findEntrancesByLotAndDate(lot:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.repository.query(`
        select pc.description as productName from entrances_packing as ep left join product_catalog as pc on ep.productId=pc.id
        where lote_proveedor like "%${lot}%" and  date between "${dateStart}" and "${dateEnd}";
        `);
    }

    async getEntrancesOfPackingByLotAndDate(lot:string,productName:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.repository.query(`
        select ep.id as entranceId,ep.date,ep.proveedor as provider,pc.description as productName,ep.lote_proveedor as lotIntern,ep.lote_proveedor as lotProvider,us.name as qualityInspector,
        ep.quantity,ep.observations,ep.is_pz as isPz,ep.is_box as isBox,ep.quality,ep.strange_material as strangeMaterial,ep.paking,ep.transport ,
        wp.status
        from entrances_packing as ep left join product_catalog as pc on ep.productId=pc.id left join users as us on ep.makeId=us.id 
        left join warehouse_packing as wp on ep.lote_proveedor=wp.lote_proveedor and ep.productId=wp.productId
        where pc.description ="${productName}" and ep.lote_proveedor like "%${lot}%" and ep.date between "${dateStart}" and "${dateEnd}";
        `);
    }

    async getInventoryOfPackingByDateEntrance(dateStart:string,dateEnd:string,offset:number,perPage:number,lot:string){
        await this.getConnection();
        let items= await this.repository.query(`
        select wp.id,ep.date as createAt,wp.status,wp.lote_proveedor as lotProvider,
        ep.proveedor as provider,wp.quantity,us.name as receiver,pc.description
        from warehouse_packing as wp left join entrances_packing as ep on wp.lote_proveedor=ep.lote_proveedor 
        and wp.productId =ep.productId left join users as us on wp.user_id=us.id 
        left join product_catalog as pc on wp.productId=pc.id 
        ${(lot)?`where wp.lote_proveedor like "%${lot}%" and ep.date=wp.date`:""} 
        ${(dateStart && dateEnd)?((lot)?` and ep.date=wp.date and ep.date between "${dateStart}" and "${dateEnd}"`:` where ep.date=wp.date and ep.date between "${dateStart}" and "${dateEnd}"`):""}
        limit ${perPage} offset ${offset};
        `) as InventoryTypeQuality[]; 
        let count = await this.repository.query(`
            select count(*) as count
            from warehouse_packing as wp left join entrances_packing as ep on wp.lote_proveedor=ep.lote_proveedor 
            and wp.productId =ep.productId left join users as us on wp.user_id=us.id 
            left join product_catalog as pc on wp.productId=pc.id and ep.date=wp.date
            ${(lot)?`where wp.lote_proveedor like "%${lot}%" and ep.date=wp.date`:""} 
        ${(dateStart && dateEnd)?((lot)?` and ep.date=wp.date and ep.date between "${dateStart}" and "${dateEnd}"`:` where ep.date=wp.date and ep.date between "${dateStart}" and "${dateEnd}"`):""}
        `) as {count:number}[];   
        return {
            items,
            count: count[0].count
        }
    }

    async getOutputsOfWarehouseDrief(lot:string,startDate:string,endDate:string,offset:number,perPage:number){
        await this.getConnection();
        let items = await this.repository.query(`
            select pc.description as name,op.date as outputDate,op.lote_proveedor as lot
            from outputs_packing as op left join product_catalog as pc on op.id=pc.id
            ${lot?` where op.lote_proveedor like "${lot}" `:""}
            ${(startDate && endDate)?((lot)?` and op.date between "${startDate}" and "${endDate}"`:` where op.date between "${startDate}" and "${endDate}"`):""}
            limit ${perPage} offset ${offset}
        `) as OutputsOfWarehouse[];
        let count = await this.repository.query(`
            select count(*) as count
            from outputs_packing as op left join product_catalog as pc on op.id=pc.id
            ${lot?` where op.lote_proveedor like "${lot}" `:""}
            ${(startDate && endDate)?((lot)?` and op.date between "${startDate}" and "${endDate}"`:` where op.date between "${startDate}" and "${endDate}"`):""}
        `) as {count:number}[];
        return {
            items,
            count: count[0].count
        }
    }
}