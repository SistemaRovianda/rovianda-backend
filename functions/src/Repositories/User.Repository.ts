import {connect} from '../Config/Db';
import { Equal, In, IsNull, Not, Repository } from 'typeorm';
import { User } from '../Models/Entity/User';
import { Roles } from '../Models/Entity/Roles';
export class UserRepository{
    private userRepository:Repository<User>;

    async getConnection(){
        if(!this.userRepository){
            this.userRepository = (await connect()).getRepository(User);
        }
    }

    async saveUser(user:User){
        await this.getConnection();
        return await this.userRepository.save(user);
    }

    async getUserById(userId:string){
        await this.getConnection();
        return await this.userRepository.findOne({id:userId});
    }

    async getBydIds(ids:string[]){
        await this.getConnection();
        return await this.userRepository.find({where:{id: In(ids)}});
    }


    async getUserbyIdWithRol(id:string){
        await this.getConnection();
        return await this.userRepository.findOne({id},{relations:["roles"]});
    }

    async getUserByName(name:string){
        await this.getConnection();
        return await this.userRepository.findOne({
            where: {name: `${name}`},
        });
    }

    async getUserByEmail(email:string){
        await this.getConnection();
        return await this.userRepository.findOne({
            email,
            status:'ACTIVE'
        });
    }

    async getAllUsers(){
        await this.getConnection();
        return await this.userRepository.find({relations:["roles"]});
    }

    //87.- Servicio [GET] /report/formulation/{iniDate}/{finDate}
    async getByFullName(name:string){
        await this.getConnection();
        return await this.userRepository.query(`
        SELECT * FROM users WHERE name = "${name}"`);
    }

    async getByFullNameJob(name:string,firstSurname:string,lastSurname:string,job:string){
        await this.getConnection();
        return await this.userRepository.query(`
        SELECT * FROM users WHERE name = "${name}" 
        AND first_surname = "${firstSurname}" 
        AND last_surname = "${lastSurname}" 
        AND job = "${job}"`);
    }

    async getByRol(roles:Roles){
        await this.getConnection();
        return await this.userRepository.find({roles});
    }

    async getUserByFullName(name:string,firstSurname:string,lastSurname:string){
        await this.getConnection();
        return await this.userRepository.findOne({
            where: {name: `${name}`, firstSurname:`${firstSurname}`, lastSurname:`${lastSurname}`},
        });
    }

    async getByWarehouseId(warehouseKeySae:string){
        await this.getConnection();
        return await this.userRepository.findOne({warehouseKeySae});
    }

    async getAllSellers(rol:Roles){
        await this.getConnection();
        return await this.userRepository.find({where:{roles:rol,cve:Not(IsNull())}}); 
    }  

    async getAllSellersWithCVE(){
        await this.getConnection();
        return await this.userRepository.query(`select * from users where rol_id=10 and cve is not null and cve <>"";`) as any[];
    }  

    async getAllSellersWithCVEAndOperating(){
        await this.getConnection();
        return await this.userRepository.query(`select * from users where rol_id=10 and cve is not null and cve <>"" and cve<>"10V" and cve<>"8V";`) as any[];
    }

    async getAcumulatedBySellerProductNormal(sellerId:string,from:string,to:string,type:string){
        let subQuery="";
        if(type=="CANCELED"){
            subQuery=`sa.status_str="CANCELED" and`
        }else{
            subQuery=` sa.status_str<>"CANCELED" and `
        }
        await this.getConnection();
        return ((await this.userRepository.query(`
        select sum(sub.amount) as amount from sub_sales as sub
        left join sales as sa on sub.sale_id=sa.sale_id
        left join presentation_products as pp on sub.presentation_id =pp.presentation_id
        where ${subQuery} sa.seller_id="${sellerId}" and pp.type_product="NORMAL"
        and sa.date between "${from}T00:00:00.000Z" and "${to}T23:59:59.000Z"
        `)) as {amount:number}[])[0];
    }
    async getAcumulatedBySellerProductAbarrotes(sellerId:string,from:string,to:string,type:string){
        let subQuery="";
        if(type=="CANCELED"){
            subQuery=`sa.status_str="CANCELED" and`
        }else{
            subQuery=` sa.status_str<>"CANCELED" and `
        }
        await this.getConnection();
        return ((await this.userRepository.query(`
        select sum(sub.amount) as amount from sub_sales as sub
        left join sales as sa on sub.sale_id=sa.sale_id
        left join presentation_products as pp on sub.presentation_id =pp.presentation_id
        where ${subQuery} sa.seller_id="${sellerId}" and pp.type_product="ABARROTES"
        and sa.date between "${from}T00:00:00.000Z" and "${to}T23:59:59.000Z"
        `)) as {amount:number}[])[0];
    }
    async getAcumulatedBySellerProductCheeses(sellerId:string,from:string,to:string,type:string){
        let subQuery="";
        if(type=="CANCELED"){
            subQuery=`sa.status_str="CANCELED" and`
        }else{
            subQuery=` sa.status_str<>"CANCELED" and `
        }
        await this.getConnection();
        return ((await this.userRepository.query(`
        select sum(sub.amount) as amount from sub_sales as sub
        left join sales as sa on sub.sale_id=sa.sale_id
        left join presentation_products as pp on sub.presentation_id =pp.presentation_id
        where ${subQuery} sa.seller_id="${sellerId}" and pp.type_product="QUESOS"
        and sa.date between "${from}T00:00:00.000Z" and "${to}T23:59:59.000Z"
        `)) as {amount:number}[])[0];
    }

    async getAcumulatedBySellerProductNormalKG(sellerId:string,from:string,to:string,type:string){
        let subQuery="";
        if(type=="CANCELED"){
            subQuery=`status_str="CANCELED" and`
        }else{
            subQuery=` status_str<>"CANCELED" and `
        }
        await this.getConnection();
        return ((await this.userRepository.query(`
        select sum(if(pp.uni_med="PZ",sub.quantity*pp.price_presentation_min,sub.quantity)) as totalKg from sub_sales as sub left join presentation_products as pp
            on sub.presentation_id=pp.presentation_id
            where pp.type_product="NORMAL" and sub.sale_id in (select sale_id from sales where ${subQuery} seller_id="${sellerId}" 
            and date between "${from}T00:00:00.000Z" and "${to}T23:59:59.000Z" )
        `)) as {totalKg:number}[])[0];
    }

    async getAcumulatedBySellerProductCheesesKG(sellerId:string,from:string,to:string,type:string){
        let subQuery="";
        if(type=="CANCELED"){
            subQuery=`status_str="CANCELED" and`
        }else{
            subQuery=` status_str<>"CANCELED" and `
        }
        await this.getConnection();
        return ((await this.userRepository.query(`
        select sum(if(pp.uni_med="PZ",sub.quantity*pp.price_presentation_min,sub.quantity)) as totalKg from sub_sales as sub left join presentation_products as pp
            on sub.presentation_id=pp.presentation_id
            where pp.type_product="QUESOS" and sub.sale_id in (select sale_id from sales where ${subQuery} seller_id="${sellerId}"
            and date between "${from}T00:00:00.000Z" and "${to}T23:59:59.000Z" )
        `)) as {totalKg:number}[])[0];
    }

    async getRankingProductBySeller(sellerId:string,from:string,to:string,type:string){
        let subQuery="";
        if(type=="CANCELED"){
            subQuery=`sa.status_str="CANCELED" and`
        }else{
            subQuery=` sa.status_str<>"CANCELED" and `
        }
        await this.getConnection();
        let ranking = (await this.userRepository.query(`
        select sum(sub.amount) as amount,sum(if(pp.uni_med="PZ",sub.quantity*pp.price_presentation_min,sub.quantity)) as amountKg,pr.name,pp.type_presentation from sub_sales as sub left join sales as sa 
        on sub.sale_id=sa.sale_id
        left join products_rovianda as pr 
        on sub.product_id=pr.id
        left join presentation_products as pp on
        sub.presentation_id=pp.presentation_id
        where sa.seller_id="${sellerId}" and ${subQuery} sa.date between "${from}T00:00:00.000Z" and "${to}T23:59:59.000Z" 
        group by sub.presentation_id,sub.product_id
        `)) as {amount:number,amountKg:number,name:string,type_presentation:string}[];
        return ranking;
    }

    async getAllAdminSales(){
        await this.getConnection();
        return await this.userRepository.query(`
            select * from users where rol_id=16 and token is not null
        `);
    }
    async getAllUsersDelivers(){
        await this.getConnection();
        return await this.userRepository.query(`
        SELECT id,name FROM users 
        where (rol_id=10 or rol_id=13 or rol_id=14 or rol_id=15)
        and status="ACTIVE";
        `);
    }
}