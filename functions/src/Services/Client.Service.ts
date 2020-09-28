import { Request } from "express";
import { ClientCreation } from "../Models/DTO/Client.DTO";
import { Client } from "../Models/Entity/Client";
import { Address } from "../Models/Entity/Address";
import { AddressRepository } from "../Repositories/Address.Repository";
import { SaleRepository } from "../Repositories/Sale.Repository";
import { ClientRepository } from "../Repositories/Client.Repository";
import { UserRepository } from "../Repositories/User.Repository";
import { User } from "../Models/Entity/User";

export class ClientService {
    private addressRepository: AddressRepository;
    private saleRepository: SaleRepository;
    private clientRepository: ClientRepository;
    private userRepository: UserRepository;


    constructor() {
        this.addressRepository = new AddressRepository();
        this.saleRepository = new SaleRepository();
        this.clientRepository = new ClientRepository();
        this.userRepository = new UserRepository();
    }

    async createCustomer(req: Request) {
        let clientDTO: ClientCreation = req.body;
        if (!clientDTO.keyClient)
            throw new Error(`[400],keyClient is required`);
        if (!clientDTO.rfc)
            throw new Error(`[400], rfc is required`);
        
        if (!clientDTO.name)
            throw new Error(`[400], client is required`);
            if (!clientDTO.firstSurname)
            throw new Error(`[400], firstSurname is required`);
            if (!clientDTO.lastSurname)
            throw new Error(`[400], lastSurname is required`);
        if (clientDTO.name === null || clientDTO.typeClient === undefined)
            throw new Error(`[400], typeClient is required`);
        if (!clientDTO.saleuid)
            throw new Error(`[400], saleuid is required`);
        // if (!clientDTO.daysCredit || clientDTO.daysCredit.length <= 0)
        //     throw new Error(`[400], daysCredit is required`);
        if (!clientDTO.addressClient)
            throw new Error(`[400], addressClient is required`);
        if (!clientDTO.addressClient.state)
            throw new Error(`[400], state is required`);
        if (!clientDTO.addressClient.municipality)
            throw new Error(`[400], municipality is required`);
        if (!clientDTO.addressClient.location)
            throw new Error(`[400], location is required`);
        if (!clientDTO.addressClient.suburb)
            throw new Error(`[400], suburb is required`);
        if (!clientDTO.addressClient.extNumber)
            throw new Error(`[400], extNumber is required`);
        if (!clientDTO.addressClient.street)
            throw new Error(`[400], street is required`);
        if (!clientDTO.addressClient.reference)
            throw new Error(`[400], reference is required`);

        let sellerOwner:User = await this.userRepository.getUserById(clientDTO.saleuid);
        if (!sellerOwner) throw new Error(`[404], sellerOwner not found`);
        let client:Client = await this.clientRepository.findByClientKey(clientDTO.keyClient);
        if(client) throw new Error("[409], ya existe un usuario con esa clave");
        let newAddress:Address = new Address();
        newAddress.state = clientDTO.addressClient.state;
        newAddress.municipality = clientDTO.addressClient.municipality;
        newAddress.location = clientDTO.addressClient.location;
        newAddress.suburb = clientDTO.addressClient.suburb;
        newAddress.extNumber = clientDTO.addressClient.extNumber;
        newAddress.street = clientDTO.addressClient.street;
        newAddress.reference = clientDTO.addressClient.reference;

        await this.addressRepository.saveAddress(newAddress);

        let address:Address = await this.addressRepository.getLastAddress();
        
        let newClient:Client = new Client();
        newClient.keyClient = clientDTO.keyClient;
        newClient.name = clientDTO.name;
        newClient.firstSurname = clientDTO.firstSurname;
        newClient.lastSurname = clientDTO.lastSurname;
        newClient.typeClient = clientDTO.typeClient.toString();
        newClient.currentCredit = clientDTO.currentCredit;
        address = address;
        newClient.credit = clientDTO.currentCredit;
        newClient.rfc = clientDTO.rfc;
        newClient.seller = sellerOwner;
        if(clientDTO.daysCredit) { newClient.daysCredit = clientDTO.daysCredit.toLocaleString(); }

         return await this.clientRepository.saveClient(newClient);        
    }

    async getCurrentCountCustomer(){
        return await this.clientRepository.getCurrentCountCustomer();
    }
}