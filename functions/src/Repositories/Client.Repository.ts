import { Like, Repository } from "typeorm";
import { Client } from "../Models/Entity/Client";
import { connect } from "../Config/Db";
import { ClientsBySeller } from "../Models/DTO/Client.DTO";
import { response } from "express";
import { User } from "../Models/Entity/User";

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

    async getAllClients(page:number,perPage:number,hint:string){
        await this.getConnection();
        let skip = (page)*perPage;
        let count=0;
        let items=[];
        if(hint){
            count=await this.clientRepository.count({where:{status:"ACTIVE",name:Like(`%${hint}%`)}});
            items= await this.clientRepository.query(
            `select * from clients where status='ACTIVE' and name like "%${hint}%" limit ${perPage}  offset ${skip}`
            );
        }else{
            count=await this.clientRepository.count({where:{status:"ACTIVE"}});
            items= await this.clientRepository.query(
            `select * from clients where status='ACTIVE' limit ${perPage}  offset ${skip}`
            );
        }
        return {
            count,
            items: items as Array<any>
        }
    }

    async getClientPublic(){
        await this.getConnection();
        return await this.clientRepository.findOne({where:{keyClient:1175}});
    }

    async getLastCount(){
        await this.getConnection();
        return await this.clientRepository.query(`select clients_client_id as clientId from clients order by clients_client_id desc limit 1`) as {clientId:number}[];
    }

}