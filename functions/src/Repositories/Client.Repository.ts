import { In, Like, Repository } from "typeorm";
import { Client } from "../Models/Entity/Client";
import { connect } from "../Config/Db";
import { ClientItemBySeller, ClientsBySeller, ClientsListVisitedResult } from "../Models/DTO/Client.DTO";
import { response } from "express";
import { User } from "../Models/Entity/User";
import { OfflineNewVersionClient } from "../Models/DTO/Admin.Sales.Request";
import { SellerVisitsReportRequest } from "../Models/DTO/SellerOperationDTO";
import { SellerClientScheduleData, SellerVisit } from "../Models/SellerReportRequests";

export class ClientRepository{

    private clientRepository:Repository<Client>;

    async getConnection(){
        if(!this.clientRepository){
            this.clientRepository = (await connect()).getRepository(Client);
        }
    }

    async getLastClient(){
        await this.getConnection();
        return await this.clientRepository.findOne({order:{ id: 'DESC' }})
    }
    async saveClient(client:Client){
        await this.getConnection();
        return await this.clientRepository.save(client);
    }

    async getClientById(id:number){
        await this.getConnection();
        return await this.clientRepository.findOne({id});
    }
    async getClientByKeyClient(keyClient:number){
        await this.getConnection();
        return await this.clientRepository.findOne({where:{keyClient},relations:["address"]});
    }

    async getClientByMobileIdAndSeller(mobileId:number,seller:User){
        await this.getConnection();
        return await this.clientRepository.findOne({where:{clientMobileId:mobileId,seller},relations:["address"]});
    }

    async updateSincronizeStatusClients(ids:number[]){
        console.log("Ids",JSON.stringify(ids));
        await this.getConnection();
        return await this.clientRepository.update({id:In(ids)},{modified:false});
    }

    async getClientBySeller(seller:User){
        await this.getConnection();
        return await this.clientRepository.find({seller:seller,status:"ACTIVE"});
        /*return await this.clientRepository.query(
            `select deb.deb_id as debId,cli.client_id as clientId,cli.name as name,
            deb.amount,deb.create_day as createDay,deb.days from clients as cli 
            inner join debts as deb on cli.client_id=deb.client_id where cli.seller_owner="${sellerUid}" and deb.status=1;`) as Array<ClientsBySeller>;
            */
    }


    async deleteClientById(clientId:number){
        await this.getConnection();
        return await this.clientRepository.delete({id:clientId});
    }
    async getAllClientBySeller(seller:User){
        await this.getConnection();
        return await this.clientRepository.find({seller,status:"ACTIVE"});
    }

    async getAllClientBySellerAndHint(seller:User,keyClient:number){
        await this.getConnection();
        return await (await this.clientRepository.find({seller:seller,keyClient,status:"ACTIVE"}));
    }

    async getCurrentCountCustomer(){
        await this.getConnection();
        return await this.clientRepository.query("SELECT `AUTO_INCREMENT` as noCount FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = new_rovianda AND   TABLE_NAME   = clients");
    }
    
    async findByClientKey(keyClient:number){
        await this.getConnection();
        return await this.clientRepository.findOne({keyClient});
    }
    async getClientBySellerAndDebts(seller:User){
        await this.getConnection();
        return await this.clientRepository.find({seller,hasDebts:true,status:"ACTIVE"});
    }

    async getAllClients(page:number,perPage:number,hint:string,sellerId:string){
        await this.getConnection();
        let skip = (page)*perPage;
        let count:any[]=[{count:0}];
        let items=[];
        if(hint){
            count=await this.clientRepository.query(
                `select count(*) as count from clients as cl left join users as us on cl.seller_owner=us.id 
                where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'"  ':""} and cl.name like "%${hint}%" `
                ) as {count:number}[];
            items= await this.clientRepository.query(
            `select cl.*,us.name as sellerName from clients as cl left join users as us on cl.seller_owner=us.id 
            where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'" ':""} and cl.name like "%${hint}%" limit ${perPage}  offset ${skip}`
            );
        }else{
            count=await this.clientRepository.query(
                `select count(*) as count from clients as cl left join users as us on cl.seller_owner=us.id
                 where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'" ':""} `
                ) as {count:number}[];
            items= await this.clientRepository.query(
            `select cl.*,us.name as sellerName from clients as cl left join users as us on cl.seller_owner=us.id
             where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'" ':""} limit ${perPage}  offset ${skip}`
            );
        }
        return {
            count: count[0].count,
            items: items as Array<any>
        }
    }
    async getAllClientsByCodeSae(page:number,perPage:number,hint:string,sellerId:string){
        await this.getConnection();
        let skip = (page)*perPage;
        let count:any[]=[{count:0}];
        let items=[];
        if(hint){
            count=await this.clientRepository.query(`select count(*) as count from clients as cl left join users as us on cl.seller_owner=us.id 
            where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'" ':""} and cl.key_sae_new like "%${hint}%"`
            ) as {count:number}[];
            items= await this.clientRepository.query(
            `select cl.*,us.name as sellerName from clients as cl left join users as us on cl.seller_owner=us.id 
            where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'" ':""} and cl.key_sae_new like "%${hint}%" limit ${perPage}  offset ${skip}`
            );
        }else{
            count=await this.clientRepository.query(
                `select count(*) as count from clients as cl left join users as us on cl.seller_owner=us.id
                 where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'" ':""} `
                ) as {count:number}[];
            items= await this.clientRepository.query(
            `select cl.*,us.name as sellerName from clients as cl left join users as us on cl.seller_owner=us.id
             where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'" ':""} limit ${perPage}  offset ${skip}`
            );
        }
        return {
            count:count[0].count,
            items: items as Array<any>
        }
    }

    async getAllClientsByCodeSystem(page:number,perPage:number,hint:string,sellerId:string){
        await this.getConnection();
        let skip = (page)*perPage;
        let count:any[]=[{count:0}];
        let items=[];
        if(hint){
            count=await this.clientRepository.query(`select count(*) as count from clients as cl left join users as us on cl.seller_owner=us.id 
            where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'"  ':""} and cl.key_client = ${hint} `
            ) as {count:number}[];
            items= await this.clientRepository.query(
            `select cl.*,us.name as sellerName from clients as cl left join users as us on cl.seller_owner=us.id 
            where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'"  ':""} and cl.key_client = ${hint} limit ${perPage}  offset ${skip}`
            );
        }else{
            count=await this.clientRepository.query(`select count(*) as count from clients as cl left join users as us on cl.seller_owner=us.id
            where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'" ':""} `
           ) as {count:number}[];
            items= await this.clientRepository.query(
            `select cl.*,us.name as sellerName from clients as cl left join users as us on cl.seller_owner=us.id
             where cl.status='ACTIVE' ${sellerId!=null?' and cl.seller_owner="'+sellerId+'" ':""} limit ${perPage}  offset ${skip}`
            );
        }
        return {
            count:count[0].count,
            items: items as Array<any>
        }
    }

    
    async getAllClientsToAdminSales(){
        await this.getConnection();
        return await this.clientRepository.find({where:{status:'ACTIVE'}});
    }

    async getClientPublic(){
        await this.getConnection();
        return await this.clientRepository.findOne({where:{keyClient:1175}});
    }

    async getLastCount(){
        await this.getConnection();
        return await this.clientRepository.query(`select clients_client_id as clientId from clients order by clients_client_id desc limit 1`) as {clientId:number}[];
    }

    async getClientsOfflineNewVersion(sellerId:string){
        await this.getConnection();
        return await this.clientRepository.query(
            `
            select cl.clients_client_id as clientId,cl.key_client as keyClient,cl.seller_owner as sellerOwner,cl.name,cl.type_cliente as type,cl.current_credit as currentCreditUsed,cl.credit as creditLimit, ad.cp,
            if(dv.monday=1,'true','false') as monday,if(dv.tuesday=1,'true','false') as tuesday,if(dv.wednesday=1,'true','false') as wednesday,if(dv.thursday=1,'true','false') as thursday,if(dv.friday=1,'true','false') as friday,if(dv.saturday=1,'true','false') as saturday,if(dv.sunday=1,'true','false') as sunday,if(cl.modified=1,'true','false') as modified,
            ad.street,ad.ext_number as extNum,ad.suburb,ad.municipality,cl.latitude,cl.longitude,cl.status,cl.phone,cl.reference,cl.contact
            from clients as cl left join days_visited as dv on dv.client_id=cl.clients_client_id
            left join address as ad on cl.address_id=ad.address_id
            where (cl.seller_owner="${sellerId}" and cl.status="ACTIVE");
            `
            ) as OfflineNewVersionClient[];
    }

    async getCustomerReportBySeller(sellerId:string,type:string,hint:string){
        await this.getConnection();
        let subQuery =``;
        if(sellerId!=null && sellerId!=""){
            subQuery=` where cl.seller_owner="${sellerId}" `;
        }
        if(type!="" && type!=null){
            if(subQuery!=""){
                subQuery+=" and "
            }else{
                subQuery+=" where "
            }
            if(type=="NAME"){
                subQuery+=` cl.name like "%${hint}%" `
            }else if(type=="CODE_SAE"){
                
                subQuery+=` cl.key_sae_new like "%${hint}%" `
            }else if(type=="CODE_SYSTEM"){
                
                subQuery+=` cl.key_client =${hint} `
            }
        }
        console.log(subQuery);
        return await this.clientRepository.query(
            `
            select cl.type_cliente as TIPO,cl.key_client as CLAVE_SISTEMA,cl.key_sae_new as CLAVE_SAE,cl.name as NOMBRE,cl.rfc as RFC,us.name as VENDEDOR,addr.street as CALLE,addr.ext_number as NUMERO_EXTERIOR,addr.suburb as COLONIA,addr.location as CIUDAD,addr.state as ESTADO,addr.cp as CODIGO_POSTAL,cl.reference as REFERENCIA,cl.contact as CONTACTO
            from clients as cl
            left join users as us on cl.seller_owner=us.id
            left join address as addr on cl.address_id=addr.address_id
            ${subQuery}
            `
            ) as ClientItemBySeller[];
    }

    async getAllClientsVisited(sellerId:string,date:string){
        await this.getConnection();
        return await this.clientRepository.query(`
        select cl.clients_client_id as clientId,cl.key_client as keyClient,cl.name,cl.latitude,cl.longitude,if(t.count is not null,t.count,0) as count,dv.monday,dv.tuesday,dv.wednesday,dv.thursday,dv.friday,dv.saturday,dv.sunday from clients as cl 
        left join 
        (select count(*) as count,client_id from sales where seller_id="${sellerId}" and date between "${date}T00:00:00.000Z" AND "${date}T23:59:00.000Z" group by client_id) as t
        on t.client_id=cl.clients_client_id
        left join days_visited as dv on cl.clients_client_id=dv.client_id
        where cl.seller_owner="${sellerId}";
        `) as ClientsListVisitedResult[];
    }

    async getVisits(request:SellerVisitsReportRequest,day:string,date:string){
        await this.getConnection();
        let sellers="(";
        let dayCondition = ` dv.${day}=1 `;
        let sellers2 = "(";
        let sellersAdded:boolean=false;
        for(let seller of request.sellersIds){
            sellers+=` sa.seller_id="${seller}" or`;
            sellers2+=` cl.seller_owner="${seller}" or`;
            sellersAdded=true;
        }
        sellers+=";";
        sellers=sellers.replace("or;",") and ");
        sellers2+=";";
        sellers2=" and  "+sellers2.replace("or;",") ");
        if(!sellersAdded){
            sellers="";
            sellers2="";
        }
        let result:{items:SellerVisit[],dateString:string}={items:[],dateString:""};
        result.items= await this.clientRepository.query(`
        select * from (select sa.client_id as clientId,1 as mustVisited,sa.amount,cl.name,cl.key_client as keyClient,sa.seller_id as sellerId,sel.name as sellerName from sales as sa
            left join clients as cl on sa.client_id=cl.clients_client_id
            left join users as sel on sa.seller_id=sel.id
            where ${sellers}  
            sa.client_id in (select dv.client_id as clientId from days_visited as dv 
            left join clients as cl on dv.client_id=cl.clients_client_id
            where ${dayCondition}  ${sellers2}) and
            sa.date between "${date}T00:00:00.000Z" and "${date}T23:59:59.000Z") as t1 
            union (select client_id as clientId,0 as mustVisited,amount,cl.name,cl.key_client as keyClient,sa.seller_id as sellerId,sel.name as sellerName from sales as sa
            left join clients as cl on sa.client_id=cl.clients_client_id
            left join users as sel on sa.seller_id=sel.id
            where ${sellers}  
            sa.client_id not in (select dv.client_id as clientId from days_visited as dv 
            left join clients as cl on dv.client_id=cl.clients_client_id
            where ${dayCondition}  ${sellers2}) and
            sa.date between "${date}T00:00:00.000Z" and "${date}T23:59:59.000Z")
            union (select cl.clients_client_id as clientId,1 as mustVisited,0 as amount,cl.name,cl.key_client as keyClient,sel.id as sellerId,sel.name as sellerName
            from clients as cl 
            left join users as sel on cl.seller_owner = sel.id
            where cl.clients_client_id in (select dv.client_id as clientId from days_visited as dv 
            left join clients as cl on dv.client_id=cl.clients_client_id
            where ${dayCondition}  ${sellers2}) and
            cl.clients_client_id not in (select client_id from sales as sa where ${sellers} sa.date between "${date}T00:00:00.000Z" and "${date}T23:59:59.000Z")
            ) order by sellerName;
        `) as SellerVisit[];
        result.dateString=date;
        return result;
    }

    async getAllClientsScheduleByDate(day:string,sellersIds:string[]){
        let days ="";
        switch(day){
            case "MONDAY":
                days="dv.monday=1"
                break;
            case "TUESDAY":
                days="dv.tuesday=1"
                break;
            case "WEDNESDAY":
                days="dv.wednesday=1"
                break;
            case "THURSDAY":
                days="dv.thursday=1"
                break;
            case "FRIDAY":
                days="dv.friday=1"
                break;
            case "SATURDAY":
                days="dv.saturday=1"
                break;
            case "ALL":
                days="";
                break;
        }
        let sellersCondition="(";
        for(let sellerId of sellersIds){
            sellersCondition+=`"${sellerId}",`
        }
        sellersCondition+=";";
        sellersCondition=sellersCondition.replace(",;",")");
        await this.getConnection();
        return await this.clientRepository.query(`
        select cl.name, cl.type_cliente as typeClient,cl.key_client as keyClient,cl.key_sae_new as aspelKey,cl.status,addr.location as city,addr.suburb as suburb,addr.street as street,sl.name as sellerName,dv.monday,dv.tuesday,dv.wednesday,dv.thursday,dv.friday,dv.saturday
        from clients as cl
        left join users as sl
        on cl.seller_owner=sl.id
        left join address as addr on cl.address_id=addr.address_id
        left join days_visited as dv 
        on  cl.clients_client_id=dv.client_id
        where cl.seller_owner in ${sellersCondition} ${days.length?" and "+days:""} order by sl.name asc
        `) as SellerClientScheduleData[];

    }
}