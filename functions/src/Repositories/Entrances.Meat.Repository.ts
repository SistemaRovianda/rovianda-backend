import {connect} from '../Config/Db';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';
import { EntranceOutputPackingFromOven, EntranceOutputsOven, IngredientsFormulation, InventoryTypeQuality, OutputsByEntrance, OutputsOfWarehouse, ProcessFormulation, ProductInfoFromPackDefrostTrazability, ProductInfoFromPackIngredientsTrazability, ProductInfoFromPackTrazability } from '../Models/DTO/Quality.DTO';

export class EntranceMeatRepository{
    private entrancesMeatRepository:Repository<EntranceMeat>;

    async getConnection(){
        if(!this.entrancesMeatRepository){
            this.entrancesMeatRepository = (await connect()).getRepository(EntranceMeat);
        }
    }

    async findByLotId(lotId:string,date:string,page:number,peerPage:number){
        let skip = page*peerPage;
        await this.getConnection();
        return await this.entrancesMeatRepository.find({select:["id","createdAt","loteInterno","loteProveedor","proveedor","weight","rawMaterial"],where:{loteInterno:lotId,createdAt:MoreThanOrEqual(date)},take:peerPage,skip});
    }
    

    async saveEntrancesMeat(entranceMeat:EntranceMeat){
        await this.getConnection();
        return await this.entrancesMeatRepository.save(entranceMeat);
    }

    async getLastEntrnaceMeat(){
        await this.getConnection();
        return await this.entrancesMeatRepository.query(`SELECT * FROM entrances_meat ORDER BY id DESC LIMIT 1`)
    }

    async getEntranceMeatById(id:number){
        await this.getConnection();
        return await this.entrancesMeatRepository.findOne({id});
    }


   

    async getEntrancesMeats(dateInit:string,dateEnd:string){
        await this.getConnection();
        return await this.entrancesMeatRepository.find({
            order : { createdAt:"ASC" },
            where:{ createdAt : Between(dateInit, dateEnd)}
    });
    }

    async getMeatByLot(lotId:string){
        await this.getConnection();
        return await this.entrancesMeatRepository.createQueryBuilder("meat")
        .where("meat.loteProveedor = :lotId", { lotId })
        .orWhere("meat.loteInterno = :lotId", { lotId })
        .getOne();
    }

    async getEntranceMeatByLotInter(loteInterno:string){
        await this.getConnection();
        return await this.entrancesMeatRepository.find({loteInterno})
    }

    async findEntrancesByLotAndDate(lot:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.entrancesMeatRepository.query(`
        SELECT distinct(raw_material) as productName FROM entrances_meat 
        where lote_interno like "%${lot}%" and created_at between "${dateStart}" and "${dateEnd}";
        `);
    }

    async findEntrancesDetailsbyLotAndDate(lot:string,productName:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.entrancesMeatRepository.query(`
        select em.id as entranceId,em.created_at as date,em.proveedor as provider,em.raw_material as productName,em.lote_interno as lotIntern,em.lote_proveedor as lotProvider,fl.url as evidence,us.name as qualityInspector,
        em.job as area,em.weight,em.temperature,em.strangeMaterial,em.expiration,em.packing,em.odor,em.color,em.transport,em.texture,em.fridge,em.slaughter_date as slaughterDate
        from entrances_meat as em left join files as fl on em.photoFileId=fl.file_id left join users as us on em.qualityInspectorId = us.id
        where em.lote_interno like "%${lot}%" and em.raw_material="${productName}" and created_at between "${dateStart}" and "${dateEnd}";
        `) as any[];
    }

    async getWarehouseCoolingBydEntranceMeat(loteProveedor:string,loteInterno:string,productName:string,fridgeId:number){
        await this.getConnection();
        return await this.entrancesMeatRepository.query(`
            select * from cooling as co  left join raw on co.raw_material_id=raw.id where co.lote_interno = "${loteInterno}" and co.lote_proveedor="${loteProveedor}" and 
            co.fridgeFridgeId=${fridgeId} and raw.raw_material="${productName}"
        `);
    }

    async getInventoryOfCoolingByDateEntrance(dateStart:string,dateEnd:string,offset:number,perPage:number,lot:string){
        await this.getConnection();
        let items= await this.entrancesMeatRepository.query(`
            select co.id,em.created_at as createAt,co.status,co.lote_interno as lotIntern,co.lote_proveedor as lotProvider,
            co.quantity,us.name as receiver,fri.temp,fri.description as fridgeDescription,raw.raw_material as description,em.proveedor as provider
            from cooling as co left join entrances_meat as em on co.lote_interno=em.lote_interno and co.lote_proveedor=em.lote_proveedor
            left join users as us on em.qualityInspectorId=us.id left join fridges as fri on co.fridgeFridgeId=fri.fridge_id
            left join raw on co.raw_material_id=raw.id 
            ${(lot)?`where co.lote_interno like "%${lot}%"`:""} 
            ${(dateStart && dateEnd)?((lot)?` and em.created_at between "${dateStart}" and "${dateEnd}"`:` where em.created_at between "${dateStart}" and "${dateEnd}"`):""}
            limit ${perPage} offset ${offset};
        `) as InventoryTypeQuality[];
        let count = await this.entrancesMeatRepository.query(`
            select count(*) as count
            from cooling as co left join entrances_meat as em on co.lote_interno=em.lote_interno and co.lote_proveedor=em.lote_proveedor
            left join users as us on em.qualityInspectorId=us.id left join fridges as fri on co.fridgeFridgeId=fri.fridge_id
            left join raw on co.raw_material_id=raw.id 
            ${(lot)?`where co.lote_interno like "%${lot}%"`:""} 
            ${(dateStart && dateEnd)?((lot)?` and em.created_at between "${dateStart}" and "${dateEnd}"`:` where em.created_at between "${dateStart}" and "${dateEnd}"`):""}
        `) as {count:number}[];
        return {
            items,
            count: count[0].count
        }
    }
    
    async getAllOutputsByLotProviderAndLotIntern(lotProvider:string,lotIntern:string,offset:number,perPage:number){
        await this.getConnection();
        let items= await this.entrancesMeatRepository.query(`
        select fo.id,fo.temp,fo.date,fo.water_temp as waterTemp,fo.status,fo.lot_day as lotDay,fo.ingredients_process_ids as ingredientsProcessIds,pr.name,us.name as verifyBy,us2.name as makedBy,fo.type_formulation as typeFormulation,
        pr.id as productId
        from formulation as fo left join products_rovianda as pr on fo.product_rovianda_id=pr.id left join users as us on fo.verifitId=us.id left join users as us2 on fo.makeId=us2.id
        where fo.id in (
        select formulation_id from defrost_formulation where defrostDefrostId in (SELECT defrost_id FROM  defrost where output_cooling in 
        (SELECT oc.id FROM  outputs_cooling as oc left join raw  on oc.rawMaterialId=raw.id where oc.lote_proveedor ="${lotProvider}" and oc.lote_interno ="${lotIntern}"))
        ) order by date desc limit ${perPage} offset ${offset} 
        `) as OutputsByEntrance[];

        let count= await this.entrancesMeatRepository.query(`
        select count(*) as count
        from formulation as fo left join products_rovianda as pr on fo.product_rovianda_id=pr.id left join users as us on fo.verifitId=us.id left join users as us2 on fo.makeId=us2.id
        where fo.id in (
        select formulation_id from defrost_formulation where defrostDefrostId in (SELECT defrost_id FROM  defrost where output_cooling in 
        (SELECT oc.id FROM  outputs_cooling as oc left join raw  on oc.rawMaterialId=raw.id where oc.lote_proveedor ="${lotProvider}" and oc.lote_interno ="${lotIntern}"))
        ) 
        `) as {count:number}[];
        return {items,count:count[0].count}
    }

    async getAllIngredientsByOutputId(outputId:number){
        await this.getConnection();
        return await this.entrancesMeatRepository.query(`
        SELECT pc.description as productName,od.lote_proveedor as lotProvider,od.date as dateOutput,od.observations FROM  formulation_ingredients as fi left join product_catalog as pc on fi.product_id=pc.id 
        left join outputs_drief as od on fi.lot_id=od.id
        where formulation_id=${outputId} 
        `) as IngredientsFormulation[];
        
    }

    async getAllProcessByFormulation(formulationId:number){
        await this.getConnection();
        let item= await this.entrancesMeatRepository.query(`
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

    async getAllProcessByFormulationPagination(offset:number,perPage:number,lotIntern:string,lotProvider:string){
        await this.getConnection();
        let items= await this.entrancesMeatRepository.query(`
        SELECT pro.id,pro.status,pro.current_process as currentProcess,pro.create_at as createAt,pro.type_process as typeProcess ,
        form.lot_day as lotDay,pr.name as productName,pr.id as productId
        FROM  process as pro left join formulation as form on pro.formulationId=form.id left join products_rovianda as pr on pro.product_rovianda_id=pr.id
        where form.id in (
        select pif.formulation_id
        from process_ingredients_formulations as pif
        where pif.process_id in (
        SELECT pro.id
        FROM  process as pro left join formulation as form on pro.formulationId=form.id left join products_rovianda as pr on pro.product_rovianda_id=pr.id
        where form.id in (
        select formulation_id from defrost_formulation where defrostDefrostId in (SELECT defrost_id FROM  defrost where output_cooling in 
        (SELECT oc.id FROM  outputs_cooling as oc left join raw  on oc.rawMaterialId=raw.id where oc.lote_proveedor ="${lotProvider}" and oc.lote_interno ="${lotIntern}"))
        )) 
        union 
        select distinct(fo.id) as formulation_id
        from formulation as fo left join products_rovianda as pr on fo.product_rovianda_id=pr.id left join users as us on fo.verifitId=us.id left join users as us2 on fo.makeId=us2.id
        left join process as pro on fo.id=pro.formulationId 
        where fo.id in (
        select formulation_id from defrost_formulation where defrostDefrostId in (SELECT defrost_id FROM  defrost where output_cooling in 
        (SELECT oc.id FROM  outputs_cooling as oc left join raw  on oc.rawMaterialId=raw.id where oc.lote_proveedor ="${lotProvider}" and oc.lote_interno ="${lotIntern}"))
                ) ) order by pro.create_at desc limit ${perPage} offset ${offset};
        `) as ProcessFormulation[];
        let count= await this.entrancesMeatRepository.query(`
        SELECT count(*) as count
        FROM  process as pro left join formulation as form on pro.formulationId=form.id left join products_rovianda as pr on pro.product_rovianda_id=pr.id
        where form.id in (
        select pif.formulation_id
        from process_ingredients_formulations as pif
        where pif.process_id in (
        SELECT pro.id
        FROM  process as pro left join formulation as form on pro.formulationId=form.id left join products_rovianda as pr on pro.product_rovianda_id=pr.id
        where form.id in (
        select formulation_id from defrost_formulation where defrostDefrostId in (SELECT defrost_id FROM  defrost where output_cooling in 
        (SELECT oc.id FROM  outputs_cooling as oc left join raw  on oc.rawMaterialId=raw.id where oc.lote_proveedor ="${lotProvider}" and oc.lote_interno ="${lotIntern}"))
        )) 
        union 
        select distinct(fo.id) as formulation_id
        from formulation as fo left join products_rovianda as pr on fo.product_rovianda_id=pr.id left join users as us on fo.verifitId=us.id left join users as us2 on fo.makeId=us2.id
        left join process as pro on fo.id=pro.formulationId 
        where fo.id in (
        select formulation_id from defrost_formulation where defrostDefrostId in (SELECT defrost_id FROM  defrost where output_cooling in 
        (SELECT oc.id FROM  outputs_cooling as oc left join raw  on oc.rawMaterialId=raw.id where oc.lote_proveedor ="${lotProvider}" and oc.lote_interno ="${lotIntern}"))
                ) ) order by pro.create_at desc
        `) as {count:number}[];
        return {items,count:count[0].count}
    }


    async getAllOvenByProcess(processId:number){
        await this.getConnection();
        let item= await this.entrancesMeatRepository.query(`
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
        
        let items= await this.entrancesMeatRepository.query(`
        select op.id,op.estimated_time as estimatedTime,op.new_lote as newLote,op.pcc,op.oven,op.date,op.status,
        op.observations,op.product_rovianda_id as productId,pr.name as productName
        from oven_products as op left join products_rovianda as pr on op.product_rovianda_id=pr.id
        left join process as pro on op.processId=pro.id
        where ${idsExact!=""?`(${idsExact})`:""} 
        ${(idsIncludes!="")?((idsExact!="")?` or (${idsIncludes})`:`(${idsIncludes})`):""}
                 order by op.date desc ${perPage!=null?`limit ${perPage}`:""} ${offset!=null?` offset ${offset}`:""} ;
        `) as EntranceOutputsOven[];
        let count= await this.entrancesMeatRepository.query(`
        select count(*) as count
        from oven_products as op left join products_rovianda as pr on op.product_rovianda_id=pr.id
        left join process as pro on op.processId=pro.id
                where ${idsExact!=""?`(${idsExact})`:""} 
                ${(idsIncludes!="")?((idsExact!="")?` or (${idsIncludes})`:`(${idsIncludes})`):""};     
        `) as {count:number}[];
        return {items,count:count[0].count}
    }

    async getAllOvenByProcessIngredientsNormal(lotIntern:string,lotProvider:string){
        await this.getConnection();
        return await this.entrancesMeatRepository.query(`
        select distinct(pro.id) as processId
        from formulation as fo left join products_rovianda as pr on fo.product_rovianda_id=pr.id left join users as us on fo.verifitId=us.id left join users as us2 on fo.makeId=us2.id
        left join process as pro on fo.id=pro.formulationId
        where fo.id in (
            select formulation_id from defrost_formulation where defrostDefrostId in (SELECT defrost_id FROM  defrost where output_cooling in 
            (SELECT oc.id FROM  outputs_cooling as oc left join raw  on oc.rawMaterialId=raw.id where oc.lote_proveedor ="${lotProvider}" and oc.lote_interno ="${lotIntern}"))
            ) order by pro.create_at desc
        `) as {processId:number}[];
    }

    async getAllPropacksByOven(lot:string,productId:number){
        await this.getConnection();
        let item= await this.entrancesMeatRepository.query(`
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
            items = await this.entrancesMeatRepository.query(`
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
            count = await this.entrancesMeatRepository.query(`
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

    async getProductInfoFromPackingToTrazability(id:number){
        await this.getConnection();
        let items= await this.entrancesMeatRepository.query(`
        select propack.properties_id,pack.product_id as productId,pr.name as productName,pp.type_presentation as presentation,
        pack.register_date as registerDate,pack.expiration,pack.lot_id as lotId,
        pp.uni_med,propack.output_of_warehouse as outputOfWarehouse,propack.weight_of_warehouse as weightOfWarehouse,
        pp.presentation_id as presentationId,
        propack.active
        from properties_packaging as propack 
        left join packaging as pack on propack.packaging_id=pack.id
        left join products_rovianda as pr on pack.product_id= pr.id
        left join presentation_products as pp on propack.presentation_id=pp.presentation_id
        where propack.properties_id=${id};
        `) as ProductInfoFromPackTrazability[];
        return items[0];
    }

    async getProductInfoFromPackingToTrazabilityDefrost(ids:number[]){
        await this.getConnection();
        let items=[];
        let idsStr = "";
        if(ids.length){
            for(let id of ids){
                idsStr+=` id=${id} or `;
            }
            idsStr+=";";
            idsStr=idsStr.replace("or ;","");
        items= await this.entrancesMeatRepository.query(`
        select em.created_at as dateEntrance,em.temperature,em.lote_proveedor as lotProvider,em.lote_interno as lotIntern,em.slaughter_date as slaughterDate,
        em.raw_material as rawMaterial,em.proveedor as provider,em.fridge from defrost_formulation as df
        left join defrost as def on df.defrostDefrostId=def.defrost_id
        left join outputs_cooling as oc on def.output_cooling=oc.id
        left join entrances_meat as em on em.lote_interno=oc.lote_interno and em.lote_proveedor=oc.lote_proveedor
        where df.formulation_id in (
        select formulationId from process where ${idsStr}
        );
        `) as ProductInfoFromPackDefrostTrazability[];
        // id in (
        //     select processId  from oven_products where new_lote="${lot}" and product_rovianda_id=${productId}
        // )
        }

        return items;
    }

    async getProcessOfProductEndedLotProductId(lot:string,productId:number){
        await this.getConnection();
        return await this.entrancesMeatRepository.query(`
            select id as processId from process where id in (
            select processId  from oven_products where new_lote="${lot}" and product_rovianda_id=${productId}
            ) union
            select process_id as processId from process_ingredients_formulations where formulation_id in (
                select formulationId from process where id in (
                    select processId  from oven_products where new_lote="${lot}" and product_rovianda_id=${productId}
                    )  
            )
        `) as {processId:number}[];
    }

    async getProductInfoFromPackingToTrazabilityIngredients(lot:string,productId:number){
        await this.getConnection();
        let items= await this.entrancesMeatRepository.query(`
        select od.lote_proveedor as lotProvider,edr.date as entranceDate,pc.description as productName,edr.proveedor as provider from formulation_ingredients as fi 
        left join outputs_drief as od on fi.lot_id=od.id
        left join product_catalog as pc on od.productId=pc.id
        left join entrances_drief as edr on od.warehouseDriefId=edr.warehouse_drief
        where fi.formulation_id  in (
            select formulationId from process where id in (
                select processId  from oven_products where new_lote="${lot}" and product_rovianda_id=${productId}
            ) union
            select formulation_id from process where id in (
                select process_id from process_ingredients_formulations where formulation_id in (
                    select formulationId from process where id in (
                        select processId  from oven_products where new_lote="${lot}" and product_rovianda_id=${productId}
                    )
                )
            )
        );
        `) as ProductInfoFromPackIngredientsTrazability[];
        return items;
    }

    async getStartDateEndDateDistribution(lot:string,productId:number,presentationId:number){
        return await this.entrancesMeatRepository.query(`
        select (select output_date from suborder_metadata as sm left join suborders as sub
            on sm.sub_order_id=sub.suborder_id
            where sm.lote_id="${lot}" and sub.product_id=${productId} and sub.presentation_id=${presentationId}
            order by output_date asc limit 1) as startDate,
            (select output_date from suborder_metadata as sm left join suborders as sub
            on sm.sub_order_id=sub.suborder_id
            where sm.lote_id="${lot}" and sub.product_id=${productId} and sub.presentation_id=${presentationId}
            order by output_date desc limit 1) as endDate;
        `) as {startDate:string,endDate:string}[];
    }

    async getOutputsOfWarehouseMeat(lot:string,startDate:string,endDate:string,offset:number,perPage:number){
        await this.getConnection();
        let items= await this.entrancesMeatRepository.query(`
            select raw.raw_material as name,oc.output_date as outputDate,
            oc.quantity,oc.status,oc.lote_proveedor as lot
            from outputs_cooling as oc left join raw on oc.rawMaterialId=raw.id
            ${(lot)?` where oc.lote_interno like "%${lot}%" `:""} 
            ${(startDate && endDate)?((lot)?` and oc.output_date between "${startDate}" and "${endDate}"`:` where oc.output_date between "${startDate}" and "${endDate}" `):""}
            limit ${perPage} offset ${offset}
        `) as OutputsOfWarehouse[];
        let count = await this.entrancesMeatRepository.query(`
            select count(*) as count
            from outputs_cooling as oc left join raw on oc.rawMaterialId=raw.id
            ${(lot)?` where oc.lote_interno like "%${lot}%" `:""} 
            ${(startDate && endDate)?((lot)?` and oc.output_date between "${startDate}" and "${endDate}"`:` where oc.output_date between "${startDate}" and "${endDate}" `):""}
        `) as {count:number}[];
        return  {
            items,
            count:count[0].count
        }
    }

}
