import { Repository, Between, MoreThanOrEqual } from "typeorm";
import { EntranceDrief } from "../Models/Entity/Entrances.Drief";
import { connect } from "../Config/Db";
import { Product } from "../Models/Entity/Product";
import { EntranceOutputPackingFromOven, EntranceOutputsOven, InventoryTypeQuality, OutputsByEntrance, OutputsOfWarehouse, ProcessFormulation } from "../Models/DTO/Quality.DTO";

export class EntranceDriefRepository{
    private repository:Repository<EntranceDrief>;

    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(EntranceDrief);
        }
    }

    async saveDrief(entranceDrief:EntranceDrief){
        await this.getConnection();
        return await this.repository.save(entranceDrief);
    }

    async getEntranceDrief(entranceDriefId:number){
        await this.getConnection();
        return await this.repository.findOne({id:entranceDriefId});
    }

    async getEntranceDriefById(id:number){
        await this.getConnection();
        return await this.repository.findOne({id}, {relations:["product","warehouseDrief"]});
    }

    async deleteEntranceDrief(entranceDriefId:number){
        await this.getConnection();
        return await this.repository.delete({id:entranceDriefId});
    }

    async getLastEntrnaceDrief(){
        await this.getConnection();
        return await this.repository.query(`SELECT * FROM entrances_drief ORDER BY id DESC LIMIT 1`)
    }

    async getEntrancesDriefs(dateInit:string,dateEnd:string){
        await this.getConnection();
        return await this.repository.find({
            where:{ date : Between(dateInit, dateEnd)},
            order:{ date: "ASC"},
            relations:["product"]
        });
    }

    async getEntrnaceDriefByLotProduct(loteProveedor:string, productId:number){
        await this.getConnection();
        return await this.repository.query(`
        SELECT * FROM entrances_drief WHERE lote_proveedor = "${loteProveedor}" AND productId = ${productId}
        `);
    }

    async getEntrnaceDriefByLotProveedorProduct(loteProveedor:string, product:Product){
        await this.getConnection();
        return await this.repository.findOne({loteProveedor,product})
    }

    async getEntrnaceDriefByProduct(productId:number){
        await this.getConnection();
        return await this.repository.query(`
        SELECT * FROM entrances_drief WHERE productId = ${productId}
        `);
    }

    async findByLotId(loteId:string,date:string,page:number,peerPage:number){
        let skip = page*peerPage;
        await this.getConnection();
        return await this.repository.find({select:["id","proveedor","loteProveedor","date","quantity"],where:{loteProveedor:loteId,date:MoreThanOrEqual(date)},relations:["product"],take:peerPage,skip});
    }

    async findEntrancesByLotAndDate(lot:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.repository.query(`
        select pc.description as productName from entrances_drief as ed left join product_catalog as pc on ed.productId=pc.id
        where lote_proveedor like "%${lot}%" and date between "${dateStart}" and "${dateEnd}";
        `);
    }

    async getEntrancesOfDriefByLotAndDate(lot:string,productName:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.repository.query(`
        select ed.id as entranceId,ed.date,ed.proveedor as provider,pc.description as productName,ed.lote_proveedor as lotItern,ed.lote_proveedor as lotProvider,
        ed.quantity,ed.quality,ed.expiration,ed.transport,ed.strange_material as strangeMaterial,ed.paking,ed.odor,ed.color,ed.texture,ed.weight,ed.is_pz as isPz,
        wd.status
        from entrances_drief as ed left join product_catalog as pc on ed.productId=pc.id
        left join warehouse_drief as wd on ed.warehouse_drief=wd.id
        where ed.lote_proveedor like "%${lot}%" and pc.description="${productName}" and ed.date between "${dateStart}" and "${dateEnd}";
        `);
    }

    async getAllOutputsByLotProviderAndProduct(lotProvider:string,productId:number,offset:number,perPage:number){
        await this.getConnection();
        let items=await this.repository.query(`
        select fo.id,fo.temp,fo.date,fo.water_temp as waterTemp,fo.status,fo.lot_day as lotDay,fo.ingredients_process_ids as ingredientsProcessIds,pr.name,us.name as verifyBy,us2.name as makedBy,fo.type_formulation as typeFormulation,
        pr.id as productId
        from formulation as fo left join products_rovianda as pr on fo.product_rovianda_id=pr.id left join users as us on fo.verifitId=us.id left join users as us2 on fo.makeId=us2.id
        where fo.id in (
            select formulation_id from formulation_ingredients where lot_id in (
            select id from outputs_drief where lote_proveedor="${lotProvider}" and productId=${productId}
                )
            )
        limit ${perPage} offset ${offset}
        `) as OutputsByEntrance[];
        let count = await this.repository.query(`
        select count(*) as count
        from formulation as fo left join products_rovianda as pr on fo.product_rovianda_id=pr.id left join users as us on fo.verifitId=us.id left join users as us2 on fo.makeId=us2.id
        where fo.id in (
            select formulation_id from formulation_ingredients where lot_id in (
            select id from outputs_drief where lote_proveedor="${lotProvider}" and productId=${productId}
                )
            )
        `) as {count:number}[];
        return {
            items,
            count: count[0].count
        }
    }

    async getAllProcessByFormulation(formulationId:number){
        await this.getConnection();
        let item= await this.repository.query(`
        SELECT pro.id,pro.status,pro.current_process as currentProcess,pro.create_at as createAt,pro.type_process as typeProcess ,
        form.lot_day as lotDay,pr.name as productName,pr.id as productId
        FROM  process as pro left join formulation as form on pro.formulationId=form.id left join products_rovianda as pr on pro.product_rovianda_id=pr.id
        where form.id=${formulationId}
        `) as ProcessFormulation[];
        return {
            count:1,
            items:item
        }
    }

    async getAllProcessByFormulationPagination(lotProvider:string,productId:number,offset:number,perPage:number){
        await this.getConnection();
        let items= await this.repository.query(`
        SELECT pro.id,pro.status,pro.current_process as currentProcess,pro.create_at as createAt,pro.type_process as typeProcess ,
        form.lot_day as lotDay,pr.name as productName,pr.id as productId
        FROM  process as pro left join formulation as form on pro.formulationId=form.id left join products_rovianda as pr on pro.product_rovianda_id=pr.id
        where pro.formulationId in (
				select pif.formulation_id
						from process_ingredients_formulations as pif
						where pif.process_id in (
							 SELECT pro.id
								FROM  process as pro left join formulation as form on pro.formulationId=form.id left join products_rovianda as pr on pro.product_rovianda_id=pr.id
								where form.id in (

									select formulation_id from formulation_ingredients where lot_id in (
									select id from outputs_drief where lote_proveedor="${lotProvider}" and productId=${productId}
										)

									) 
						) union 
                        select formulation_id from formulation_ingredients where lot_id in (
						select id from outputs_drief where lote_proveedor="${lotProvider}" and productId=${productId}
            
                )
                )  limit ${perPage} offset ${offset}
        `) as ProcessFormulation[];
        let count = await this.repository.query(`
        SELECT count(*) as count
        FROM  process as pro left join formulation as form on pro.formulationId=form.id left join products_rovianda as pr on pro.product_rovianda_id=pr.id
        where pro.formulationId in (
				select pif.formulation_id
						from process_ingredients_formulations as pif
						where pif.process_id in (
							 SELECT pro.id
								FROM  process as pro left join formulation as form on pro.formulationId=form.id left join products_rovianda as pr on pro.product_rovianda_id=pr.id
								where form.id in (

									select formulation_id from formulation_ingredients where lot_id in (
									select id from outputs_drief where lote_proveedor="${lotProvider}" and productId=${productId}
										)

									) 
						) union 
                        select formulation_id from formulation_ingredients where lot_id in (
						select id from outputs_drief where lote_proveedor="${lotProvider}" and productId=${productId}
            
                )
                );
        `) as {count:number}[];
        return {
            count:count[0].count,
            items
        }
    }

    async getAllOvenByProcess(processId:number){
        await this.getConnection();
        let item= await this.repository.query(`
        select op.id,op.estimated_time as estimatedTime,op.new_lote as newLote,op.pcc,op.oven,op.date,op.status,
        op.observations,op.product_rovianda_id as productId,pr.name as productName
        from oven_products as op left join products_rovianda as pr on op.product_rovianda_id=pr.id
        left join process as pro on op.processId=pro.id
        where pro.id=${processId} or pro.ingredients_process_ids like "%,${processId},%" or pro.ingredients_process_ids like "%,${processId}]%" or pro.ingredients_process_ids like "%[${processId},%" or pro.ingredients_process_ids like "%[${processId}]%";
        `) as EntranceOutputsOven[];
        return {
            count:1,
            items:item
        }
    }

    async getAllOvenByProcessIngredientsNormal(lotProvider:string,productId:number){
        await this.getConnection();
        return await this.repository.query(`
        select distinct(pro.id) as processId
        from formulation as fo left join products_rovianda as pr on fo.product_rovianda_id=pr.id left join users as us on fo.verifitId=us.id left join users as us2 on fo.makeId=us2.id
        left join process as pro on fo.id=pro.formulationId
        where fo.id in (
                select formulation_id from formulation_ingredients where lot_id in (
                select id from outputs_drief where lote_proveedor="${lotProvider}" and productId=${productId}
                    )
            ) order by pro.create_at desc
        `) as {processId:number}[];
    }

    async getAllOvenByProcessPagination(offset:number,perPage:number,processIds:{processId:number}[]){
        await this.getConnection();
        console.log("JSON: "+JSON.stringify(processIds));
        let idsExact ="";
        let idsIncludes="";
        if(processIds.length){
            for(let id of processIds){
                idsExact+=` pro.id =${id.processId} or `;
                idsIncludes+=` pro.ingredients_process_ids like "%,${id.processId},%" or pro.ingredients_process_ids like "%[${id.processId},%" or pro.ingredients_process_ids like "%,${id.processId}]%" or pro.ingredients_process_ids like "%[${id.processId}]%" or `;
            }
            idsExact+=";";
            idsIncludes+=";";
            idsExact = idsExact.replace("or ;","");
            idsIncludes=idsIncludes.replace("or ;","");
            console.log("IdsExact: "+JSON.stringify(idsExact));
            console.log("IdsIncludes: "+JSON.stringify(idsIncludes));
        }
        
        let items= await this.repository.query(`
        select op.id,op.estimated_time as estimatedTime,op.new_lote as newLote,op.pcc,op.oven,op.date,op.status,
        op.observations,op.product_rovianda_id as productId,pr.name as productName
        from oven_products as op left join products_rovianda as pr on op.product_rovianda_id=pr.id
        left join process as pro on op.processId=pro.id
        where ${idsExact!=""?`(${idsExact})`:""} 
        ${(idsIncludes!="")?((idsExact!="")?` or (${idsIncludes})`:`(${idsIncludes})`):""}
                 order by op.date desc ${perPage!=null?`limit ${perPage}`:""} ${offset!=null?` offset ${offset}`:""} ;
        `) as EntranceOutputsOven[];
        let count= await this.repository.query(`
        select count(*) as count
        from oven_products as op left join products_rovianda as pr on op.product_rovianda_id=pr.id
        left join process as pro on op.processId=pro.id
                where ${idsExact!=""?`(${idsExact})`:""} 
                ${(idsIncludes!="")?((idsExact!="")?` or (${idsIncludes})`:`(${idsIncludes})`):""};     
        `) as {count:number}[];
        return {items,count:count[0].count}
    }

    async getAllPropacksByOven(lot:string,productId:number){
        await this.getConnection();
        let item= await this.repository.query(`
        select propack.properties_id as id,pack.register_date as registerDate,pack.lot_id as lotId,pack.expiration,pack.product_id,pr.name as productName,
        pp.type_presentation as presentation,propack.output_of_warehouse as outputOfWarehouse,propack.weight_of_warehouse as weightOfWarehouse
        ,pp.uni_med as uniMed,pack.id as packagingId
        from packaging as pack left join products_rovianda as pr on pack.product_id=pr.id
        left join properties_packaging as propack on pack.id=propack.packaging_id left join presentation_products as pp 
        on propack.presentation_id=pp.presentation_id
        where pack.lot_id="${lot}" and product_id=${productId};
        `) as EntranceOutputPackingFromOven[];
        return {
            count:1,
            items:item
        }
    }


    async getAllPropacksByOvenPagination(offset:number,perPage:number,ovensIds:EntranceOutputsOven[]){
        await this.getConnection();
        let items =[];
        let count:{count:number}[]=[{count:0}];
        let ovenIdsStr="";
        if(ovensIds.length){
            for(let id of ovensIds){
                ovenIdsStr+=`op.id=${id.id} or `;
            }
            ovenIdsStr+=";";
            ovenIdsStr=ovenIdsStr.replace("or ;","");
            items = await this.repository.query(`
            select propack.properties_id as id,pack.register_date as registerDate,pack.lot_id as lotId,pack.expiration,pack.product_id as productId,pr.name as productName,
            pp.type_presentation as presentation,propack.output_of_warehouse as outputOfWarehouse,propack.weight_of_warehouse as weightOfWarehouse
            ,pp.uni_med as uniMed,pack.id as packagingId
            from properties_packaging as propack  left join   packaging as pack
            on propack.packaging_id=pack.id left join 
            presentation_products as pp 
            on propack.presentation_id=pp.presentation_id
            left join products_rovianda as pr on pack.product_id=pr.id
            where pack.lot_id in (select distinct(op.new_lote)
            from oven_products as op
            where ${ovenIdsStr}
                            ) order by pack.register_date desc limit ${perPage} offset ${offset} 
            `);
            count = await this.repository.query(`
            select count(*) as count
            from properties_packaging as propack  left join   packaging as pack
            on propack.packaging_id=pack.id left join 
            presentation_products as pp 
            on propack.presentation_id=pp.presentation_id
            left join products_rovianda as pr on pack.product_id=pr.id
            where pack.lot_id in (select distinct(op.new_lote)
            from oven_products as op
            where ${ovenIdsStr} 
            )            
            `) as {count:number}[];
        }
        return {
            items,
            count:count[0].count
        }
    }

    async getInventoryOfDriefByDateEntrance(dateStart:string,dateEnd:string,offset:number,perPage:number,lot:string){
        await this.getConnection();
        let items= await this.repository.query(`
            select wd.id,ed.date as createAt,wd.status,wd.lote_proveedor as lotProvider,wd.quantity,pc.description,
            ed.proveedor as provider,us.name as receiver
            from warehouse_drief as wd left join entrances_drief as ed on wd.lote_proveedor=ed.lote_proveedor and
            ed.productId=wd.productId left join product_catalog as pc on wd.productId=pc.id
            left join users as us on wd.user_id=us.id
            ${(lot)?`where wd.lote_proveedor like "%${lot}%"`:""} 
            ${(dateStart && dateEnd)?((lot)?` and ed.date between "${dateStart}" and "${dateEnd}"`:` where ed.date between "${dateStart}" and "${dateEnd}"`):""}
            limit ${perPage} offset ${offset};
        `) as InventoryTypeQuality[];
        let count = await this.repository.query(`
            select count(*) as count
            from warehouse_drief as wd left join entrances_drief as ed on wd.lote_proveedor=ed.lote_proveedor and
            ed.productId=wd.productId left join product_catalog as pc on wd.productId=pc.id
            left join users as us on wd.user_id=us.id
            ${(lot)?`where wd.lote_proveedor like "%${lot}%"`:""} 
            ${(dateStart && dateEnd)?((lot)?` and ed.date between "${dateStart}" and "${dateEnd}"`:` where ed.date between "${dateStart}" and "${dateEnd}"`):""}
        `) as {count:number}[];
        return {
            items,
            count: count[0].count
        }
    }

    async getOutputsOfWarehouseDrief(lot:string,startDate:string,endDate:string,offset:number,perPage:number){
        await this.getConnection();
        let query =`select pc.description as name,replace(od.date,"/","-") as outputDate,od.status,od.lote_proveedor as lot
        from outputs_drief as od left join product_catalog as pc on od.productId=pc.id
        ${(lot)?` where od.lote_proveedor like "%${lot}%"`:""} 
        ${(startDate && endDate)?((lot)?` and od.date between "${startDate.split("-").join("/")}" and "${endDate.split("-").join("/")}"`:` where od.date between "${startDate.split("-").join("/")}" and "${endDate.split("-").join("/")}" `):""}
        limit ${perPage} offset ${offset}`;
        console.log("Query to execute: "+query);
        let items= await this.repository.query(query) as OutputsOfWarehouse[];
        let count=await this.repository.query(`
        select count(*) as count
        from outputs_drief as od left join product_catalog as pc on od.productId=pc.id
        ${(lot)?` where od.lote_proveedor like "%${lot}%"`:""} 
            ${(startDate && endDate)?((lot)?` and od.date between "${startDate.split("-").join("/")}" and "${endDate.split("-").join("/")}"`:` where od.date between "${startDate.split("-").join("/")}" and "${endDate.split("-").join("/")}"`):""}
        `) as {count:number}[];
        return {
            items,
            count:count[0].count
        }
    }
}