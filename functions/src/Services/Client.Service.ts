import { Request } from "express";
import { ClientCreation, ClientVisitedDTO, ClientVisitedStatus, SellerClientCreation } from "../Models/DTO/Client.DTO";
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
import { DayVisited } from "../Models/Entity/DayVisited";
import { DayVisitedRepository } from "../Repositories/DayVisitedRepository";
import { VisitClientOperationRepository } from "../Repositories/VisitClientOperationRepository";
import { VisitClientOperation } from "../Models/Entity/VisitClientOperation";
import {TicketUtil} from "../Utils/Tickets/Ticket.Util";

export class ClientService {
    private addressRepository: AddressRepository;
    private saleRepository: SaleRepository;
    private clientRepository: ClientRepository;
    private userRepository: UserRepository;
    private sqlSRepository:SqlSRepository;
    private dayRepository:DayVisitedRepository;
    private visitClientOperationRepository:VisitClientOperationRepository;
    private ticketUtil:TicketUtil;
    constructor() {
        this.addressRepository = new AddressRepository();
        this.saleRepository = new SaleRepository();
        this.clientRepository = new ClientRepository();
        this.userRepository = new UserRepository();
        this.sqlSRepository = new SqlSRepository();
        this.dayRepository = new DayVisitedRepository();
        this.visitClientOperationRepository = new VisitClientOperationRepository();
        this.ticketUtil= new TicketUtil();
    }

    async createCustomer(req: Request) {
        let clientDTO: ClientCreation = req.body;
        
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
        newClient.currentCredit = clientDTO.currentCredit;
        newClient.address = address;
        newClient.credit = clientDTO.currentCredit;
        newClient.rfc = clientDTO.rfc;
        newClient.seller = sellerOwner;
        if(clientDTO.daysCredit) { newClient.daysCredit = clientDTO.daysCredit }
        if(clientDTO.typeClient=="CONTADO" && clientDTO.rfc==""){
            newClient.idAspel=713;
        }
        if(clientDTO.typeClient=="CREDITO" || (clientDTO.typeClient=="CONTADO" && clientDTO.rfc!="")){
            await this.sqlSRepository.saveClient(clientDTO);
        }
        let clientSaved=await this.clientRepository.saveClient(newClient);
        let daysVisited:DayVisited= new DayVisited();
        daysVisited.monday = clientDTO.daysVisited.monday;
        daysVisited.tuesday = clientDTO.daysVisited.tuesday;
        daysVisited.wednesday = clientDTO.daysVisited.wednesday;
        daysVisited.thursday = clientDTO.daysVisited.thursday;
        daysVisited.friday = clientDTO.daysVisited.friday;
        daysVisited.saturday = clientDTO.daysVisited.saturday;
        daysVisited.sunday = clientDTO.daysVisited.sunday;
        daysVisited.client = clientSaved;
        this.dayRepository.saveDayVisited(daysVisited);
          
    }

    async getCurrentCountCustomer(){
        let result = await this.sqlSRepository.getClientCount();
        let client = await this.clientRepository.getLastClient();
        let count =1;
        if(result.length){
            if(client==null){
                count=result[0].CLAVE+1;
            }else{
                if(+result[0].CLAVE<client.id){
                    count=client.id+1;
                }else{
                    count=+result[0].CLAVE+1;
                }
            }
        }else{
            if(client==null){
                count=1;
            }else{
                count=client.id+1;
            }
        }
        return {count};
    }

    async createSellerCustomer(clientDTO:SellerClientCreation){

        let lastClient:Client = await this.clientRepository.getLastClient();
        lastClient.id+=1;
        let keyClientNumber=clientDTO.keyClient;
        if(lastClient.id>=keyClientNumber){
            keyClientNumber=lastClient.id;
        }
    
        let records:IResult<any> = await this.sqlSRepository.getClientsByKey(keyClientNumber);
        
        if(records.recordset.length){
            let founded=true;
            while(founded){
                keyClientNumber++;
                let records:IResult<any> = await this.sqlSRepository.getClientsByKey(clientDTO.keyClient);
                if(!records.recordset.length){
                    founded=false;
                }
            }
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
        newClient.id=keyClientNumber;
        newClient.keyClient = keyClientNumber;
        
        newClient.name = clientDTO.name;
        newClient.typeClient = "CONTADO";
        newClient.currentCredit = 0;
        newClient.address = address;
        newClient.credit = 0;
        newClient.rfc = clientDTO.rfc;
        newClient.seller = sellerOwner;
        newClient.daysCredit=0;
        newClient.status="ACTIVE";
        if(clientDTO.typeClient==1){
            newClient.idAspel=713;
        }else{
            await this.sqlSRepository.saveSellerClient(clientDTO);    
        }
        let clientSaved:Client = await this.clientRepository.saveClient(newClient); 
        let daysVisited:DayVisited= new DayVisited();
        daysVisited.monday = clientDTO.daysVisited.monday;
        daysVisited.tuesday = clientDTO.daysVisited.tuesday;
        daysVisited.wednesday = clientDTO.daysVisited.wednesday;
        daysVisited.thursday = clientDTO.daysVisited.thursday;
        daysVisited.friday = clientDTO.daysVisited.friday;
        daysVisited.saturday = clientDTO.daysVisited.saturday;
        daysVisited.sunday = clientDTO.daysVisited.sunday;
        daysVisited.client = clientSaved;
        this.dayRepository.saveDayVisited(daysVisited);
        return keyClientNumber;
    }

    async getClientByKey(keyClient:string){
        return await this.clientRepository.findByClientKey(+keyClient);
    }

    async getScheduleByDate(sellerUid:string,date:string){
        let dateParsed = new Date(date);
        //let ZellerDayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
        let seller:User = await this.userRepository.getUserById(sellerUid);
        let clientsOfSeller = await this.clientRepository.getAllClientBySeller(seller);
        let day = this.zellerGregorian(dateParsed);
        let clientsOfSellerUids = clientsOfSeller.map(x=>x.id);
        
        let clientsSchedule:DayVisited[] = await this.dayRepository.getClientsByDayOfVisitByDayAndClientIds(day,clientsOfSellerUids);
        
        let response:ClientVisitedDTO[] =[];
        for(let clientSchedule of clientsSchedule){
            let visitClientOperation:VisitClientOperation = await this.visitClientOperationRepository.findByDateAndClient(date,clientSchedule.client);
            if(!visitClientOperation){
                response.push({
                    client:clientSchedule.client,
                    visitedStatus: ClientVisitedStatus.PENDING,
                    clientVisitId:null,
                    time:""
                });
            }else{
                if(visitClientOperation.endVisitTime!=null){
                    response.push({
                        client:visitClientOperation.client,
                    visitedStatus: ClientVisitedStatus.VISITED,
                    clientVisitId:visitClientOperation.visitId,
                    time: this.ticketUtil.getTimeDiff(visitClientOperation.startVisitTime,visitClientOperation.endVisitTime,visitClientOperation.date)
                    });
                }else if(visitClientOperation.endVisitTime==null){
                    response.push({
                        client:visitClientOperation.client,
                        visitedStatus: ClientVisitedStatus.INVISIT,
                        clientVisitId: visitClientOperation.visitId,
                        time:""
                    });
                }
            }
        }
        return response;
    }

    async createVisit(clientId:number){
        let client = await this.clientRepository.getClientById(clientId);
        if(!client) throw new Error("[404], no existe el cliente");
        let date = new Date();
        date.setHours(date.getHours()-6);
        let month:string = (date.getMonth()+1).toString();
        let day:string = (date.getDate()).toString();
        if(+month<10){
            month='0'+month;
        }
        if(+day<10){
            day='0'+day;
        }
        let dateStr = date.getFullYear().toString()+"-"+month+"-"+day;
        let visitOperation = await this.visitClientOperationRepository.findByDateAndClient(dateStr,client);
        if(!visitOperation){
        
        let visitOperationEntity:VisitClientOperation = new VisitClientOperation();
        visitOperationEntity.client=client;
        visitOperationEntity.date=dateStr;
        let hours:string = date.getHours().toString();
        let minutes:string = date.getMinutes().toString();
        let seconds:string = date.getSeconds().toString();
        if(+hours<10) hours="0"+hours;
        if(+minutes<10) minutes='0'+minutes;
        if(+seconds<10) seconds='0'+seconds;
        visitOperationEntity.startVisitTime=hours+":"+minutes+":"+seconds;
        await this.visitClientOperationRepository.saveVisitClientOperation(visitOperationEntity);
        }else{
            visitOperation.endVisitTime=null;
            await this.visitClientOperationRepository.saveVisitClientOperation(visitOperation);
        }
    }

    async endVisitToClient(clientId:number){
        let client = await this.clientRepository.getClientById(clientId);
        if(!client) throw new Error("[404], no existe el cliente");
        let date = new Date();
        date.setHours(date.getHours()-6);
        let month:string = (date.getMonth()+1).toString();
        let day:string = (date.getDate()).toString();
        if(+month<10){
            month='0'+month;
        }
        if(+day<10){
            day='0'+day;
        }
        let dateStr = date.getFullYear().toString()+"-"+month+"-"+day;
        let visitOperation = await this.visitClientOperationRepository.findByDateAndClient(dateStr,client);
        if(!visitOperation) throw new Error("[409], Aún no haz iniciado la visita");
        if(visitOperation.endVisitTime!=null){
            throw new Error("[409], Ya haz terminado la visita");
        }
        let hours:string = date.getHours().toString();
        let minutes:string = date.getMinutes().toString();
        let seconds:string = date.getSeconds().toString();
        if(+hours<10) hours="0"+hours;
        if(+minutes<10) minutes='0'+minutes;
        if(+seconds<10) seconds='0'+seconds;
        visitOperation.endVisitTime=hours+":"+minutes+":"+seconds;
        await this.visitClientOperationRepository.saveVisitClientOperation(visitOperation);
    }


    async deleteClientById(clientId:number){
        let client:Client = await this.clientRepository.getClientById(clientId);
        client.status="INACTIVE";
        await this.clientRepository.saveClient(client);
    }

    zellerGregorian(date){
            let h = 0; // day of week, Saturday = 0

            let q = date.getDate(); // day of month
            let m = date.getMonth(); // month, 3 to 14 = March to February
            let Y = 1900 + date.getYear(); // year is 1900-based

            // adjust month to run from 3 to 14 for March to February
            if(m <= 1)
            {
                m+= 13;
            }
            else
            {
                m+= 1;
            }

            // and also adjust year if January or February
            if(date.getMonth() <= 1)
            {
                Y--;
            }

            // Calculate h as per Herr Zeller
            h = (q + Math.floor(((13 * (m + 1)) / 5)) + Y + Math.floor((Y / 4)) - Math.floor((Y / 100)) + Math.floor((Y / 400))) % 7;

            return h;
    }

}