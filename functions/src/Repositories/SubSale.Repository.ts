import { Sale } from "../Models/Entity/Sales";
import { SubSales } from "../Models/Entity/Sub.Sales";
import { Between, In, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { User } from "../Models/Entity/User";
import { PreSale } from "../Models/Entity/PreSale";
import { DailyReportRecord, DailyReportSalesADayRecord, EffectiveDeliverPreSalesReport } from "../Models/DTO/DailyReport";

export class SubSaleRepository{
    private subSaleRepository: Repository<SubSales>;

    async getConnection(){
        if (!this.subSaleRepository)
            this.subSaleRepository = (await connect()).getRepository(SubSales);
    }

    async saveSubSale(subSale:SubSales){
        await this.getConnection();
        return await this.subSaleRepository.save(subSale);
    }

    async getSubSalesBySale(sale:Sale){
        await this.getConnection();
        return await this.subSaleRepository.find({
            where:{ sale},
            relations:["presentation","product"]
        });
    }

    async getSubSalesByPreSale(preSale:PreSale){
        await this.getConnection();
        return await this.subSaleRepository.find({
            where:{ preSale},
            relations:["presentation","product"]
        });
    }

    async getBySeller(seller:User,date:string){
        await this.getConnection();
        let dateFrom = date+"T00:00:00.000Z";
        let dateTo = date+"T23:59:59.0000Z";
        return await this.subSaleRepository.find({where:{ createAt: Between(dateFrom,dateTo) ,sale:{seller}}});
    }

    async findBySaleId(saleId:number){
        await this.getConnection();
        return await this.subSaleRepository.findOne({where:{sale:{saleId}},relations:["sale"]});
    }

    async deleteSubSale(subSale:SubSales){
        await this.getConnection();
        return await this.subSaleRepository.delete(subSale);
    }

    async getDailyPreSaleReport(folio:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        let folioLike = "";
        if(folio!=null && folio!=""){
            folioLike=` pres.folio like "%${folio}%" and `
        }
        return await this.subSaleRepository.query(`
        select cl.key_client as claveCliente,cl.name as nombre,us.id as vendedorId,us.name as vendedor,ad.street as calle,ad.ext_number as numero_exterior,ad.suburb as colonia,
        ad.location as ciudad,ad.state as estado,ad.cp as codigo_postal,cl.reference as referencia,cl.contact as contacto,
        sum(if(pp.uni_med="PZ",pp.price_presentation_min*sub.quantity,sub.quantity)) as totalKg,sum(sub.amount) as totalMonto,
        dv.monday as lunes,dv.tuesday as martes,dv.wednesday as miercoles,dv.thursday as jueves,dv.friday as viernes,dv.saturday as sabado,date_format(pres.date_created,"%Y-%m-%d") as fecha
        from sub_sales as sub 
        left join sales as sa on sub.sale_id=sa.sale_id
        left join pre_sales as pres on pres.new_folio=sa.folio
        left join clients as cl on pres.client_id=cl.clients_client_id
        left join presentation_products as pp on sub.presentation_id=pp.presentation_id
        left join days_visited as dv on cl.clients_client_id=dv.client_id
        left join address as ad on cl.address_id=ad.address_id
        left join users as us on pres.pre_seller_id=us.id
        where  ${folioLike} pres.date_created between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" group by date_format(pres.date_created,"%Y-%m-%d"),pres.client_id,pres.pre_seller_id order by date_format(pres.date_created,"%Y-%m-%d"),pres.pre_seller_id;

        `) as DailyReportRecord[];
    }

    async getDailySaleReport(folio:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        let folioLike = "";
        if(folio!=null && folio!=""){
            folioLike=` sa.folio like "%${folio}%" and `
        }
        return await this.subSaleRepository.query(`
        select sa.seller_id as vendedorId,us.name as vendedor,prev.name as prevendedor,cl.key_client as claveCliente,cl.name as nombreCliente,sa.folio,sa.date as fecha,pr.name as producto,pp.type_presentation as presentacion,sub.quantity as cantidad,sub.amount as monto,date_format(sa.date,"%Y-%m-%d") as section
        from sub_sales as sub 
        left join pre_sales as pres on sub.pre_sale_id=pres.pre_sale_id
        left join users as prev on pres.pre_seller_id=prev.id
        left join sales as sa on sub.sale_id=sa.sale_id
        left join clients as cl on sa.client_id=cl.clients_client_id
        left join products_rovianda as pr on sub.product_id=pr.id
        left join presentation_products as pp on sub.presentation_id=pp.presentation_id
        left join users as us on sa.seller_id=us.id
        where  ${folioLike} sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" order by date_format(sa.date,"%Y-%m-%d"),sa.seller_id;
        `) as DailyReportSalesADayRecord[];
    }
    async getDailyPreSalesASellerReport(folio:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        let folioLike = "";
        if(folio!=null && folio!=""){
            folioLike=` pres.folio like "%${folio}%" and `
        }
        return await this.subSaleRepository.query(`
        select pres.pre_seller_id as vendedorId,us.name as vendedor,prev.name as prevendedor,cl.key_client as claveCliente,cl.name as nombreCliente,pres.folio,pres.date_created as fecha,pr.name as producto,pp.type_presentation as presentacion,sub.quantity as cantidad,sub.amount as monto,date_format(pres.date_created,"%Y-%m-%d") as section,pres.modificated
        from sub_sales as sub 
        left join pre_sales as pres on sub.pre_sale_id=pres.pre_sale_id
        left join users as prev on pres.pre_seller_id=prev.id
        left join clients as cl on pres.client_id=cl.clients_client_id
        left join products_rovianda as pr on sub.product_id=pr.id
        left join presentation_products as pp on sub.presentation_id=pp.presentation_id
        left join users as us on pres.pre_seller_id=us.id
        where ${folioLike} pres.date_created between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" order by date_format(pres.date_created,"%Y-%m-%d"),pres.pre_seller_id,pres.folio;
        `) as DailyReportSalesADayRecord[];
    }

    async getDailyEffectiveDeliverReport(folio:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        let folioLike = "";
        if(folio!=null && folio!=""){
            folioLike=` pres.folio like "%${folio}%" and `
        }
        return await this.subSaleRepository.query(`
        select us.name as vendedor,pres.folio,cl.key_client as claveCliente,cl.name as nombreCliente,pres.date_created as fecha,pres.amount as monto,pres.solded,date_format(sa.date,"%Y-%m-%d") as dateDelivered,pres.new_folio as folioVenta,sa.amount as montoVenta,pres.modificated as modificado,date_format(pres.date_created,"%Y-%m-%d") as section
        from pre_sales as pres
        left join sales as sa on sa.folio=pres.new_folio
        left join users as us on pres.pre_seller_id=us.id
        left join clients as cl on pres.client_id=cl.clients_client_id
        where ${folioLike} pres.date_created between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" order by date_format(pres.date_created,"%Y-%m-%d"),pres.pre_seller_id;
        `) as EffectiveDeliverPreSalesReport[];
    }
}