import { Request } from "express";
import { ClientCreation, SellerClientCreation } from "../Models/DTO/Client.DTO";
import { Client } from "../Models/Entity/Client";
import { Address } from "../Models/Entity/Address";
import { AddressRepository } from "../Repositories/Address.Repository";
import { SaleRepository } from "../Repositories/Sale.Repository";
import { ClientRepository } from "../Repositories/Client.Repository";
import { UserRepository } from "../Repositories/User.Repository";
import { User } from "../Models/Entity/User";
import { validateClient } from "../Utils/Validators/Client.Validator";
import { SqlSRepository } from "../Repositories/SqlS.Repositoy";
import { IResult } from "mssql";

export class ClientService {
    private addressRepository: AddressRepository;
    private saleRepository: SaleRepository;
    private clientRepository: ClientRepository;
    private userRepository: UserRepository;
    private sqlSRepository:SqlSRepository;

    constructor() {
        this.addressRepository = new AddressRepository();
        this.saleRepository = new SaleRepository();
        this.clientRepository = new ClientRepository();
        this.userRepository = new UserRepository();
        this.sqlSRepository = new SqlSRepository();
    }

    async createCustomer(req: Request) {
        let clientDTO: ClientCreation = req.body;
        validateClient(clientDTO);
        

        
        let records:IResult<any> = await this.sqlSRepository.getClientsByKey(clientDTO.keyClient);
        console.log(records);
        if(records.recordset.length){
            throw new Error('[409], ya existe un cliente con esa clave');
        }
        let sellerOwner:User = await this.userRepository.getUserById(clientDTO.saleUid);
        if (!sellerOwner) throw new Error(`[404], sellerOwner not found`);
    
        let newAddress:Address = new Address();
        newAddress.street = clientDTO.addressClient.street;
        newAddress.extNumber = clientDTO.addressClient.extNumber;
        newAddress.intNumber = clientDTO.addressClient.intNumber;
        newAddress.intersectionOne = clientDTO.addressClient.intersectionOne;
        newAddress.intersectionTwo = clientDTO.addressClient.intersectionTwo;
        newAddress.suburb = clientDTO.addressClient.suburb;
        newAddress.location = clientDTO.addressClient.location;
        newAddress.reference = clientDTO.addressClient.reference;
        newAddress.population = clientDTO.addressClient.population;
        newAddress.cp = clientDTO.addressClient.cp;
        newAddress.state = clientDTO.addressClient.state;
        newAddress.municipality = clientDTO.addressClient.municipality;
        newAddress.nationality = clientDTO.addressClient.nationality;
        
        let address:Address = await this.addressRepository.saveAddress(newAddress);
        
        let newClient:Client = new Client();
        newClient.keyClient = clientDTO.keyClient;

        newClient.name = clientDTO.name;
        
        newClient.typeClient = clientDTO.typeClient.toString();
        newClient.currentCredit = 0;
        address = address;
        newClient.credit = clientDTO.credit;
        newClient.rfc = clientDTO.rfc;
        newClient.seller = sellerOwner;
        if(clientDTO.daysCredit) { newClient.daysCredit = clientDTO.daysCredit }

          await this.clientRepository.saveClient(newClient); 
         await this.sqlSRepository.saveClient(clientDTO);    
    }

    async getCurrentCountCustomer(){
        let result = await this.sqlSRepository.getClientCount();
        if(!result.length){
            return {count:0}
        }else{
            return {count:+result[0].CLAVE}
        }
    }

    async createSellerCustomer(clientDTO:SellerClientCreation){
        let records:IResult<any> = await this.sqlSRepository.getClientsByKey(clientDTO.keyClient);
        
        if(records.recordset.length){
            throw new Error('[409], ya existe un cliente con esa clave');
        }
        let sellerOwner:User = await this.userRepository.getUserById(clientDTO.saleUid);
        if (!sellerOwner) throw new Error(`[404], sellerOwner not found`);
    
        let newAddress:Address = new Address();
        newAddress.street = clientDTO.addressClient.street;
        newAddress.extNumber = clientDTO.addressClient.extNumber;
        newAddress.intNumber = clientDTO.addressClient.intNumber;
        newAddress.intersectionOne = clientDTO.addressClient.intersectionOne;
        newAddress.intersectionTwo = clientDTO.addressClient.intersectionTwo;
        newAddress.suburb = clientDTO.addressClient.suburb;
        newAddress.location = clientDTO.addressClient.location;
        newAddress.reference = clientDTO.addressClient.reference;
        newAddress.population = clientDTO.addressClient.population;
        newAddress.cp = clientDTO.addressClient.cp;
        newAddress.state = clientDTO.addressClient.state;
        newAddress.municipality = clientDTO.addressClient.municipality;
        newAddress.nationality = "Mexicana";
        
        let address:Address = await this.addressRepository.saveAddress(newAddress);
        
        let newClient:Client = new Client();
        newClient.keyClient = clientDTO.keyClient;

        newClient.name = clientDTO.name;
        
        newClient.typeClient = "CONTADO";
        newClient.currentCredit = 0;
        address = address;
        newClient.credit = 0;
        newClient.rfc = clientDTO.rfc;
        newClient.seller = sellerOwner;
        newClient.daysCredit=0;
        
        await this.clientRepository.saveClient(newClient); 
        await this.sqlSRepository.saveSellerClient(clientDTO);    
    }
}