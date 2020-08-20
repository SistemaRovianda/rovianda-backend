import { Request } from "express";
import { ClientCreation } from "../Models/DTO/Client.DTO";
import { Client } from "../Models/Entity/Client";
import { Address } from "../Models/Entity/Address";
import { AddressRepository } from "../Repositories/Address.Repository";
import { SaleRepository } from "../Repositories/Sale.Repository";
import { ClientRepository } from "../Repositories/Client.Repository";

export class ClientService {
    private addressRepository: AddressRepository;
    private saleRepository: SaleRepository;
    private clientRepository: ClientRepository;


    constructor() {
        this.addressRepository = new AddressRepository();
        this.saleRepository = new SaleRepository();
        this.clientRepository = new ClientRepository();
    }

    async createCustomer(req: Request) {
        let clientDTO: ClientCreation = req.body;
        if (!clientDTO.keyClient)
            throw new Error(`[400],keyClient is required`);
        if (!clientDTO.rfc)
            throw new Error(`[400], rfc is required`);
        if (!clientDTO.client)
            throw new Error(`[400], client is required`);
        if (clientDTO.client === null || clientDTO.typeClient === undefined)
            throw new Error(`[400], typeClient is required`);
        if (!clientDTO.saleuid)
            throw new Error(`[400], saleuid is required`);
        if (!clientDTO.daysCredit || clientDTO.daysCredit.length <= 0)
            throw new Error(`[400], daysCredit is required`);
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
        
        let sale = await this.saleRepository.getSaleById(+clientDTO.saleuid);
        if (!sale && !sale.length)
            throw new Error(`[404], sale with id ${clientDTO.saleuid} does not exist`);
        
        const newAddress: Address = {
            id: 0,
            state: clientDTO.addressClient.state,
            municipality: clientDTO.addressClient.municipality,
            location: clientDTO.addressClient.location,
            suburb: clientDTO.addressClient.suburb,
            extNumber: clientDTO.addressClient.extNumber,
            street: clientDTO.addressClient.street,
            reference: clientDTO.addressClient.reference
        };
        
        const newClient: Client = {
            id: 0,
            keyClient: clientDTO.keyClient,
            client: clientDTO.client,
            typeClient: `${clientDTO.typeClient}`,
            currentCredit: clientDTO.currentCredit,
            daysCredit: clientDTO.daysCredit.toLocaleString(),
            address: newAddress,
            credit: clientDTO.currentCredit,
            debs: null,
            rfc: clientDTO.rfc,
            sales: sale,
            seller: null
        };

        try{
            
            await this.clientRepository.saveClient(newClient);
        }catch(err){
            throw new Error(`[500], ${err.message}`);
        }
        
            
                
    }
}