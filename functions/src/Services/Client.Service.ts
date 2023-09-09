import { Request } from "express";
import { ClientCreation, ClientCreationV2, ClientGeolocationVisits, ClientUpdateV2, ClientVisitBySellerRecord, ClientVisitBySellerRequest, ClientVisitData, ClientVisitedDTO, ClientVisitedStatus, SellerClientCreation } from "../Models/DTO/Client.DTO";
import { Client } from "../Models/Entity/Client";
import { Address } from "../Models/Entity/Address";
import { AddressRepository } from "../Repositories/Address.Repository";
import { SaleRepository } from "../Repositories/Sale.Repository";
import { ClientRepository } from "../Repositories/Client.Repository";
import { UserRepository } from "../Repositories/User.Repository";
import { User } from "../Models/Entity/User";
import { validateClientVisit  } from "../Utils/Validators/Client.Validator";
import { SqlSRepository } from "../Repositories/SqlS.Repositoy";
import { IResult } from "mssql";
import { DayVisited } from "../Models/Entity/DayVisited";
import { DayVisitedRepository } from "../Repositories/DayVisitedRepository";
import { VisitClientOperationRepository } from "../Repositories/VisitClientOperationRepository";
import { VisitClientOperation } from "../Models/Entity/VisitClientOperation";
import {TicketUtil} from "../Utils/Tickets/Ticket.Util";
import { VisitDto } from "../Models/DTO/VisitDTO";
import { VisitEntity } from "../Models/Entity/VisitEntity";
import { VisitRepository } from "../Repositories/Visit.Repository";
import ExcelHelper from "../Utils/Excel.Helper";
import { PreSalesVinculationSellerRepository } from "../Repositories/PreSalesVinculationSeller.Repository";
import { PreSalesVinculationSeller } from "../Models/Entity/PreSalesVinculationSeller";

export class ClientService {
    private visitRepository:VisitRepository;
    private addressRepository: AddressRepository;
    private saleRepository: SaleRepository;
    private clientRepository: ClientRepository;
    private userRepository: UserRepository;
    private sqlSRepository:SqlSRepository;
    private dayRepository:DayVisitedRepository;
    private visitClientOperationRepository:VisitClientOperationRepository;
    private ticketUtil:TicketUtil;
    private excelHelper:ExcelHelper;
    private preSaleVinculationSeller:PreSalesVinculationSellerRepository;
    constructor() {
        this.excelHelper = new ExcelHelper();
        this.visitRepository = new VisitRepository();
        this.addressRepository = new AddressRepository();
        this.saleRepository = new SaleRepository();
        this.clientRepository = new ClientRepository();
        this.userRepository = new UserRepository();
        this.sqlSRepository = new SqlSRepository();
        this.dayRepository = new DayVisitedRepository();
        this.visitClientOperationRepository = new VisitClientOperationRepository();
        this.ticketUtil= new TicketUtil();
        this.preSaleVinculationSeller = new PreSalesVinculationSellerRepository();
    }

    async createCustomer(req: Request) {
        let clientDTO: ClientCreation = req.body;
        let sellerOwner:User = await this.userRepository.getUserById(clientDTO.clientSeller);
        if (!sellerOwner) throw new Error(`[404], sellerOwner not found`);
    
        let newAddress:Address = new Address();
        newAddress.street = clientDTO.clientStreet;
        newAddress.extNumber = isNaN(+clientDTO.clientExtNumber)?0:+clientDTO.clientExtNumber;
        newAddress.intNumber = null;
        newAddress.intersectionOne = "";
        newAddress.intersectionTwo = "";
        newAddress.suburb = clientDTO.clientSuburb;
        newAddress.location = clientDTO.clientLocality;
        newAddress.reference = "";
        newAddress.population = clientDTO.clientMunicipality;
        newAddress.cp = +clientDTO.clientCp;
        newAddress.state = clientDTO.clientState;
        newAddress.municipality = clientDTO.clientMunicipality;
        newAddress.nationality = clientDTO.clientNationality;
        
        let address:Address = await this.addressRepository.saveAddress(newAddress);
        
        let newClient:Client = new Client();
        newClient.keyClient = clientDTO.clientCodeAssigned;
        newClient.name = clientDTO.clientName;
        newClient.idAspel= clientDTO.clientCode;
        newClient.typeClient = clientDTO.clientType;
        newClient.currentCredit = clientDTO.clientCurrentCredit||0;
        newClient.address = address;
        newClient.cfdi="";
        newClient.paymentSat="";
        newClient.curp="";
        newClient.clasification="";
        newClient.credit = clientDTO.clientCredit||0;
        newClient.rfc = clientDTO.clientRfc;
        newClient.seller = sellerOwner;
        newClient.daysCredit=0;
        newClient.hasDebts=false;
        newClient.keySaeNew=clientDTO.clientCode.toString();
        let clientSaved=await this.clientRepository.saveClient(newClient);
        let daysVisited:DayVisited= new DayVisited();
        daysVisited.monday = clientDTO.monday;
        daysVisited.tuesday = clientDTO.tuesday;
        daysVisited.wednesday = clientDTO.wednesday;
        daysVisited.thursday = clientDTO.thursday;
        daysVisited.friday = clientDTO.friday;
        daysVisited.saturday = clientDTO.saturday;
        daysVisited.sunday = clientDTO.sunday;
        daysVisited.client = clientSaved;
        await this.dayRepository.saveDayVisited(daysVisited);
          
    }

    async createCustomerV2(clientDTO: ClientCreationV2) {
        console.log(JSON.stringify(clientDTO));
        let sellerOwner:User = await this.userRepository.getUserbyIdWithRol(clientDTO.clientSellerUid);
        if (!sellerOwner) throw new Error(`[404], sellerOwner not found`);
        if(sellerOwner.roles.description=="PRESALE"){
            let newUsers:PreSalesVinculationSeller[] = await this.preSaleVinculationSeller.getAllPreSalesVinculationSellerByPreSaleSellerId(sellerOwner.id);
            if(newUsers.length){
                sellerOwner = await this.userRepository.getUserById(newUsers[0].deliverUserId);
            }
        }
        let client:Client =null;
        if(!clientDTO.isTemp){
            client = await this.clientRepository.getClientByMobileIdAndSeller(clientDTO.clientMobileId,sellerOwner);
        }else{
            client = await this.clientRepository.getClientById(clientDTO.clientRovId);
        }
        let newAddress:Address=null;
        let newClient:Client=null;
        let daysVisited:DayVisited=null;
        if(client==null){
            newClient=new Client();
            newClient.keySaeNew="2152";
            newAddress= new Address();
            daysVisited=new DayVisited();
        }else{
            newClient=client;
            newAddress=client.address;
            daysVisited= await this.dayRepository.getByClient(client);
        }
            newAddress.street = clientDTO.clientStreet;
            newAddress.extNumber = clientDTO.clientExtNumber?+(clientDTO.clientExtNumber):null;
            newAddress.intNumber = null;
            newAddress.intersectionOne = "";
            newAddress.intersectionTwo = "";
            newAddress.suburb = clientDTO.clientSuburb;
            newAddress.location = clientDTO.clientMunicipality;
            newAddress.reference = "";
            newAddress.population = clientDTO.clientMunicipality;
            newAddress.cp = +clientDTO.clientCp;
            newAddress.state = "VERACRUZ";
            newAddress.municipality = clientDTO.clientMunicipality;
            newAddress.nationality = "MEXICO";
            let address:Address = await this.addressRepository.saveAddress(newAddress);
            newClient.name = clientDTO.clientName;
            newClient.keyClient=clientDTO.clientMobileId;
            newClient.idAspel= 2152;
            newClient.typeClient = clientDTO.clientType;
            newClient.currentCredit = 0;
            newClient.address = address;
            newClient.cfdi="";
            newClient.paymentSat="";
            newClient.curp="";
            newClient.clasification="";
            newClient.credit = 0;
            newClient.rfc ="";
            newClient.seller = sellerOwner;
            newClient.daysCredit=0;
            newClient.hasDebts=false;
            newClient.contact=clientDTO.clientContact;
            newClient.phone=clientDTO.clientPhoneNumber;
            newClient.reference = clientDTO.clientReference;
            newClient.latitude=clientDTO.latitude;
            newClient.longitude=clientDTO.longitude;
            newClient.clientMobileId=clientDTO.clientMobileId;
            let clientSaved=await this.clientRepository.saveClient(newClient);
            clientSaved.keyClient=clientSaved.id;
            clientSaved=await this.clientRepository.saveClient(clientSaved);
            daysVisited.monday = clientDTO.monday;
            daysVisited.tuesday = clientDTO.tuesday;
            daysVisited.wednesday = clientDTO.wednesday;
            daysVisited.thursday = clientDTO.thursday;
            daysVisited.friday = clientDTO.friday;
            daysVisited.saturday = clientDTO.saturday;
            daysVisited.sunday = false;
            daysVisited.client = clientSaved;
            await this.dayRepository.saveDayVisited(daysVisited);
            return {clientId:clientSaved.keyClient,clientMobileId:newClient.clientMobileId}
        
    }

    async createCustomerV2Arr(clientDTOS: ClientCreationV2[]) {
        let response:{clientId:number,clientMobileId:number}[]=[];
        for(let clientDTO of clientDTOS){
        let sellerOwner:User = await this.userRepository.getUserbyIdWithRol(clientDTO.clientSellerUid);
        if (!sellerOwner) throw new Error(`[404], sellerOwner not found`);
        if(sellerOwner.roles.description=="PRESALE"){
            let newUsers:PreSalesVinculationSeller[] = await this.preSaleVinculationSeller.getAllPreSalesVinculationSellerByPreSaleSellerId(sellerOwner.id);
            if(newUsers.length){
                sellerOwner = await this.userRepository.getUserById(newUsers[0].deliverUserId);
            }
        }
        let client:Client =null;
        if(!clientDTO.isTemp){
            client = await this.clientRepository.getClientByMobileIdAndSeller(clientDTO.clientMobileId,sellerOwner);
        }else{
            client = await this.clientRepository.getClientById(clientDTO.clientRovId);
        }
        let newAddress:Address=null;
        let newClient:Client=null;
        let daysVisited:DayVisited=null;
        if(client==null){
            newClient=new Client();
            newClient.keySaeNew="2152";
            newAddress= new Address();
            daysVisited=new DayVisited();
        }else{
            newClient=client;
            newAddress=client.address;
            daysVisited= await this.dayRepository.getByClient(client);
        }
            newAddress.street = clientDTO.clientStreet;
            newAddress.extNumber = clientDTO.clientExtNumber?+(clientDTO.clientExtNumber):null;
            newAddress.intNumber = null;
            newAddress.intersectionOne = "";
            newAddress.intersectionTwo = "";
            newAddress.suburb = clientDTO.clientSuburb;
            newAddress.location = clientDTO.clientMunicipality;
            newAddress.reference = "";
            newAddress.population = clientDTO.clientMunicipality;
            newAddress.cp = +clientDTO.clientCp;
            newAddress.state = "VERACRUZ";
            newAddress.municipality = clientDTO.clientMunicipality;
            newAddress.nationality = "MEXICO";
            let address:Address = await this.addressRepository.saveAddress(newAddress);
            newClient.name = clientDTO.clientName;
            newClient.keyClient=clientDTO.clientMobileId;
            newClient.idAspel= 2152;
            newClient.typeClient = clientDTO.clientType;
            newClient.currentCredit = 0;
            newClient.address = address;
            newClient.cfdi="";
            newClient.paymentSat="";
            newClient.curp="";
            newClient.clasification="";
            newClient.credit = 0;
            newClient.rfc ="";
            newClient.seller = sellerOwner;
            newClient.daysCredit=0;
            newClient.hasDebts=false;
            newClient.contact=clientDTO.clientContact;
            newClient.phone=clientDTO.clientPhoneNumber;
            newClient.reference = clientDTO.clientReference;
            newClient.latitude=clientDTO.latitude;
            newClient.longitude=clientDTO.longitude;
            newClient.clientMobileId=clientDTO.clientMobileId;
            let clientSaved=await this.clientRepository.saveClient(newClient);
            clientSaved.keyClient=clientSaved.id;
            clientSaved=await this.clientRepository.saveClient(clientSaved);
            daysVisited.monday = clientDTO.monday;
            daysVisited.tuesday = clientDTO.tuesday;
            daysVisited.wednesday = clientDTO.wednesday;
            daysVisited.thursday = clientDTO.thursday;
            daysVisited.friday = clientDTO.friday;
            daysVisited.saturday = clientDTO.saturday;
            daysVisited.sunday = false;
            daysVisited.client = clientSaved;
            await this.dayRepository.saveDayVisited(daysVisited);
            response.push({clientId:clientSaved.keyClient,clientMobileId:newClient.clientMobileId})
        }
        return response;
    }

    async synchronizationCustomersV2(clientDTOS: ClientCreationV2[]) {
        let response:{clientId:number,clientMobileId:number}[]=[];
        for(let clientDTO of clientDTOS){
            
            let sellerOwner:User = await this.userRepository.getUserById(clientDTO.clientSellerUid);
            if (!sellerOwner) throw new Error(`[404], sellerOwner not found`);
            let client = await this.clientRepository.getClientByMobileIdAndSeller(clientDTO.clientMobileId,sellerOwner);
            let newAddress:Address=null;
            let newClient:Client=null;
            let daysVisited:DayVisited=null;
            if(client==null){
                newClient=new Client();
                newClient.keySaeNew="2152";
                newAddress= new Address();
                daysVisited=new DayVisited();
            }else{
                newClient=client;
                newAddress=client.address;
                daysVisited= await this.dayRepository.getByClient(client);
            }
                newAddress.street = clientDTO.clientStreet;
                newAddress.extNumber = clientDTO.clientExtNumber?+(clientDTO.clientExtNumber):null;
                newAddress.intNumber = null;
                newAddress.intersectionOne = "";
                newAddress.intersectionTwo = "";
                newAddress.suburb = clientDTO.clientSuburb;
                newAddress.location = clientDTO.clientMunicipality;
                newAddress.reference = "";
                newAddress.population = clientDTO.clientMunicipality;
                newAddress.cp = +clientDTO.clientCp;
                newAddress.state = "VERACRUZ";
                newAddress.municipality = clientDTO.clientMunicipality;
                newAddress.nationality = "MEXICO";
                let address:Address = await this.addressRepository.saveAddress(newAddress);
            
                newClient.name = clientDTO.clientName;
                newClient.keyClient=clientDTO.clientMobileId;
                newClient.idAspel= 2152;
                newClient.typeClient = clientDTO.clientType;
                newClient.currentCredit = 0;
                newClient.address = address;
                newClient.cfdi="";
                newClient.paymentSat="";
                newClient.curp="";
                newClient.clasification="";
                newClient.credit = 0;
                newClient.rfc ="";
                newClient.seller = sellerOwner;
                newClient.daysCredit=0;
                newClient.hasDebts=false;
                
                newClient.latitude=clientDTO.latitude;
                newClient.longitude=clientDTO.longitude;
                newClient.clientMobileId=clientDTO.clientMobileId;
                let clientSaved=await this.clientRepository.saveClient(newClient);
                clientSaved.keyClient=clientSaved.id;
                clientSaved=await this.clientRepository.saveClient(clientSaved);
                daysVisited.monday = clientDTO.monday;
                daysVisited.tuesday = clientDTO.tuesday;
                daysVisited.wednesday = clientDTO.wednesday;
                daysVisited.thursday = clientDTO.thursday;
                daysVisited.friday = clientDTO.friday;
                daysVisited.saturday = clientDTO.saturday;
                daysVisited.sunday = false;
                daysVisited.client = clientSaved;
                await this.dayRepository.saveDayVisited(daysVisited);
                response.push({clientId:clientSaved.keyClient,clientMobileId:newClient.clientMobileId})
        }
        return response;
    }

    async updateCustomerV2(clientDTOS: ClientUpdateV2[]){
        let response:{clientId:number}[]=[];
        for(let clientDTO of clientDTOS){
            console.log(JSON.stringify(clientDTO));
            let client = await this.clientRepository.getClientById(clientDTO.clientId);
            let newAddress:Address=null;
            let newClient:Client=null;
            let daysVisited:DayVisited=null;
            if(client==null){
                newClient=new Client();
                newClient.keySaeNew="2152";
                newAddress= new Address();
                daysVisited=new DayVisited();
            }else{
                newClient=client;
                newAddress=client.address;
                daysVisited= await this.dayRepository.getByClient(client);
                if(daysVisited==null){
                    daysVisited=new DayVisited();
                }
            }
                newAddress.street = clientDTO.clientStreet;
                newAddress.extNumber = clientDTO.clientExtNumber?+(clientDTO.clientExtNumber):null;
                newAddress.intNumber = null;
                newAddress.intersectionOne = "";
                newAddress.intersectionTwo = "";
                newAddress.suburb = clientDTO.clientSuburb;
                newAddress.location = clientDTO.clientMunicipality;
                newAddress.reference = "";
                newAddress.population = clientDTO.clientMunicipality;
                newAddress.cp = +clientDTO.clientCp;
                newAddress.state = "VERACRUZ";
                newAddress.municipality = clientDTO.clientMunicipality;
                newAddress.nationality = "MEXICO";
                let address:Address = await this.addressRepository.saveAddress(newAddress);
            
                newClient.name = clientDTO.clientName;
                newClient.idAspel= 2152;
                newClient.currentCredit = 0;
                newClient.address = address;
                newClient.cfdi="";
                newClient.paymentSat="";
                newClient.curp="";
                newClient.clasification="";
                newClient.credit = 0;
                newClient.rfc ="";
                newClient.daysCredit=0;
                newClient.hasDebts=false;
                newClient.contact=clientDTO.clientContact;
                newClient.phone=clientDTO.clientPhoneNumber;
                newClient.reference=clientDTO.clientReference;
                newClient.latitude=clientDTO.latitude;
                newClient.longitude=clientDTO.longitude;
                let clientSaved=await this.clientRepository.saveClient(newClient);
                daysVisited.monday = clientDTO.monday;
                daysVisited.tuesday = clientDTO.tuesday;
                daysVisited.wednesday = clientDTO.wednesday;
                daysVisited.thursday = clientDTO.thursday;
                daysVisited.friday = clientDTO.friday;
                daysVisited.saturday = clientDTO.saturday;
                daysVisited.sunday = false;
                daysVisited.client = clientSaved;
                await this.dayRepository.saveDayVisited(daysVisited);
                response.push({clientId:clientSaved.id})
        }
        return response;
    }

    async getCurrentCountCustomer(){
        
        let client = await this.clientRepository.getLastClient();
        return client.keyClient;
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
        await this.dayRepository.saveDayVisited(daysVisited);
        return keyClientNumber;
    }

    async getClientByKey(keyClient:string){
        return await this.clientRepository.findByClientKey(+keyClient);
    }

    async getScheduleByDate(sellerUid:string,date:string){
        let dateParsed = new Date(date);
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

    async getScheduleByDateLocation(sellerUid:string,date:string){
        let dateParsed = this.parseDate(date);
        let day = this.zellerGregorian(new Date(date));
        let result = await this.clientRepository.getAllClientsVisited(sellerUid,dateParsed);
        let response:ClientGeolocationVisits[]=[];
        for(let item of result){
            let mustVisited:boolean=false;
            switch(day){
                case 0:
                    mustVisited=item.saturday==1;
                    break;
                case 1:
                    mustVisited=item.sunday==1;
                    break;
                case 2:
                    mustVisited=item.monday==1;
                    break;
                case 3:
                    mustVisited=item.tuesday==1;
                    break;
                case 4:
                    mustVisited=item.wednesday==1;
                    break;
                case 5:
                    mustVisited=item.thursday==1;
                    break;
                case 6:
                    mustVisited=item.friday==1;
                    break;
            }
            response.push({
                clientId: item.clientId,
                clientName: item.name,
                latitude: item.latitude,
                longitude: item.longitude,
                visited: item.count>0?true:false,
                mustVisited,
                keyClient: item.keyClient
            });
            response=response.filter(x=>(x.visited || x.mustVisited));
        }
        return response;
    }
    parseDate(date){
        let dateP = new Date(date);
        let month = (dateP.getMonth()+1).toString();
        let day = dateP.getDate().toString();
        if(+month<10) month="0"+month;
        if(+day<10) day="0"+day;
        return `${dateP.getFullYear()}-${month}-${day}`;
    }

    async createVisit(clientsVisits:Array<VisitDto>){
        console.log(JSON.stringify(clientsVisits));
        validateClientVisit(clientsVisits);
        let response:{clientId:number,date:string}[]=[];
        for(let visit of clientsVisits){
            let visitEntity = await this.visitRepository.getVisit(visit.clientId,visit.date);
            if(!visitEntity){
                let visitEntity = new VisitEntity();
                let client = await this.clientRepository.getClientById(visit.clientId);
                if(!client) throw new Error("[404], No existe el cliente con el id: "+visit.clientId);
                visitEntity.client=client;
                visitEntity.date = visit.date;
                visitEntity.observations=visit.observations;
                visitEntity.visited=visit.visited;
                visitEntity.amount=visit.amount;
                try{
                    await this.visitRepository.saveVisit(visitEntity);    
                }catch(err){
                    console.log(err.message);
                    console.log("Error de duplicidad de visita mitigado");
                }
            }else{
                visitEntity.amount =visit.amount;
                visitEntity.observations=visit.observations;
                await this.visitRepository.saveVisit(visitEntity);
            }
            response.push({clientId:visit.clientId,date:visit.date});
        }
        return response;
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

    async updateKeyClient(clientId:number,code:string){
        let client:Client = await this.clientRepository.getClientById(clientId);
        if(!client) throw new Error("[404], no se encontró al cliente con el id: "+clientId);
        client.keySaeNew=code;
        await this.clientRepository.saveClient(client);
    }

    async searchClientInSae(code:number){
        let client = await this.sqlSRepository.getClientsByKey(code);
        if(client.recordset.length){
            return client.recordset[0];
        }else{
            return null;
        }
    }

    async customerReassign(clientId:number,sellerUid:string){
        let client = await this.clientRepository.getClientById(clientId);
        let seller = await this.userRepository.getUserById(sellerUid);
        client.seller=seller;
        await this.clientRepository.saveClient(client);
    }
    async getCustomerReportBySeller(sellerId:string,type:string,hint:string){
        return await this.clientRepository.getCustomerReportBySeller(sellerId,type,hint);
    }

    async getVisitsBySellerAndDate(request:ClientVisitBySellerRequest){
        let seller:User = await this.userRepository.getUserById(request.sellerId);
        if(!seller) throw new Error("[404], No existe el vendedor");
        let visits = await this.visitRepository.getVisitsBySellerAndDate(request.sellerId,request.date);
        for(let visit of visits){
            if(visit.amount>0){
                visit.withSale=true;
            }else{
                visit.withSale=false;
            }
        }
        return visits;
    }

    async getReportOfVisitsBySeller(request:ClientVisitBySellerRequest){
        let seller:User = await this.userRepository.getUserById(request.sellerId);
        if(!seller) throw new Error("[404], No existe el vendedor");
        let visits:ClientVisitData[] = await this.getVisitsBySellerAndDate(request);
        return await this.excelHelper.getSellerVisitsScheduled(visits,seller.name,request.date);
    }

 
}