import { Repository } from "typeorm";
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

    async saveClient(client:Client){
        await this.getConnection();
        return await this.clientRepository.save(client);
    }

    async getClientBySeller(seller:User){
        await this.getConnection();
        return await this.clientRepository.find({seller:seller});
        /*return await this.clientRepository.query(
            `select deb.deb_id as debId,cli.client_id as clientId,cli.name as name,
            deb.amount,deb.create_day as createDay,deb.days from clients as cli 
            inner join debts as deb on cli.client_id=deb.client_id where cli.seller_owner="${sellerUid}" and deb.status=1;`) as Array<ClientsBySeller>;
            */
    }

    async getAllClientBySeller(seller:User){
        await this.getConnection();
        return await this.clientRepository.find({seller});
    }

    async getAllClientBySellerAndHint(seller:User,keyClient:number){
        await this.getConnection();
        return await (await this.clientRepository.find({seller:seller,keyClient}));
    }

    async getCurrentCountCustomer(){
        await this.getConnection();
        return await this.clientRepository.query("SELECT `AUTO_INCREMENT` as noCount FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = rovianda-test-dev AND   TABLE_NAME   = clients");
    }
    
    async findByClientKey(keyClient:number){
        await this.getConnection();
        return await this.clientRepository.findOne({keyClient});
    }
    async getClientBySellerAndDebts(seller:User){
        await this.getConnection();
        return await this.clientRepository.find({seller,hasDebts:true});
    }


}