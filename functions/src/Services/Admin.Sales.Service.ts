import { ClientEditRequest } from "../Models/DTO/Client.DTO";
import { Address } from "../Models/Entity/Address";
import { Client } from "../Models/Entity/Client";
import { DayVisited } from "../Models/Entity/DayVisited";
import { Roles } from "../Models/Entity/Roles";
import { ClientRepository } from "../Repositories/Client.Repository";
import { DayVisitedRepository } from "../Repositories/DayVisitedRepository";
import { RolesRepository } from "../Repositories/Roles.Repository";
import { UserRepository } from "../Repositories/User.Repository";

export class AdminSalesService{

    private sellerRepository:UserRepository;
    private rolRepository:RolesRepository;
    private dayVisitedRepository:DayVisitedRepository;
    private clientRepository:ClientRepository;
    constructor(){
        this.sellerRepository = new UserRepository();
        this.rolRepository = new RolesRepository();
        this.clientRepository = new ClientRepository();
        this.dayVisitedRepository = new DayVisitedRepository();
    }

    async getAllSellers(){
        let rol:Roles = await this.rolRepository.getRoleById(10);
        
        return await this.sellerRepository.getAllSellers(rol);
    }

    async updateClientDetails(clientId:number,body:ClientEditRequest){
        let client:Client = await this.clientRepository.getClientById(clientId);
        if(!client) throw new Error("[404], no existe el cliente con el id: "+clientId);
        client.name = body.name;
        client.address.street = body.street;
        client.address.suburb = body.suburb;
        client.address.cp=body.cp;
        client.address.state = body.state;
        client.address.location = body.city;
        client.keySaeNew = body.keySaeNew;
        let daysVisited = await this.dayVisitedRepository.getDayVisitedById(body.daysVisited.id);
        if(daysVisited){
            daysVisited.monday = body.daysVisited.monday;
            daysVisited.tuesday = body.daysVisited.tuesday;
            daysVisited.wednesday = body.daysVisited.wednesday;
            daysVisited.thursday = body.daysVisited.thursday;
            daysVisited.friday = body.daysVisited.friday;
            daysVisited.saturday = body.daysVisited.saturday;
            daysVisited.sunday = body.daysVisited.sunday;
            await this.dayVisitedRepository.saveDayVisited(daysVisited);
        }
        await this.clientRepository.saveClient(client);
    }

    async createClientCount(sellerId:string,body:ClientEditRequest){
        let client:Client = new Client();
        let address:Address = new Address();
        let seller= await this.sellerRepository.getUserById(sellerId);
        let daysVisited:DayVisited =new DayVisited();
        client.id=body.keyClientId;
        client.keyClient= body.keyClientId;
        client.credit=0;
        client.currentCredit=0;
        client.curp="";
        client.dayCharge=0;
        client.hasDebts=false;
        client.paymentSat="";
        client.phone="";
        client.rfc="";
        client.status="ACTIVE";
        client.cfdi="";
        client.clasification="";
        client.daysCredit=0;
        
        client.address =address;
        client.name = body.name;
        client.typeClient="CONTADO";
        client.address.street = body.street;
        client.address.suburb = body.suburb;
        client.address.cp=body.cp;
        client.address.state = body.state;
        client.address.location = body.city;
        client.address.population = body.city;
        client.address.municipality=body.city;
        client.address.reference="";
        client.address.extNumber=0;
        client.address.nationality="MEXICANO";
        client.keySaeNew = body.keySaeNew;
        client.idAspel = +body.keySaeNew;
        client.seller = seller;
        let clientSaved =await this.clientRepository.saveClient(client);

        daysVisited.monday = body.daysVisited.monday;
        daysVisited.tuesday = body.daysVisited.tuesday;
        daysVisited.wednesday = body.daysVisited.wednesday;
        daysVisited.thursday = body.daysVisited.thursday;
        daysVisited.friday = body.daysVisited.friday;
        daysVisited.saturday = body.daysVisited.saturday;
        daysVisited.sunday = body.daysVisited.sunday;
        daysVisited.client = clientSaved;
        await this.dayVisitedRepository.saveDayVisited(daysVisited);
    }

    async deleteLogicClientCount(clientId:number){
        let client =await this.clientRepository.getClientById(clientId);
        client.status="INACTIVE";
        await this.clientRepository.saveClient(client)
    }

    async getDaysVisitedByClient(clientId:number){
        let client:Client = await this.clientRepository.getClientById(clientId);
        if(!client) throw new Error("[404], no existe el cliente con el id: "+clientId);
        return await this.dayVisitedRepository.getByClient(client);
    }

    async getLastClientId(){
        let count= await this.clientRepository.getLastCount();
        return count[0].clientId;
    }
}