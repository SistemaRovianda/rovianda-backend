import { Repository } from "typeorm";
import { Client } from "../Models/Entity/Client";
import { connect } from "../Config/Db";
import { ClientsBySeller } from "../Models/DTO/Client.DTO";

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

    async getClientBySeller(sellerUid:string){
        await this.getConnection();
        return await this.clientRepository.query(
            `select deb.deb_id as debId,cli.client_id as clientId,cli.name as name,cli.first_surname as firstSurname,
            cli.last_surname as lastSurname,deb.amount,deb.create_day as createDay,deb.days from clients as cli 
            inner join debts as deb on cli.client_id=deb.client_id where cli.seller_owner="${sellerUid}" and deb.active=1;`) as Array<ClientsBySeller>;
    }

    async getCurrentCountCustomer(){
        await this.getConnection();
        return await this.clientRepository.query("SELECT `AUTO_INCREMENT` as noCount FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = rovianda-test-dev AND   TABLE_NAME   = clients");
    }

}