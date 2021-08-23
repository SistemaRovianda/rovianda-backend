import { SalesRequestRepository } from '../Repositories/SalesRequest.Repostitory';
import { SubOrder } from '../Models/Entity/SubOrder.Sale.Seller';

import { DevolutionSellerRequestBody, OrderSellerRequest, OrderSellerUpdateProperties, ProductDevolution, RequestDevolution, SaleRequestForm } from '../Models/DTO/Sales.ProductDTO';
import { User } from '../Models/Entity/User';
import { UserRepository } from '../Repositories/User.Repository';

import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';

import { PresentationsProductsRepository } from '../Repositories/Presentation.Products.Repository';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { SalesSellerRepository } from '../Repositories/SaleSeller.Repository';
import {validateOrderSeller} from "../Utils/Validators/OrderSellerValidator";
import {PackagingRepository} from "../Repositories/Packaging.Repository";
import {SellerInventoryRepository} from "../Repositories/Seller.Inventory.Repository";
import { ClientsBySeller, ClientDTO, ClientSAE } from '../Models/DTO/Client.DTO';
import { ClientRepository } from '../Repositories/Client.Repository';
import { DebtsRepository } from '../Repositories/Debts.Repository';
import { SellerOperation } from '../Models/Entity/Seller.Operations';
import { SellerOperationRepository } from '../Repositories/Seller.Operation.Repository';
import { SellerOperationDTO } from '../Models/DTO/SellerOperationDTO';
import { RelationCount } from 'typeorm';
import { Sale } from '../Models/Entity/Sales';
import { SaleRepository } from '../Repositories/Sale.Repository';
import { isEmpty, LoDashImplicitStringWrapper, times, xorBy } from 'lodash';
import { SubSaleRepository } from '../Repositories/SubSale.Repository';
import { SubSales } from '../Models/Entity/Sub.Sales';
import { SqlSRepository } from '../Repositories/SqlS.Repositoy';
import { UserDTO } from '../Models/DTO/UserDTO';
import { Roles } from '../Models/Entity/Roles';
import { RolesRepository } from '../Repositories/Roles.Repository';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Presentation, PresentationsAvailables } from '../Models/DTO/Presentations.DTO';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { Debts } from '../Models/Entity/Debts';
import { Client } from '../Models/Entity/Client';
import { DebtsPaymentRequest } from '../Models/DTO/Debts.DTO';
import { TicketUtil } from '../Utils/Tickets/Ticket.Util';
import { CheeseRepository } from '../Repositories/Cheese.Repository';
import { request, response } from 'express';
import { SellerInventory } from '../Models/Entity/Seller.Inventory';
import { PropertiesPackagingRepository } from '../Repositories/Properties.Packaging.Repository';
import { VisitClientOperation } from '../Models/Entity/VisitClientOperation';
import { VisitClientOperationRepository } from '../Repositories/VisitClientOperationRepository';
import { DebtsRequest, ModeOffline, ModeOfflineClients, ModeOfflineInventory, ModeOfflineProductInterface, ModeOfflineRequestSincronization, ModeOfflineSaleInterface, MOSRM } from '../Models/DTO/ModeOfflineDTO';
import { DayVisited } from '../Models/Entity/DayVisited';
import { DayVisitedRepository } from '../Repositories/DayVisitedRepository';
import { SaleCancelRepository } from '../Repositories/SaleCancelRepository';
import { SaleCancel } from '../Models/Entity/SaleCancel';
import { DevolutionSellerRequestRepository } from '../Repositories/DevolutionSellerRequestRepository';
import { DevolutionSellerRequest } from '../Models/Entity/DevolutionSellerRequest';
import { DevolutionOldSubSales } from '../Models/Entity/DevolutionOldSubSales';
import { DevolutionOldSubSaleRepository } from '../Repositories/DevolutionOldSubSalesRepository';
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
export class SalesRequestService{
    private salesRequestRepository:SalesRequestRepository;
    private userRepository:UserRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    private presentationProductsRepository:PresentationsProductsRepository;
    private saleSellerRepository:SalesSellerRepository;
    private packagingRepository:PackagingRepository;
    private sellerInventoryRepository:SellerInventoryRepository;
    private clientRepository:ClientRepository;
    private debRepository:DebtsRepository;
    private sellerOperationRepository:SellerOperationRepository;
    private saleRepository:SaleRepository;
    private subSalesRepository:SubSaleRepository;
    private sqlsRepository:SqlSRepository;
    private rolesRepository:RolesRepository;
    private ticketUtil:TicketUtil;
    private cheeseRepository:CheeseRepository;
    private propertiesPackagingRepository:PropertiesPackagingRepository;
    private saleCancelRepository:SaleCancelRepository;
    private dayRepository:DayVisitedRepository;
    private devolutionRequestSellerRepository:DevolutionSellerRequestRepository;
    private devolutionOldSubSalesRepository:DevolutionOldSubSaleRepository;
    constructor(private firebaseHelper:FirebaseHelper){
        this.salesRequestRepository = new SalesRequestRepository();
        this.userRepository = new UserRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.presentationProductsRepository = new PresentationsProductsRepository();
        this.saleSellerRepository = new SalesSellerRepository();
        this.packagingRepository = new PackagingRepository();
        this.sellerInventoryRepository = new SellerInventoryRepository();
        this.clientRepository = new ClientRepository();
        this.debRepository = new DebtsRepository();
        this.sellerOperationRepository = new SellerOperationRepository();
        this.saleRepository = new SaleRepository();
        this.subSalesRepository = new SubSaleRepository();
        this.sqlsRepository = new SqlSRepository();
        this.rolesRepository = new RolesRepository();
        this.ticketUtil = new TicketUtil();
        this.cheeseRepository = new CheeseRepository();
        this.propertiesPackagingRepository = new PropertiesPackagingRepository();
        this.dayRepository = new DayVisitedRepository();
        this.saleCancelRepository= new SaleCancelRepository();
        this.devolutionRequestSellerRepository=new DevolutionSellerRequestRepository();
        this.devolutionOldSubSalesRepository=new DevolutionOldSubSaleRepository();
    }
    
    async saveOrderSeller(uid:string,request:OrderSellerRequest){
        await validateOrderSeller(request);
        let user:User = await this.userRepository.getUserbyIdWithRol(uid);
        if(!user) throw new Error("[400], Usuario no existe en el sistema");
        console.log("ROL: ",user.roles.description);
        
        //let properties:PackagingProperties[] = await this.packagingRepository.getPackagingWithProperties(request.products);
        let orderDateTime = request.date.split(" ");
        let order:OrderSeller = new OrderSeller();
        order.date = orderDateTime[0]+"T"+orderDateTime[1];
        order.status="ACTIVE";
        order.urgent=request.urgent;
        order.seller=user;
        
        let subOrderArr:Array<SubOrder> = new Array<SubOrder>();
        for(let suborder of request.products){
          
          let presentation = await this.presentationProductsRepository.findByKeySae(suborder.keySae);
          if(!presentation) throw new Error(`[404], la presentacion con el codigo: '${suborder.keySae}' no existe`);
          let subOrder:SubOrder = new SubOrder();
          subOrder.units= suborder.quantity;
          subOrder.productRovianda = presentation.productRovianda;
          subOrder.presentation = presentation;
          subOrder.typePrice=presentation.typePrice;
          subOrder.active=true;
          subOrder.observations = suborder.observations;
          subOrder.weight=0;
          if(suborder.outOfStock){
            subOrder.outOfStock=suborder.outOfStock;
          }
          subOrderArr.push(subOrder);
        }
        order.subOrders = subOrderArr;
        
        await this.saleSellerRepository.saveSalesSeller(order);
    }

    async getOrdersBySeller(uid:string){
        return await this.saleSellerRepository.getOrders(uid);
    }

    async getProductsOfOrderSeller(orderId:number,mode:string){
        let result=[];
        let cheesesIds = [];
        let cheeses = await this.cheeseRepository.getAllCheeses();
        cheesesIds=cheeses.map(x=>x.product.id);
        if(mode==null || mode==undefined){
          result = await this.salesRequestRepository.getProductsOfOrder(orderId);
          result = result.filter(x=>!cheesesIds.includes(x.product_id));
        }else if(mode=="cheese"){
          result = await this.salesRequestRepository.getProductsOfOrder(orderId);
          result=result.filter(x=>cheesesIds.includes(x.product_id));
        }
        return result;
    }

    async getPresentationsOfProductOfOrder(orderId:number){
        // let order:OrderSeller = await this.saleSellerRepository.getOrderById(orderId);
        // if(!order) throw new Error("[404], la orden no existe");
        // let product:ProductRovianda = await this.productRoviandaRepository.getById(productId);
        // if(!product) throw new Error("[404], el producto de rovianda no existe");
        return await this.salesRequestRepository.getPresentationOfProductOfOrder(orderId);
    }
    async getPresentationsOfProductOfOrderApp(orderId:number,productId:number){
      // let order:OrderSeller = await this.saleSellerRepository.getOrderById(orderId);
      // if(!order) throw new Error("[404], la orden no existe");
      // let product:ProductRovianda = await this.productRoviandaRepository.getById(productId);
      // if(!product) throw new Error("[404], el producto de rovianda no existe");
      return await this.salesRequestRepository.getPresentationOfProductOfOrderApp(orderId,productId);
  }

    async getSellerInventory(sellerUid:string){
        return await this.sellerInventoryRepository.getSellerInventoryBySellerId(sellerUid);
    }

    async getRoviandaInventory(){
      return await this.packagingRepository.getPackagingAvailable();
    }
    async getRoviandaInventoryProduct(productId:number){
      let product = await this.productRoviandaRepository.getById(productId);
      if(!product) throw new Error("[404], producto de rovianda no existe"); 
      
      let presentations:Array<Presentation> = await this.packagingRepository.getPackagingAvailableProduct(productId);
      for(let presentation of presentations){
        let productSae = await this.sqlsRepository.getProductSaeByKey(presentation.keySae);
        if(!productSae.length) throw new Error("[400], producto no existente en SAE");
        let uniMed:string= (productSae[0].UNI_MED as string).toLowerCase();;
        if(uniMed=="kg"){
          presentation.isPz=false;
          let hasKg=(presentation.typePresentation as string).toLowerCase().includes("kg");
          let kagNumber =0;
          if(hasKg){
            let kgNumber:string =((presentation.typePresentation.split('(')[1]).split(')')[0]).toLowerCase();
            kgNumber=kgNumber.slice(0,kgNumber.indexOf('kg'));
            kagNumber =  +kgNumber;
            presentation.pricePresentationPublic=presentation.pricePresentationPublic*kagNumber;
          }
        }else if(uniMed=="pz"){
          presentation.isPz=true;
        }
        //let claveEsq = +productSae[0].CVE_ESQIMPU;
      /*switch(claveEsq){
        case 1:
          presentation.pricePresentationPublic +=(presentation.pricePresentationPublic*.16);
          presentation.pricePresentationMin +=(presentation.pricePresentationMin*.16);
          presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.16);
          break;
          case 2: // sin IVA operaciones no necesarias
            break;
            case 3: // IVA EXCENTO
              break;
              case 4: // 16 IVA mas 8% de IEPS
                presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.16);
                presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.08)
                presentation.pricePresentationMin += (presentation.pricePresentationMin*.16);
                presentation.pricePresentationMin += (presentation.pricePresentationMin*.08)
                presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.16);
                presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.08)
                break;
                case 5:// 16 IVA mas 25% de IEPS
                presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.16);
                presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.25)
                presentation.pricePresentationMin += (presentation.pricePresentationMin*.16);
                presentation.pricePresentationMin += (presentation.pricePresentationMin*.25)
                presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.16);
                presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.25)
                  break;
                  case 6:// 16 IVA mas 50% de IEPS
                      presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.16);
                      presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.50)
                      presentation.pricePresentationMin += (presentation.pricePresentationMin*.16);
                      presentation.pricePresentationMin += (presentation.pricePresentationMin*.50)
                      presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.16);
                      presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.50)
                    break;
      }*/
    }
      return presentations; 
    }

    async getSellerInventoryProductPresentation(sellerUid:string,productId:number){
      
      let product = await this.productRoviandaRepository.getById(productId);
      if(!product) throw new Error("[404], no existe el producto de rovianda");
      
      
      let presentations:Array<Presentation> = await this.sellerInventoryRepository.getSellerInventoryProductPresentation(sellerUid,productId);
      for(let presentation of presentations){
        let productSae = await this.sqlsRepository.getProductSaeByKey(presentation.keySae);
        if(!productSae.length) throw new Error("[400], producto no existente en SAE");
        //let claveEsq = +productSae[0].CVE_ESQIMPU;
        let uniMed:string= (productSae[0].UNI_MED as string).toLowerCase();;
        if(uniMed=="kg"){
          presentation.isPz=false;
          // let hasKg=(presentation.typePresentation as string).toLowerCase().includes("kg");
          // let kagNumber =0;
          // if(hasKg){
          //   let kgNumber:string =((presentation.typePresentation.split('(')[1]).split(')')[0]).toLowerCase();
          //   kgNumber=kgNumber.slice(0,kgNumber.indexOf('kg'));
          //   kagNumber =  +kgNumber;
          //   presentation.pricePresentationPublic=presentation.pricePresentationPublic*kagNumber;
          // }
        }else if(uniMed=="pz"){
          presentation.isPz=true;
        }
      /*switch(claveEsq){
        case 1:
          presentation.pricePresentationPublic +=(presentation.pricePresentationPublic*.16);
          presentation.pricePresentationMin +=(presentation.pricePresentationMin*.16);
          presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.16);
          break;
          case 2: // sin IVA operaciones no necesarias
            break;
            case 3: // IVA EXCENTO
              break;
              case 4: // 16 IVA mas 8% de IEPS
                presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.16);
                presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.08)
                presentation.pricePresentationMin += (presentation.pricePresentationMin*.16);
                presentation.pricePresentationMin += (presentation.pricePresentationMin*.08)
                presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.16);
                presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.08)
                break;
                case 5:// 16 IVA mas 25% de IEPS
                presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.16);
                presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.25)
                presentation.pricePresentationMin += (presentation.pricePresentationMin*.16);
                presentation.pricePresentationMin += (presentation.pricePresentationMin*.25)
                presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.16);
                presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.25)
                  break;
                  case 6:// 16 IVA mas 50% de IEPS
                      presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.16);
                      presentation.pricePresentationPublic += (presentation.pricePresentationPublic*.50)
                      presentation.pricePresentationMin += (presentation.pricePresentationMin*.16);
                      presentation.pricePresentationMin += (presentation.pricePresentationMin*.50)
                      presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.16);
                      presentation.pricePresentationLiquidation += (presentation.pricePresentationLiquidation*.50)
                    break;
      }*/
    }
  
      return presentations;
    }

    async getClientsOfSeller(sellerUid:string){
      let seller = await this.userRepository.getUserById(sellerUid);
      if(!seller) throw new Error("[404],no existe ese vendedor");
      let response=[];
      for(let client of seller.clientsArr){
          let salesArr:Sale[] = await this.saleRepository.getSalesPendingByClient(client);
          for(let sale of salesArr){
            let subSales=await this.subSalesRepository.getSubSalesBySale(sale);
            let products =subSales.map(x1=>{return `${x1.product.name}-${x1.presentation.presentation} ${x1.presentation.presentationType}`})
            let debts = sale.debts.filter(x=>x.status==true);
            if(debts.length){
              for(let debt of debts){
                let date=new Date(debt.createDay);
                date.setHours(date.getHours()-6);
                let date2=new Date();
                date2.setHours(date2.getHours()-6);
                const diffTime = Math.abs(date2.getDate() - date.getDate());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            response.push( {
              clientName:client.name,
              debId:debt.debId,
              date: debt.createDay,
              dayRest: debt.days-diffDays,
              amount: debt.amount,
              credit: client.credit,
              products
            });
          }
          }
          }
      }
      return response;
    }

    async payDeb(debId:number,debtsDTO:DebtsPaymentRequest){
      let debts:Debts=await this.debRepository.getDebts(debId);
      if (!debts)
        throw new Error(`[404],debt with id  ${debId} was not found`);
        let debs:Debts = await this.debRepository.getSaleIdFromDebtId(debId);
        let sale:Sale = debs.sale;
        
      if(debts.amount==debtsDTO.amount){
        debts.status=false;
        let saleWithClient = await this.saleRepository.getSaleByIdWithClientAndSeller(sale.saleId);
        saleWithClient.client.credit+=debts.amount;
        await this.clientRepository.saveClient(saleWithClient.client);
        await this.debRepository.saveDebts(debts);
      }else if(debtsDTO.amount< debts.amount){
        let debtsNew:Debts = new Debts();
        debtsNew.amount=debts.amount-debtsDTO.amount;
        let date=new Date();
        date.setHours(date.getHours()-6);
        debtsNew.createDay= date.toISOString();
        debtsNew.days=debtsDTO.days;
        debtsNew.status=true;
        debtsNew.seller=debts.seller;
        let saleEntity:Sale =await this.saleRepository.getSaleWithDebts(sale.saleId);
        saleEntity.debts.push(debtsNew);
        await this.saleRepository.saveSale(saleEntity);
      }
      console.log(debs.sale);
      let debstOfClient = await this.saleRepository.getAllDebsActive(debs.sale.client);
      if(!debstOfClient.length){
         debs.sale.client.hasDebts = false;
         await this.clientRepository.saveClient(debs.sale.client);
      }
    }

    async saveSellerOperation(request:SellerOperationDTO){
      let user:User = await this.userRepository.getUserById(request.sellerUid);
      if(!user) throw new Error("[404], user not found");
      let date = new Date();
      date.setHours(date.getHours()-6);
      let month:string = (date.getMonth()+1).toString();
      let day:string  = date.getDate().toString();
      if(+month<10){
        month=+"0"+month;
      }
      if(+day<10){
        day="0"+day;
      }
      let dateStr:string = date.getFullYear()+"-"+month+"-"+day;
      let sellerOperation:SellerOperation = await this.sellerOperationRepository.getSellerOperationByDateUser(dateStr,user);
      if(sellerOperation){
        if(sellerOperation.eatingTimeEnd!=null && sellerOperation.eatingTimeEnd!=""){
          throw new Error("[409], ya haz terminado un tiempo de comida por hoy");
        }else{
          throw new Error("[409], ya haz iniciado un tiempo de comida por hoy");
        }
      }
      let sellerOperationToSave:SellerOperation = new SellerOperation();
      
      let newHour = date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds();
      sellerOperationToSave.date = dateStr;
      sellerOperationToSave.eatingTimeStart = newHour;
      sellerOperationToSave.seller = user;
      await this.sellerOperationRepository.saveSellerOperation(sellerOperationToSave);

    }

    async updateHourSellerOperation(sellerUid:string){
      let sellerOperationEntity:Array<{sellerOperationId:number}> = await this.sellerOperationRepository.getLastSellerOperation(sellerUid);
      if(!sellerOperationEntity.length) throw new Error("[409], no existe una actividad de comida actualmente");
      let date = new Date();
      date.setHours(date.getHours()-6)
      let newHour = date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds();
      let sellerOperation:SellerOperation = await this.sellerOperationRepository.getSellerOperationById(sellerOperationEntity[0].sellerOperationId);
      sellerOperation.eatingTimeEnd=newHour;
      console.log(JSON.stringify(sellerOperation));
      return await this.sellerOperationRepository.saveSellerOperation(sellerOperation);
    }

    async timesMovents(sellerUid:string){
      if(!sellerUid) throw new Error("[400], sellerUid is required");
      let user:User = await this.userRepository.getUserById(sellerUid);
      if(!user) throw new Error("[404], sellerUid not found");
      let today = new Date();
      today.setHours(today.getHours()-6)
      let dd:any = today.getDate();
      let mm:any = today.getMonth()+1; 
      let yyyy:any = today.getFullYear();
      if(dd<10) { dd='0'+dd; } 
      if(mm<10) { mm='0'+mm; }
      let date = `${yyyy}-${mm}-${dd}`;
      let sellerOperation:SellerOperation = await this.sellerOperationRepository.getSellerOperationByDateUser(date,user);
      let sales:Sale[] = await this.saleRepository.getSalleSellerByDateUser(sellerUid,date);
      console.log(sales)
      let c:number=0; 
      let nc:number=0
      let response:any = []
      for(let i = 0; i < sales.length; i++){
        if(sellerOperation.eatingTimeStart < sales[i].hour){
          response.push({
              numConse: "---",
              venta: sellerOperation.eatingTimeStart,
              hora: sellerOperation.eatingTimeEnd
            })
          i = sales.length;
        }else{
          nc++;
          response.push({
            numConse: nc,
            venta: `C:${sales[i].client.id}`,
            hora: sales[i].hour
          })
          c++;
        }
      }
      for(;c<sales.length;c++){
        nc++;
        response.push({
          numConse: nc,
          venta: `C:${sales[c].client.id}`,
          hora: sales[c].hour
        })
      }
      return response;
    }

    async saleClient(sellerUid:string,saleId:number){
      if(!sellerUid) throw new Error("[400], sellerUid is required");
      if(!saleId) throw new Error("[400], saleId is required");
      let userSeller:User = await this.userRepository.getUserById(sellerUid);
      if(!userSeller) throw new Error("[404], Seller not found");
      let sale:Sale = await this.saleRepository.getSalesBySaleIdSeller(saleId,sellerUid);
      if(!sale) throw new Error("[404], sale not found");
      let subSales:SubSales[] = await this.subSalesRepository.getSubSalesBySale(sale);
      console.log(subSales)
      let response:any = [];
      let response2:any = {};
      let tot:number = 0;
      let piecestot:number = 0;
      for(let i = 0; i < subSales.length; i++){
        tot = tot + subSales[i].amount;
        piecestot = piecestot + subSales[i].quantity;
        response.push({
          description: `${subSales[i].product ? subSales[i].product.name : ""}`,
          quantity: subSales[i].quantity,
          price: subSales[i].presentation ? subSales[i].presentation.presentationPricePublic : "",
          amount: subSales[i].amount
        })
      }
      response2 = {
        numNota: sale.saleId,
        date: sale.date,
        hour: sale.hour,
        vendedor: userSeller.name,
        client: sale.client.id,
        sale: response,
        pieces: piecestot,
        total: tot
      }
      return response2;
    }

    async reportSales(sellerUid:string){
      if(!sellerUid) throw new Error("[400], sellerUid is required");
      let sellerUser:User = await this.userRepository.getUserById(sellerUid);
      if(!sellerUser) throw new Error("[404], sellerUid not found");
      let today = new Date();
      today.setHours(today.getHours()-6)
      let dd:any = today.getDate();
      let mm:any = today.getMonth()+1; 
      let yyyy:any = today.getFullYear();
      if(dd<10) { dd='0'+dd; } 
      if(mm<10) { mm='0'+mm; }
      let date = `${yyyy}-${mm}-${dd}`;
      console.log(date)
      let sale:Sale[] = await this.saleRepository.getSalesBySellerId(sellerUid,date);
      let response3:any = [];
      let response2:any = {};
      let totSale:number = 0;
      for(let i = 0; i < sale.length; i++){
        let subSales:SubSales[] = await this.subSalesRepository.getSubSalesBySale(sale[i]);
        let response:any = [];
        let tot:number = 0;
        let piecestot:number = 0;
        for(let c = 0; c < subSales.length; c++){
          tot = tot + subSales[c].amount;
          piecestot = piecestot + subSales[c].quantity;
          response.push({
            description: `${subSales[c].product ? subSales[c].product.name : ""}`,
            quantity: subSales[c].quantity,
            price: subSales[c].presentation ? subSales[c].presentation.presentationPricePublic : "",
            amount: subSales[c].amount
          })
        }
        totSale = totSale + tot;
        response3.push({
          numConsecutive: i+1,
          invoice: sale[i].saleId,
          nameClient: sale[i].client ? sale[i].client.name : "",
          client: sale[i].client ? sale[i].client.id : "",
          amountTot: tot,
          sale: response,
        })
      }

      response2 = {
        saleDay: response3,
        totSaleDay:totSale
      }
      return response2;
    }

    // async getSales(){

    //   let sales_request : SalesRequest[] = await this.salesRequestRepository.getSalesRequest();
      
    //   let response = [];
    //     sales_request.forEach(i => {
    //       response.push({
    //         userId: `${i.userId}`,
    //         noOrder: `${i.requestId}`,
    //         vendedor: `${i.vendedor}`,  
    //       });
    //     });
    //   return response;
    // }

    // async saveSalesProduct(salesProductDTO:SalesProductDTO){

    //   if(!salesProductDTO.userId)throw new Error("[400],userId is required");
    //   if(salesProductDTO.urgent == null )throw new Error("[400],urgent is required");
    //   let user:User = await this.userRepository.getUserById(salesProductDTO.userId);
    //   if(!user)throw new Error(`[404],user with id ${salesProductDTO.userId} not found`);

    //   let date = `${new Date().getFullYear().toString()}-${new Date().getMonth().toString()}-${new Date().getDate().toString()}`;

    //   let saleSeller : SaleSeller = new SaleSeller();
    //   saleSeller.date = date;
    //   saleSeller.status = true;
    //   saleSeller.urgent = salesProductDTO.urgent;
    //   saleSeller.user = user;
    //   await this.saleSellerRepository.saveSalesSeller(saleSeller);

    //   let lastSaleSeller: SaleSeller= await this.saleSellerRepository.getLastSaleSeller();
  
    //     for(let i = 0; i<salesProductDTO.requestedProducts.length; i++){
    //       if(!salesProductDTO.requestedProducts[i].productId)throw new Error("[400],productId is required");
    //       if(!salesProductDTO.requestedProducts[i].presentationId)throw new Error("[400],productId is required");
    //       if(!salesProductDTO.requestedProducts[i].units)throw new Error("[400],productId is required");
    //       let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByIds(+salesProductDTO.requestedProducts[i].productId);
    //       if(!product)throw new Error(`[404],productId ${salesProductDTO.requestedProducts[i].productId} not found`);
    //       if(!product.packaging[0])throw new Error(`[404], product with id ${salesProductDTO.requestedProducts[i].productId} no exist in packaging`);
    //       let presentation:PresentationProducts = await this.presentationProductsRepository.getPresentatiosProductsById(+salesProductDTO.requestedProducts[i].presentationId);
    //       if(!presentation)throw new Error(`[404],presentationId ${salesProductDTO.requestedProducts[i].presentationId} not found`); 

    //       let saleProduct:SalesRequest = new SalesRequest();
    //         saleProduct.date = date;
    //         saleProduct.status = true; 
    //         saleProduct.productId = product.id;
    //         saleProduct.presentation = presentation;
    //         saleProduct.units = salesProductDTO.requestedProducts[i].units;
    //         saleProduct.saleSeller = lastSaleSeller;
    //         await this.salesRequestRepository.saveSalesProduct(saleProduct);
    //     }
    // }
     dateDiffInDays(a, b) {
      // Discard the time and time-zone information.
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    
      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    async getSellerGuards(sellerUid:string){
      let user:User = await this.userRepository.getUserById(sellerUid);
      if(!user) throw new Error("[404], user not found");
      let sellerGuard = await this.sellerInventoryRepository.getSellerBySellerId(sellerUid);
      if(sellerGuard.length ==0){return []}
      let response = [];
      for (let i = 0; i < sellerGuard.length; i++) {
          response.push({
            productId : sellerGuard[i].product ? sellerGuard[i].product.id :null,
            presentations : await this.sellerInventoryRepository.getPresentationsSeller(sellerGuard[i].product.id,sellerUid)
          });
      }
       return response;
     }

     async getAllSellerClientsBySellerUid(sellerUid:string,hint:number){
        let seller:User = await this.userRepository.getUserById(sellerUid);
        if(!seller) throw new Error("[404], no existe el usuario vendedor");
        if(hint==0){
        let clients:Client[]= await this.clientRepository.getAllClientBySeller(seller);
        //let clientPublic:Client = await this.clientRepository.getClientPublic();
          //clients.push(clientPublic);
          return clients;
        }else{
          return await this.clientRepository.getAllClientBySellerAndHint(seller,hint);
        }
     }

     async createSeller(userDTO:UserDTO){
       console.log("seller dto",userDTO);
        let rol:Roles = await this.rolesRepository.getRoleById(userDTO.rolId);
        let user:User= new User();
        user.name = userDTO.name +" "+ userDTO.firstName+" "+userDTO.lastName;
        user.email = userDTO.email;
        user.job = userDTO.job;
        user.roles = rol;
        user.saeKey = userDTO.clave;
        user.warehouseKeySae=userDTO.warehouse;
        await this.firebaseHelper.createUser(userDTO).then(async(userRecord)=>{
          user.id= userRecord.uid;
          await this.userRepository.saveUser(user);        
          try{  
           await this.sqlsRepository.createSeller(userDTO);
           await this.sqlsRepository.updateWarehouse(userDTO.warehouse,user.name);
          }catch(err){
            console.log("Error: "+err.message);
          }
        });        
     }
    
    async createSaleSae(saleRequestForm:SaleRequestForm){
      console.log("SALE REQUEST FORM: ",JSON.stringify(saleRequestForm));
      console.log("iniciando creacion de venta");
      let seller:User = await this.userRepository.getUserById(saleRequestForm.sellerId);
      console.log("obteniendo vendedor");
      //let alreadyActive = await this.sqlsRepository.getSellerActive(seller.saeKey);
      console.log("obteniendo vendedor de sae");
      //if(!alreadyActive.recordset.length) throw new Error("[409], el vendedor no esta activo en SAE");
      let clientRovianda = await this.clientRepository.findByClientKey(saleRequestForm.keyClient);
      //if(clientRovianda.status=="INACTIVE") throw new Error("[409], el cliente ah sido eliminado del sistema");
      // if(clientRovianda.idAspel==0){
      //   console.log("obteniendo cliente de sae");
      //   let client = await this.sqlsRepository.getClientsByKey(saleRequestForm.keyClient);
      //   if(!client.recordset.length) throw new Error("[404], no existe el cliente en SAE");
      // }
      
          
      console.log("iniciando recorrido de articulos");
      let saleGral = new Sale();
      saleGral.client = clientRovianda;
      saleGral.seller=seller;
      let date = new Date();
      saleGral.statusStr="ACTIVE";
      date.setHours(date.getHours()-6);    
      saleGral.date = date.toISOString();
      saleGral.dateSincronized=date.toISOString();
      saleGral.hour = `${date.getHours()}:${date.getMinutes()}`;
      saleGral.subSales = new Array<SubSales>();
      if(saleRequestForm.credit && saleRequestForm.typeSale=="Crédito"){
        
        if(clientRovianda.currentCredit<saleRequestForm.credit) throw new Error("[409], credito insuficiente solo tienes $"+clientRovianda.currentCredit +" de $"+clientRovianda.credit);
        saleGral.credit = saleRequestForm.credit;
        clientRovianda.currentCredit-=saleRequestForm.credit;
        saleGral.typeSale="CREDITO";
        saleGral.status=true;
        
        await this.clientRepository.saveClient(clientRovianda);
      }else{
        saleGral.typeSale=saleRequestForm.typeSale.toUpperCase();
        saleGral.status=false;
      }
      for(let sale of saleRequestForm.products){
       let subSale:SubSales = new SubSales();
       let presentation:PresentationProducts = null; 
       presentation= await this.presentationProductsRepository.findByKeySae(sale.productKey);
       if(!presentation){
         presentation = await this.presentationProductsRepository.findByKeySaeByLike(sale.productKey);
       }
       subSale.presentation = presentation;
       subSale.product = presentation.productRovianda;
       subSale.quantity=sale.quantity;
       
       //let exist = await this.sqlsRepository.getProductExist(presentation.keySae,sale.quantity,seller.warehouseKeySae);
      //  let productSae = null;
      //  productSae= await this.sqlsRepository.getProductSaeByKey(presentation.keySae);
      //  if(!productSae.length){
      //   productSae = await this.sqlsRepository.getProductSaeByKeyLike(presentation.keySae);
      //  }
      //  if(!productSae.length) throw new Error("[404], no existe el product en aspel sae");
       //let uniMed:string= presentation.uniMed.toLocaleLowerCase();//(productSae[0].UNI_MED as string).toLowerCase();
       console.log("buscando existencia en stock");
       if(!presentation) throw new Error("[404], no existe la presentacion del producto en el sistema rovianda");
       //let avaibleProduct:SellerInventory[] = await this.sellerInventoryRepository.getByProductPresentationAndSeller(presentation.productRovianda,presentation,seller);
       //let stock = 0;
      //  for(let ava of avaibleProduct){
      //     if(uniMed=="pz"){
      //       stock+=ava.quantity;
      //     }else{
      //       stock+=ava.weigth;
      //     }
      //  }
       //if(stock<sale.quantity) throw new Error("No hay stock Suficiente para la venta");
       
       //let removedCount = sale.quantity;//4
       //let tempRemoved=0;
      //  for(let ava of avaibleProduct){
      //     if(uniMed=="pz"){
      //       if(ava.quantity<removedCount){
      //         ava.quantity=0;
      //           removedCount-=ava.quantity;
      //       }else{
      //         tempRemoved=removedCount;
      //         removedCount=tempRemoved-ava.quantity;
      //         ava.quantity-=tempRemoved;
              
      //       }
            
      //     }else if(uniMed=="kg"){
      //         if(ava.weigth<removedCount){//6<4
      //           ava.weigth=0;
      //           removedCount-=ava.weigth;
      //         }else{
      //           tempRemoved = removedCount;//4
      //           removedCount=removedCount-ava.weigth; // -2
      //           ava.weigth-=tempRemoved; //6 -> 4   
      //         }
      //     }
      //     await this.sellerInventoryRepository.saveSellerInventory(ava);
         
      //  } 
       console.log("Eliminado de stock completado");
        let price =0;
        //if(presentation.typePrice=="PUBLIC"){
          price = presentation.presentationPricePublic;
        /*}else if(presentation.typePrice=="MIN"){
          price = presentation.presentationPriceMin;
        }else if(presentation.typePrice=="LIQUIDATION"){
          price = presentation.presentationPriceLiquidation;
        }*/
       
        sale.price= price;
        subSale.amount = sale.quantity*sale.price;
        subSale.loteId="desconocido";
        saleGral.subSales.push(subSale);
        //let sellerInventory=await this.sellerInventoryRepository.getInventoyOfProductPresentationId(presentation,sale.quantity,seller);
        //sellerInventory.quantity-=sale.quantity;
        
        //await this.sellerInventoryRepository.saveSellerInventory(sellerInventory);
        
     }
     saleGral.amount = saleRequestForm.amount;
     saleGral.payedWith = saleRequestForm.payed;
     //console.log("SaleGral: "+saleGral.amount);
     if(saleRequestForm.credit){
       saleRequestForm.payed=saleGral.amount-saleGral.credit;
     }
     //console.log("SaleGral: "+saleGral.credit);
      
     let lastSale:any =null;
     lastSale= await this.saleRepository.getLastFolioOfSeller(seller);//await this.sqlsRepository.createSaleSae(saleRequestForm,seller.saeKey,clientSAE);
     /*if(!lastSale){
      lastSale = await this.sqlsRepository.getLastFolioCount();
     }*/
      let folio ="";
      if(lastSale){
      let subFolio = lastSale.replace(seller.cve,"");
       folio=(+subFolio+1).toString();
       folio = seller.cve+folio;
      }else{
        folio=seller.cve+'1';
      }
     saleGral.folio=folio.toString();
     saleGral.folioTemp=folio.toString();
     console.log("VENTA A HACER: ",JSON.stringify(saleGral));
     console.log("SALE REQUEST FORM: ",JSON.stringify(saleRequestForm));
     let saleSaved:Sale =await this.saleRepository.saveSale(saleGral);
     console.log("iniciando proceso de grabado");
     
     return saleSaved;
    }

    async getAllTaxSchemas(){
      return await this.sqlsRepository.getAllTaxSchemas();
    }

    async getSellerCount(){
      let result= await this.sqlsRepository.getSellerCount();
      
      if(!result.length){
        
          return {count:1}
        
      }else{
        let clave:number = +result[0].CVE_VEND;
        
        return {count:(clave)+1}
      }
    }


    async getDebtsOfClient(clientId:number){
      let client:Client = await this.clientRepository.findByClientKey(clientId);
      let salesArr:Sale[] = await this.saleRepository.getSalesPendingByClient(client);
      let response=[];
      for(let sale of salesArr){
        let subSales=await this.subSalesRepository.getSubSalesBySale(sale);
        let products =subSales.map(x1=>{return `${x1.product.name}-${x1.presentation.presentation} ${x1.presentation.presentationType}`})
        let debt = sale.debts.filter(x=>x.status==true)[0];
        if(debt){
        response.push( {
          debId:debt.debId,
          date: debt.createDay,
          amount: debt.amount,
          products
        });
      }
      }
      return response;
    }

    async getTicketOfSale(saleId:number){
      let sale:Sale = await this.saleRepository.getSaleByIdWithClientAndSeller(saleId);
      if(!sale) throw new Error("[404], no existe la venta");
      let cancelRequest = await this.saleCancelRepository.findCancelRequestByFolio(sale.folio);
      let subSales = await this.subSalesRepository.getSubSalesBySale(sale);
      let ticket:string = await this.ticketUtil.TicketSale(sale,subSales,cancelRequest);
      
      return ticket;
    }

    async getDevolutionTicketOfSale(saleId:number){
      let sale:Sale = await this.saleRepository.getSaleByIdWithClientAndSeller(saleId);
      if(!sale) throw new Error("[404], no existe la venta");
      let devolutionRequest = await this.devolutionRequestSellerRepository.getDevolutionSellerRequestByFolio(sale.folio);
      let devolutionSubSalesModified = await this.devolutionOldSubSalesRepository.getByDevolutionRequestIdAndTypeToTicket(devolutionRequest.devolutionAppRequestId,"MODIFIED");
      let devolutionSubSalesOriginal = await this.devolutionOldSubSalesRepository.getByDevolutionRequestIdAndTypeToTicket(devolutionRequest.devolutionAppRequestId,"ORIGINAL");
      let ticket:string = await this.ticketUtil.DevolutionTicketSale(sale,devolutionSubSalesOriginal);
      let ticketModified:string = await this.ticketUtil.DevolutionTicketSale(sale,devolutionSubSalesModified);
      ticket+="DEVOLUCION\nMOTIVO: "+devolutionRequest.observations+"\n\n\n";
      ticket+=ticketModified;
      return ticket;
    }

    async getSingleTicketOfSale(saleId:number){
      let sale:Sale = await this.saleRepository.getSaleByIdWithClientAndSeller(saleId);
      if(!sale) throw new Error("[404], no existe la venta");
      let cancelRequest = await this.saleCancelRepository.findCancelRequestByFolio(sale.folio);
      let subSales = await this.subSalesRepository.getSubSalesBySale(sale);
      let ticket:string = await this.ticketUtil.TicketSale(sale,subSales,cancelRequest);
      return ticket;
    }

    async endDaySeller(sellerUid:string,date:string){
      let user:User = await this.userRepository.getUserById(sellerUid);
      if(!user) throw new Error("[404], vendedor no existe la venta");
      
      let dateParsed=new Date(date);
      //dateParsed.setHours(dateParsed.getHours());
      let month=(dateParsed.getMonth()+1).toString();
      let day = dateParsed.getDate().toString();
      if(+month<10){
        month='0'+month;
      }
      if(+day<10){
        day='0'+day;
      }
      let dateStr = dateParsed.getFullYear()+"-"+month+"-"+day;
      console.log(dateStr);
      let sales:Sale[]=await this.saleRepository.getSaleByDate(dateStr,user);
      
      for(let sale of sales){
        let subSales = await this.subSalesRepository.getSubSalesBySale(sale);
        sale.subSales=subSales;
      }
      let sellerOperations:SellerOperation = await this.sellerOperationRepository.getSellerOperationByDateUser(dateStr,user);
      let clientOfSeller = await this.clientRepository.getClientBySeller(user);
      let subSales = await this.subSalesRepository.getBySeller(user,dateStr);
      let clientsIds = clientOfSeller.map(x=>x.id);
      let newclientsIds=  [];
      console.log(clientsIds);
      // for(let id of clientsIds){
      //   if(!newclientsIds.includes(id)){
      //     newclientsIds.map
      //   }
      // }
      //let visitsOfSellerInDay:VisitClientOperation[] = await this.visitOperationReporsitory.getByClientOfSellerIdsAndDate(clientsIds,dateStr);
            
      /*let inventory:{presentationId:number}[] =  await this.sellerInventoryRepository.getInventoryMoreThanOneBySeller(user);
      let productsAvailable:PresentationsAvailables []  = [];
      for(let presentation of inventory){
          let presentationEntity:PresentationProducts = await this.presentationProductsRepository.getPresentationProductsById(presentation.presentationId);
          // let productSae = await this.sqlsRepository.getProductSaeByKey(presentationEntity.keySae);
          // if(productSae.length){
          let uniMed:string= presentationEntity.uniMed.toLocaleLowerCase();
          let avaibleProduct:SellerInventory[] = await this.sellerInventoryRepository.getByProductPresentationAndSeller(presentationEntity.productRovianda,presentationEntity,user)
          let quantityAvailable =0;
          for(let ava of avaibleProduct){
            if(uniMed=="kg"){
              quantityAvailable+=ava.weigth;
            }else if(uniMed=="pz"){
              quantityAvailable+=ava.quantity;
            }
          }
        
          productsAvailable.push({
            presentationType: presentationEntity.presentationType,
            price: presentationEntity.presentationPricePublic,
            keySae: presentationEntity.keySae,
            presentationId: presentationEntity.id,
            isPz: uniMed=="pz",
            nameProduct: presentationEntity.productRovianda.name,
            quantity: quantityAvailable
          })
        
      }*/
      let ticket=await this.ticketUtil.TickedEndDate(sales,user,sellerOperations,/*visitsOfSellerInDay,*/dateStr,subSales);
      return ticket;
    }

  async getResguardedTicket(sellerUid:string){
    let user:User = await this.userRepository.getUserById(sellerUid);
    if(!user) throw new Error("[404], vendedor no existe la venta");
    let inventory:{presentationId:number}[] =  await this.sellerInventoryRepository.getInventoryMoreThanOneBySeller(user);
    let productsAvailable:PresentationsAvailables []  = [];
    for(let presentation of inventory){
        let presentationEntity:PresentationProducts = await this.presentationProductsRepository.getPresentationProductsById(presentation.presentationId);
        // let productSae = await this.sqlsRepository.getProductSaeByKey(presentationEntity.keySae);
        // if(productSae.length){
        let uniMed:string= presentationEntity.uniMed.toLocaleLowerCase();
        let avaibleProduct:SellerInventory[] = await this.sellerInventoryRepository.getByProductPresentationAndSeller(presentationEntity.productRovianda,presentationEntity,user)
        let quantityAvailable =0;
        let weightAvailable=0;
        for(let ava of avaibleProduct){
          if(uniMed=="kg"){
            quantityAvailable+=ava.quantity;
            weightAvailable+=ava.weigth;
          }else if(uniMed=="pz"){
            quantityAvailable+=ava.quantity;
            weightAvailable+=ava.weigth;
          }
        }
      
        productsAvailable.push({
          presentationType: presentationEntity.presentationType,
          price: presentationEntity.presentationPricePublic,
          keySae: presentationEntity.keySae,
          presentationId: presentationEntity.id,
          isPz: uniMed=="pz",
          nameProduct: presentationEntity.productRovianda.name,
          quantity: quantityAvailable,
          weight: +weightAvailable.toFixed(2)
        })
      }
    
    let ticket=await this.ticketUtil.getResguardedTicket(productsAvailable,user.name);
    return ticket;
  }

    async getOrdersSellers(){
      let orders:OrderSeller[]= await this.saleSellerRepository.getAllOrdersSellers();
      let response:OrderSeller[]=[];
      let cheesesIds = [];
        let cheeses = await this.cheeseRepository.getAllCheeses();
        cheesesIds=cheeses.map(x=>x.product.id);
      for(let order of orders){
        let orderSeller=await this.saleSellerRepository.getOrderByIdWithSuborders(order.id);
            for(let i=0;i<orders.length;i++){
                let subOrders = await this.salesRequestRepository.getByOrderSeller(orders[i]);
                subOrders = subOrders.filter(x=>cheesesIds.includes(+x.productRovianda.id));
                if(!subOrders.length){
                  response.push(orderSeller);
                }
            }
        
      }
      return response;
    }
    async getAllSalesForSuperAdmin(page:number,peerPage:number,salesIds:Array<number>,date:string,hint:string,dateTo:string){
        return await this.saleRepository.getAllSalesForSuperAdmin(page,peerPage,salesIds,date,hint,dateTo);
    }

    async cancelSale(saleId:number){
      let sale:Sale = await this.saleRepository.getSaleByIdWithClientAndSeller(saleId);
      if(!sale) throw new Error("[404], no existe la venta");
      sale.statusStr="CANCELED";
      let subSales = await this.subSalesRepository.getSubSalesBySale(sale);
      for(let subSale of subSales){
        let sellerInventory = await this.sellerInventoryRepository.getByProductPresentationAndSeller(subSale.product,subSale.presentation,sale.seller);
        let productSae = await this.sqlsRepository.getProductSaeByKey(subSale.presentation.keySae);
        let uniMed:string= (productSae[0].UNI_MED as string).toLowerCase();
        if(sellerInventory.length){
          let firstInventoryOfProduct = sellerInventory[0];  
          if(uniMed=="pz"){
            firstInventoryOfProduct.quantity+=subSale.quantity;
          }else if(uniMed=="kg"){
            firstInventoryOfProduct.weigth+=subSale.quantity;
          }
          await this.sellerInventoryRepository.saveSellerInventory(firstInventoryOfProduct);
        }
      }
      
      await this.saleRepository.saveSale(sale);
    }

    async getAllSalesBySellerAndDate(sellerUid:string,date:string){
        let seller:User = await this.userRepository.getUserById(sellerUid);
        return await this.saleRepository.getAllSalesOfSellerUid(seller,date);
    }

    async deleteSalesBySuperAdmin(salesIds:Array<number>,date:string){
      if(!salesIds.length) throw new Error("[400], el arreglo de ventas no puede venir vacio");
      let sales:Sale[]=[];
      if(salesIds.length>1){
        let salesOrders = salesIds.sort((a,b)=>a-b);
       sales= await this.saleRepository.getSalesBetweenIds(salesOrders[0],date);
      }else{
        sales=await this.saleRepository.getSalesBetweenIds(salesIds[0],date);
      }
      if(sales.length){
      let cves = await sales.map(x=>{
        let folio = x.folio.split("V");
        return folio[0]+"cv"
      });
      
      //sales = sales.filter(x=>!salesIds.includes(x.saleId));

      for(let sale of sales){
        if(salesIds.includes(sale.saleId)){
            sale.statusStr="DELETED";
            // let subSales = await this.subSalesRepository.getSubSalesBySale(sale);
            // sale.subSales=subSales;
            //await this.sqlsRepository.updateProductInSaeBySellerWarehouses(sale);
        }
        await this.saleRepository.saveSale(sale);
      }

      let sellers:any[] = await this.userRepository.getAllSellersWithCVE();
        console.log("Vendedores obtenidos");
        for(let seller of sellers){
            console.log("Obteniendo último folio");
            let sales = await this.saleRepository.getLastSalesMaked(seller.id);
            console.log("Ultima venta de "+seller.name+" "+sales[0].folio_temp);
            let folio = +(sales[0].folio_temp as string).replace(seller.cve,"");
            console.log("Obteniendo todas las ventas del vendedor para reasignar folio");
            let salesOfSeller = await this.saleRepository.getSalesMaked(seller.id);
            for(let sale of salesOfSeller){
                folio++;
                console.log("Asignando folio: "+seller.cve+folio.toString());
                let folioStr = seller.cve+(folio.toString());
                await this.saleRepository.updateSaleFolio(folioStr,sale.sale_id);
            }
            console.log("Asignacion completa hasta :"+seller.cve+folio.toString());
        }
      
      }

    }

    async getDelSalesReport(date:string){
       let sales = await this.saleRepository.getAlldeletedByDate(date);
       console.log(sales,date);
       return await this.ticketUtil.getAllDeletesTickets(sales);
    }

    async transferAllSalesAutorized(dateStr?:string){
      let date=new Date();
      date.setHours(date.getHours()-24);

      let year = date.getFullYear();
      let month = (date.getMonth()+1).toString();
      if(+month<10){
        month="0"+month;
      }
      let day = date.getDate().toString();
      if(+day<10){
        day="0"+day;
      }
      let dayOfWeek =this.zellerGregorian(date);
      if(dayOfWeek==1){
        date.setHours(date.getHours()-24);
      }
      // console.log(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());
      // console.log(date.getHours()+"-"+date.getMinutes());
      
       let sales:Sale[] =[];
       if(dateStr){
            sales= await this.saleRepository.getSalesBetweenDates(dateStr);
       }else{
            sales =  await this.saleRepository.getSalesBetweenDates(year+"-"+month+"-"+day);
       }
      
      // let sale = await this.saleRepository.getSaleByIdWithClientAndSeller(saleId);
      for(let i=0;i<sales.length;i++){
        let sale=sales[i];
        if(!sale.sincronized){
          let subSales = await this.subSalesRepository.getSubSalesBySale(sale);
          if(sale.devolutionRequest){
            //let mapSubSales:Map<number,number> =new Map();
            // for(let devolution of devolutionSubSalesNew){
            //   mapSubSales.set(devolution.subSaleIdIdentifier,devolution.quantity);
            // }
            for(let subSale of subSales){
              let devolutionSubSalesNew = await this.devolutionOldSubSalesRepository.getDevolutionOldSubSalesBySubSaleId(subSale.appSubSaleId,sale.folio);
              if(devolutionSubSalesNew.length){
                let quantityNew = devolutionSubSalesNew[0].quantity;
                if(quantityNew){
                  subSale.amount=(subSale.amount/subSale.quantity)*quantityNew;
                  subSale.quantity=quantityNew;
                }
              }
            
            }
          }
          sale.subSales=subSales;
          try{
            let folio=await this.sqlsRepository.createSaleSae(sale);
            sale.newFolio = folio;
            sale.sincronized=true;
            await this.saleRepository.saveSale(sale);
          }catch(err){
            console.log("Error: "+err);
            console.log("Eliminando folio por desconexion: "+sale.folioTemp);
            let saleOfSae:any[] = await this.sqlsRepository.checkIfSaleAlreadyExist(sale.folioTemp,(dateStr)?(dateStr.split("-").join("")):`${year}${month}${day}`);
            if(saleOfSae.length && saleOfSae.length==1){
              await this.sqlsRepository.deleteSaeSale(sale.folio);
              i=i-1;
              console.log("Reinsertando folio: "+sale.folioTemp);
            }
            
          }
          
        }
      }
      console.log("Ventas traspasadas: "+year+"-"+month+"-"+day);
      
    }

    async findProduct(selleruid:string,productKey:string){
      let seller:User = await this.userRepository.getUserById(selleruid);
      if(!seller) throw new Error("[404], no existe el usuario");
      let productPresentation:PresentationProducts = null;
      productPresentation= await this.presentationProductsRepository.findByKeySae(productKey);
      if(!productPresentation){
        productPresentation = await this.presentationProductsRepository.findByKeySaeByLike(productKey);
      }
      if(productPresentation==null) throw new Error("[404], no existe el producto");
      let productSae =null;
      productSae= await this.sqlsRepository.getProductSaeByKey(productKey);
      if(!productSae.length){
        productSae= await this.sqlsRepository.getProductSaeByKeyLike(productKey);
      }
      if(!productSae.length) throw new Error("[400], producto no existente en SAE");
      let uniMed:string= (productSae[0].UNI_MED as string).toLowerCase();
      let avaibleProduct:SellerInventory[] = await this.sellerInventoryRepository.getByProductPresentationAndSeller(productPresentation.productRovianda,productPresentation,seller)
      let quantityAvailable =0;
      for(let ava of avaibleProduct){
        if(uniMed=="kg"){
          quantityAvailable+=ava.weigth;
        }else if(uniMed=="pz"){
          quantityAvailable+=ava.quantity;
        }
      }
    
      let product:{
          presentationType:string,
          price:number,
          keySae:string,
          presentationId: number,
          isPz:boolean,
          nameProduct:string,
          quantity:number
      }={
        presentationType: productPresentation.presentationType,
        price: productPresentation.presentationPricePublic,
        keySae: productPresentation.keySae,
        presentationId: productPresentation.id,
        isPz: uniMed=="pz",
        nameProduct: productPresentation.productRovianda.name,
        quantity: quantityAvailable
      }
      return product;
    }

    async findProductInve(key:string){
      let productPresentation:PresentationProducts = null;
      productPresentation= await this.presentationProductsRepository.findByKeySae(key);
      if(!productPresentation) {
        productPresentation = await this.presentationProductsRepository.findByKeySaeByLike(key);
      }
      if(!productPresentation) throw new Error("[404], no existe el producto");
      
      let productSae = null;
      productSae =await this.sqlsRepository.getProductSaeByKey(key);
      if(!productSae.length){
        productSae = await this.sqlsRepository.getProductSaeByKeyLike(key);
      }
      if(!productSae.length) throw new Error("[400], producto no existente en SAE");
      let uniMed:string= (productSae[0].UNI_MED as string).toLowerCase();

      let packagings = await this.packagingRepository.getPackagingsByProduct(productPresentation.productRovianda);
      let stock = 0;
      let stockPendingToDeliver=0;
      for(let packaging of packagings){
          let propertiesPackaging = await this.propertiesPackagingRepository.findPropiertiesPackagings(packaging);
          for(let pro of propertiesPackaging){
            if(pro.presentation.id==productPresentation.id){
              stock+=pro.units;
            }
          }
      }

      console.log("Total stock of: "+key+" : "+stock);

      let ordersSellers = await this.saleSellerRepository.getAllOrdersSellers();
      for(let orderSeller  of ordersSellers){
        let subOrdersSeller = await this.salesRequestRepository.getByOrderSeller(orderSeller);
        orderSeller.subOrders=subOrdersSeller;
        for(let sub of subOrdersSeller){
          if(sub.presentation.id==productPresentation.id){
            stockPendingToDeliver+=sub.units;
          }
        }
      }
      console.log("Total stock requested: "+stockPendingToDeliver);
      stock-=stockPendingToDeliver;
      let product:{
        presentationType:string,
        price:number,
        keySae:string,
        presentationId: number,
        isPz:boolean,
        nameProduct:string,
        quantity:number
    }={
      presentationType:productPresentation.presentationType,
      price: productPresentation.presentationPricePublic,
      keySae: productPresentation.keySae,
      presentationId: productPresentation.id,
      isPz: uniMed=="pz",
      nameProduct: productPresentation.productRovianda.name,
      quantity: (stock<0)?0:stock
    };
      return product;
    }

    async  getAllSellers() {
        let rol:Roles = await this.rolesRepository.getRoleById(10);
        let sellers:User[] = await this.userRepository.getByRol(rol);
        return sellers;
    }

    async getCurrentTime(sellerUid:string){

      let seller:User = await this.userRepository.getUserById(sellerUid);
      let dateParsed = new Date();
      dateParsed.setHours(dateParsed.getHours()-6);
      let month:string= (dateParsed.getMonth()+1).toString();
      let day:string = dateParsed.getDate().toString();
      if(+month<10){
        month='0'+month;
      }
      if(+day<10){
        day='0'+day;
      }
      let dateStr = dateParsed.getFullYear()+"-"+month+"-"+day;
      console.log("fecha a buscar: ",dateStr);
      let sellerOperations:SellerOperation = await this.sellerOperationRepository.getSellerOperationByDateUser(dateStr,seller);
      let response:{hours:number,minutes:number,seconds:number}=null;
      if(sellerOperations==null){
          throw new Error("[409], Aún no haz iniciado tu hora de comida");
        }else{
          if(sellerOperations.eatingTimeEnd!=null && !isEmpty(sellerOperations.eatingTimeEnd)){
            let hours = sellerOperations.eatingTimeEnd.split(":");
            let currentTimeEat = sellerOperations.eatingTimeStart.split(":");
            if(+hours[2]<+currentTimeEat[2]){
              hours[1]=(+hours[1]-1).toString();
              currentTimeEat[2]=(+currentTimeEat[2]-(+hours[2])).toString();
              hours[2]="60";
            }
            response={
              hours:+hours[0]-(+currentTimeEat[0]),
              minutes:+hours[1]-(+currentTimeEat[1]),
              seconds:+hours[2]-(+currentTimeEat[2])
          };
          }else{
            let newDate:Date = new Date();
            newDate.setHours(newDate.getHours()-6);
            let currentTimeEat = sellerOperations.eatingTimeStart.split(":");
            let seconds = newDate.getSeconds();
            if(newDate.getSeconds()<+currentTimeEat[2]){
              newDate.setMinutes(newDate.getMinutes()-1);
              currentTimeEat[2]=(+currentTimeEat[2]-seconds).toString();
              newDate.setSeconds(60);
            }
            response={
                hours:newDate.getHours()-(+currentTimeEat[0]),
                minutes:newDate.getMinutes()-(+currentTimeEat[1]),
                seconds:newDate.getSeconds()-(+currentTimeEat[2])
            };
          }
        }
      return response;
    }

    async getOrderDetails(orderId:number){
      let orderDetails = await this.saleSellerRepository.getDetailsOfOrderOfSellerToEdit(orderId);
      return orderDetails;
    }

    async deleteOrderDetails(items:OrderSellerUpdateProperties[],orderId:number){
        let ids=items.map(x=>x.subOrderId);
        let date= new Date();
        date.setHours(date.getHours()-6);
        let month = (date.getMonth()+1).toString();
        let day = date.getDate().toString();
        if(+month<10) month="0"+month;
        if(+day<10) day="0"+day;
        for(let item of items){
          //let totalRequested = item.quantity;
          let subOrder = await this.salesRequestRepository.getSubOrderById(item.subOrderId);
          let totalRequested = (await this.salesRequestRepository.getTotalSubOrdersUnitsRequested(subOrder.presentation.id,date.getFullYear()+"-"+month+"-"+day))[0];
          let totalAvailable = (await this.packagingRepository.getTotalAvailable(subOrder.productRovianda.id,subOrder.presentation.id))[0];
          let outOfStock = false;
          if(totalRequested && totalAvailable){
            if( ( (totalRequested.units-subOrder.units)+item.quantity) <=totalAvailable.units){
              outOfStock=false;
            }else{
              outOfStock=true;
            }
          }
          //subOrder.units = item.quantity;
          //await this.salesRequestRepository.saveSalesProduct(subOrder);
          console.log("Actualizar: "+item.subOrderId,item.quantity,outOfStock);
          await this.saleSellerRepository.updateSubOrderQuantity(item.subOrderId,item.quantity,outOfStock);
        }
        await this.saleSellerRepository.deleteSubordersOmit(ids,orderId);
    }

    async getAllDebtsOfSeller(sellerId:string){
        let seller = await this.userRepository.getUserById(sellerId);
        if(!seller) throw new Error("[404], no existe el vendedor");
        let sales:Sale[] =await this.saleRepository.getPendingCreditBySeller(seller);
        
        if(!sales.length){
          let date = new Date();
          let month = (date.getMonth()+1).toString();
          let day = date.getDate().toString();
          if(+month<10) month="0"+month;
          if(+day<10) day="0"+day;
          let year = date.getFullYear();
          let debts = await this.debRepository.getDebtsBySellerId(sellerId,`${year}-${month}-${day}`);
          sales = await this.saleRepository.getSalesBySalesIds(debts.map(x=>x.sale_id));
          
        }
        return sales;
    }

    async paySalePending(saleId:number,body:{typePayed:string}){
        let sale =await this.saleRepository.getSaleByIdWithClientAndSeller(saleId);
        sale.status=false;
        let date = new Date();
        date.setHours(date.getHours()-6);
        let debt:Debts=new Debts();
        debt.amount=sale.amount;
        debt.createDay=date.toISOString();
        debt.days=8;
        debt.seller=sale.seller;
        debt.status=false;
        debt.typePay=body.typePayed;
        debt.sale =sale;
        sale.debts=[debt];
        await this.saleRepository.saveSale(sale);
    }

    async getStatusSale(sellerId:string,from:string,to:string){
      let seller:User =await this.userRepository.getUserById(sellerId);
      if(!seller) throw new Error("[404], el usuario no existe");
      
      let response= await this.saleRepository.getAmountSales(from,to,sellerId);
      
      if(response.totalSolded==null){
        response.totalSolded="0";
      }
      return response;
   
    }

    async getModeOffline(sellerId:string,dateParam:string){
      let date = new Date(dateParam);
      //date.setHours(date.getHours()-6);
      let month = (date.getMonth()+1).toString();
      let day = date.getDate().toString();
      if(+month<10){
        month="0"+month;
      }
      if(+day<10){
        day="0"+day;
      }
      let dateStr = date.getFullYear()+"-"+month+"-"+day;

      let status= await this.saleRepository.getAmountSales(dateStr,dateStr,sellerId);
      console.log("Se obtuvo acumulado");
      let seller:User = await this.userRepository.getUserById(sellerId);
      console.log("Se obtuvo vendedor");
      let clients = await this.clientRepository.getAllClientBySeller(seller);
      let clientPublic = await this.clientRepository.getClientPublic();
      
      console.log("Se obtuvieron clientes");
      
      let dayStr = this.zellerGregorian(date);
      let clientsOfSellerUids = clients.map(x=>x.id);
        
      let clientsSchedule:DayVisited[] = await this.dayRepository.getClientsByDayOfVisitByDayAndClientIds(dayStr,clientsOfSellerUids);
      console.log("Se obtuvieron clientes a visitar");
      
      let clientsToVisit:ModeOfflineClients[]=clientsSchedule.map(x=>{
        let item:ModeOfflineClients={
          clientName: x.client.name,
          keyClient: x.client.keyClient.toString(),
          rfc: x.client.rfc,
          type: x.client.typeClient,
          clientId: 0
        }
        return item;
      });
      
      clientsToVisit.push({
        clientName: clientPublic.name,
        keyClient: clientPublic.keyClient.toString(),
        rfc: clientPublic.rfc,
        type: clientPublic.typeClient,
        clientId: clientPublic.id
      });
      let clientsMapped:ModeOfflineClients[] = clients.map(x=>{
        let item:ModeOfflineClients={
          clientName: x.name,
          keyClient: x.keyClient.toString(),
          rfc: x.rfc,
          type: x.typeClient,
          clientId: x.id
        }
        return item;
      });

      clientsMapped.push({
        clientName: clientPublic.name,
        keyClient: clientPublic.keyClient.toString(),
        rfc: clientPublic.rfc,
        type: clientPublic.typeClient,
        clientId: clientPublic.id
      });
      let getLastFolioByUser = await this.saleRepository.getLastFolioOfSeller(seller);
      console.log("Se obtuvo ultimo folio");
      let lastFolio=(getLastFolioByUser.replace(seller.cve,""));
      
      let inventory = await this.sellerInventoryRepository.getInventoryByProductStockOfSellerModeOffline(seller);
      console.log("Se obtuvo inventario");
      let inventoryOffline:ModeOfflineInventory[] = inventory.map(x=>{
        let itemInventoryOffline:ModeOfflineInventory={
          codeSae: x.key_sae,
          pieces: x.units,
          weight: x.weight,
          price: x.price,
          productName: x.name, 
          uniMed: x.uni_med,
          presentation: x.type_presentation,
          presentationId: x.presentation_id,
          productId: x.product_rovianda_id,
          weightOriginal: x.price_presentation_min 
        }
        return itemInventoryOffline;
      });
      let getSalesToday=await this.saleRepository.getSalleSellerByDateUser(seller.id,dateStr);
      console.log("Se obtuvieron ventas del dia");
      let debsAlreadyPayed = await this.debRepository.getDebtsBySellerId(seller.id,dateStr);
      let getSalesDebs=await this.saleRepository.getSalleSellerByDateUserDebts(seller.id);
      let salesDebtsAlreadyPayed=await this.saleRepository.getSalesBySalesIds(debsAlreadyPayed.map(x=>x.sale_id));
      console.log("Se obtuvieron deudas");
      let completed = getSalesToday;
      let debs = getSalesDebs;
      let salesOffline:ModeOfflineSaleInterface[] = [];
      if(completed.length){
      for(let x of completed){
        let subSales:SubSales[] = await this.subSalesRepository.getSubSalesBySale(x);
        let item:ModeOfflineSaleInterface={
          saleId: x.saleId,
          amount: x.amount,
          credit: x.credit,
          folio: x.folio,
          keyClient: x.client.keyClient.toString(),
          payed: x.payedWith,
          typeSale:x.typeSale,
          sellerId: seller.id,
          products: subSales.map(sub=>{
            let product:ModeOfflineProductInterface={
              price: sub.amount/sub.quantity,
              productKey: sub.presentation.keySae,
              quantity: sub.quantity,
              type: sub.presentation.uniMed,
              weightStandar: sub.presentation.presentationPriceMin,
              productName: sub.product.name,
              productPresentationType: sub.presentation.presentationType,
            };  
            return product;
          }),
          clientName: x.client.name,
          date:x.date,
          status: x.status,
          statusStr: x.statusStr
        };
        salesOffline.push(item);
      };
    }
      let debsOffline:ModeOfflineSaleInterface[] =[];
      if(debs.length){
      for(let x of debs){
        let subSales:SubSales[] = await this.subSalesRepository.getSubSalesBySale(x);
        let item:ModeOfflineSaleInterface={
          saleId:x.saleId,
          amount: x.amount,
          credit: x.credit,
          folio: x.folio,
          keyClient: x.client.keyClient.toString(),
          payed: x.payedWith,
          typeSale:x.typeSale,
          sellerId: seller.id,
          products: subSales.map(sub=>{
            let product:ModeOfflineProductInterface={
              price: sub.amount/sub.quantity,
              productKey: sub.presentation.keySae,
              quantity: sub.quantity,
              type: sub.presentation.uniMed,
              weightStandar: sub.presentation.presentationPriceMin,
              productName: sub.product.name,
              productPresentationType: sub.presentation.presentationType
            };  
            return product;
          }),
          clientName: x.client.name,
          date: x.date,
          status: x.status,
          statusStr: x.statusStr
        };
        debsOffline.push(item);
      }
    }
    if(salesDebtsAlreadyPayed.length){
      for(let x of salesDebtsAlreadyPayed){
        let subSales:SubSales[] = await this.subSalesRepository.getSubSalesBySale(x);
        let item:ModeOfflineSaleInterface={
          saleId:x.saleId,
          amount: x.amount,
          credit: x.credit,
          folio: x.folio,
          keyClient: x.client.keyClient.toString(),
          payed: x.payedWith,
          typeSale:x.typeSale,
          sellerId: seller.id,
          products: subSales.map(sub=>{
            let product:ModeOfflineProductInterface={
              price: sub.presentation.presentationPricePublic,
              productKey: sub.presentation.keySae,
              quantity: sub.quantity,
              type: sub.presentation.uniMed,
              weightStandar: sub.presentation.presentationPriceMin,
              productName: sub.product.name,
              productPresentationType: sub.presentation.presentationType
            };  
            return product;
          }),
          clientName: x.client.name,
          date: x.date,
          status: x.status,
          statusStr: x.statusStr
        };
        debsOffline.push(item);
      }
    }

      let modeOffline:ModeOffline ={
        limitOfSales: 300,
        sellerId: sellerId,
        cashAcumulated: +(status.totalSolded!=null?status.totalSolded.replace(",",""):"0"),
        weightAcumulated: +status.totalWeight,
        clients: clientsMapped,
        folioNomenclature: seller.cve,
        folioCount:lastFolio,
        lastSincronization: date.toString(),
        username: seller.name,
        logedId: true,
        inventory: inventoryOffline,
        sales: salesOffline,
        debts: debsOffline,
        clientsToVisit
      };
      return modeOffline;
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

    async getAcumulatedSales(from:string,to:string){
      return await this.salesRequestRepository.getAcumulatedByDate(from,to);
    }

    async sincronizeDataSeller(data:ModeOfflineRequestSincronization,sellerId:string){
      let seller:User =await this.userRepository.getUserById(sellerId);
        for(let sale of data.salesMaked){
            await this.saleRepository.createSimpleSale(sale,sellerId);
        }

      for(let deb of data.debts){
        if(!deb.status){
        let sale:Sale =await this.saleRepository.getSaleById(deb.saleId);
        if(sale){
          let debSale = await this.debRepository.getBySale(sale);
          if(!debSale){
          let date = new Date();
          date.setHours(date.getHours()-5);
          let newDeb:Debts = new Debts();
          newDeb.amount=sale.amount;
          newDeb.status=false;
          newDeb.days=8;
          newDeb.sale=sale;
          newDeb.seller=seller;
          newDeb.typePay=deb.typeSale;
          newDeb.createDay= date.toISOString();
          sale.status=false;
          await this.saleRepository.saveSale(sale);
          await this.debRepository.saveDebts(newDeb);
          }
        }
      }
      }

      for(let sale of data.sales){
        if(!sale.status || sale.statusStr=="CANCELED"){
          if(sale.saleId){
            let saleEntity = await this.saleRepository.getSaleById(sale.saleId);
            if(saleEntity){
              saleEntity.statusStr=sale.statusStr;
              saleEntity.status=sale.status;
              await this.saleRepository.saveSale(saleEntity);
            }
          }
        }
      }

    }


    async getTicketOfOrder(orderId:number){
      let orderSeller: OrderSeller = await this.saleSellerRepository.getOrderById(orderId);
      let subSales = await this.salesRequestRepository.getByOrderSeller(orderSeller);
      return await this.ticketUtil.getOrderTicket(orderSeller,subSales);
    }

    async sincronizeSingleSale(body:{sales:MOSRM[],debts:DebtsRequest[],devolutions:DevolutionSellerRequestBody[]},sellerId:string){
      console.log("Devolutions: "+body.devolutions);
      let seller:User=null;
      
      let salesSicronized:{salesSincronized:{saleId:number,folio:string}[],debtsSicronized:string[],devolutionsSincronized:string[],devolutionsAccepted:string[],devolutionsRejected:string[],devolutionsPending:string[]}={
        debtsSicronized:[],
        salesSincronized:[],
        devolutionsSincronized:[],
        devolutionsAccepted:[],
        devolutionsRejected:[],
        devolutionsPending:[]
      };
      let salesCanceled:string[] = [];
      let devolutionsCreated:number[]=[];
      for(let sale of body.sales){
        if(seller==null){
          seller = await this.userRepository.getUserById(sale.sellerId);
        }
        
        let saleEntity:Sale = await this.saleRepository.getByFolio(sale.folio);
        if(sale.statusStr=="CANCELED"){
          salesCanceled.push(sale.folio);
          sale.statusStr="ACTIVE";
          if(saleEntity){
          saleEntity.cancelRequest=true;
          }
        }
        if(!saleEntity){
          await this.saleRepository.createSimpleSale2(sale,sale.sellerId,salesCanceled);
          let saleAdded:Sale = await this.saleRepository.getByFolio(sale.folio);
          salesSicronized.salesSincronized.push({saleId:saleAdded.saleId,folio: saleAdded.folio});
        }else if(saleEntity && (salesCanceled.includes(sale.folio))){
          saleEntity.statusStr=sale.statusStr;
          saleEntity.status=sale.status;
          if(salesCanceled.includes(sale.folio)){
            saleEntity.cancelRequest=true;
          }
          salesSicronized.salesSincronized.push({saleId:saleEntity.saleId,folio: saleEntity.folio});
          await this.saleRepository.saveSale(saleEntity);
        }else if(saleEntity && sale.statusStr==saleEntity.statusStr){
          salesSicronized.salesSincronized.push({saleId:saleEntity.saleId,folio: saleEntity.folio});
        }
      }
      if(seller!=null && salesCanceled.length){
        for(let folio of salesCanceled){
          let sale = await this.saleCancelRepository.findCancelRequestByFolio(folio);
          if(!sale){
            let saleCancel = new SaleCancel();
            let createAtDate=new Date();
            createAtDate.setHours(createAtDate.getHours()-5);
            saleCancel.createAt=createAtDate.toISOString();
            saleCancel.folio=folio;
            saleCancel.seller = seller.id;
            await this.saleCancelRepository.saveCancelSale(saleCancel);
          }
        }
        
      }
      
      for(let deb of body.debts){
        console.log("Folio deuda: "+deb.folio);
        let sale = await this.saleRepository.getByFolio(deb.folio);
        let debts = await this.debRepository.getBySale(sale);
        if(!debts){
          
          let debt = new Debts();
          debt.amount=deb.amountPayed;
          debt.createDay=deb.datePayed;
          debt.days=0;
          debt.sale=sale;
          debt.status=false;
          debt.typePay=deb.payedType;
          debt.seller=sale.seller;
          ///await this.debRepository.saveDebts(debt);
          sale.status=false;
          sale.debts=[debt];
          await this.saleRepository.saveSale(sale);
          salesSicronized.debtsSicronized.push(deb.folio);
        }
      }

      if(body.devolutions && body.devolutions.length){
        
        for(let devolution of body.devolutions){
          salesSicronized.devolutionsSincronized.push(devolution.folio);
          let devolutionRequest:DevolutionSellerRequest=await this.devolutionRequestSellerRepository.getDevolutionSellerRequestByFolio(devolution.folio);
          if(!devolutionRequest){
            
            let sale:Sale = await this.saleRepository.getByFolio(devolution.folio);
            if(sale){
              let devolutionEntity:DevolutionSellerRequest =  new DevolutionSellerRequest();
              devolutionEntity.createAt=devolution.createAt;
              devolutionEntity.folio=devolution.folio;
              devolutionEntity.observations=devolution.observations;
              devolutionEntity.saleId=sale.saleId;
              devolutionEntity.sellerId=sale.seller.id;
              devolutionEntity.typeDevolution=devolution.typeDevolution;
              devolutionEntity.devolutionAppRequestId=devolution.devolutionId;
              devolutionEntity.viewed=false;
              devolutionEntity.status="PENDING";
              devolutionEntity= await this.devolutionRequestSellerRepository.saveDevolutionSellerRequest(devolutionEntity);
              devolutionsCreated.push(devolutionEntity.devolutionSellerRequestId);
              sale.devolutionRequest=true;
              await this.saleRepository.saveSale(sale);
              for(let oldProduct of devolution.productsOld){
                console.log(JSON.stringify(oldProduct));
                let product:DevolutionOldSubSales=new DevolutionOldSubSales();
                product.amount=oldProduct.amount;
                product.createAt=oldProduct.createAt;
                product.loteId="";
                product.presentationId=oldProduct.presentationId;
                product.productId=oldProduct.productId;
                product.quantity=oldProduct.quantity,
                product.saleId=sale.saleId;
                product.subSaleIdIdentifier=oldProduct.appSubSaleId;
                product.type="ORIGINAL";
                product.devolutionRequestId=devolution.devolutionId;
                await this.devolutionOldSubSalesRepository.saveDevolutionOldSubSales(product);
              }
              for(let newProduct of devolution.productsNew){
                console.log(JSON.stringify(newProduct));
                let product:DevolutionOldSubSales=new DevolutionOldSubSales();
                product.amount=newProduct.amount;
                product.createAt=newProduct.createAt;
                product.loteId="";
                product.presentationId=newProduct.presentationId;
                product.productId=newProduct.productId;
                product.quantity=newProduct.quantity,
                product.saleId=sale.saleId;
                product.subSaleIdIdentifier=newProduct.appSubSaleId;
                product.type="MODIFIED";
                product.devolutionRequestId=devolution.devolutionId;
                await this.devolutionOldSubSalesRepository.saveDevolutionOldSubSales(product);
              }
            }
            
          }
        }
      }

      let date = new Date();
      date.setHours(date.getHours()-5);
      let month = (date.getMonth()+1).toString();
      let day = date.getDate().toString();
      if(+month<10) month="0"+month;
      if(+day<10) day="0"+day;
      let devolutionsOfDateBySeller = await this.devolutionRequestSellerRepository.getAllDevolutionsOfSellerAndDate(sellerId,`${date.getFullYear()}-${month}-${day}`);
      for(let devolution of devolutionsOfDateBySeller){
        if(devolution.status=="DECLINED"){
          salesSicronized.devolutionsRejected.push(devolution.folio);
        }else if(devolution.status=="ACCEPTED"){
          salesSicronized.devolutionsAccepted.push(devolution.folio);
        }else if(devolution.status=="PENDING"){
          salesSicronized.devolutionsPending.push(devolution.folio);
        }
      }
      if(salesCanceled.length || devolutionsCreated.length){
          await this.firebaseHelper.notificateToAdminSales();
      }

      return salesSicronized;
    }

    async getRequestDevolutionDetails(saleId:number){
      let sale = await this.saleRepository.getSaleById(saleId);
      let devolutionRequest = await this.devolutionRequestSellerRepository.getDevolutionAcceptedSellerRequestByFolio(sale.folio);
      if(!devolutionRequest) throw new Error("[404], No se encuentra la  solicitud de devolucion");
      let adminAccepted:string="";
      let sellerName:string= "";
      let seller = await this.userRepository.getUserById(devolutionRequest.sellerId);
      sellerName=seller.name;
      if(devolutionRequest.status!="PENDING"){
        let user = await this.userRepository.getUserById(devolutionRequest.adminId);
        adminAccepted=user.name; 
      }
      
      let devolutionSubSalesModified = await this.devolutionOldSubSalesRepository.getByDevolutionRequestIdAndTypeToTicket(devolutionRequest.devolutionAppRequestId,"MODIFIED");
      let devolutionSubSalesOriginal = await this.devolutionOldSubSalesRepository.getByDevolutionRequestIdAndTypeToTicket(devolutionRequest.devolutionAppRequestId,"ORIGINAL");
      let mapProductOriginal:Map<string,number> = new Map();
      let mapProductOriginalPrice:Map<string,number> = new Map();
      for(let dev of devolutionSubSalesOriginal){
        mapProductOriginal.set(dev.name+" "+dev.presentation,dev.quantity);
        mapProductOriginalPrice.set(dev.name+" "+dev.presentation,(dev.amount/dev.quantity));
      }
      let devolutionProducts:ProductDevolution[]=[];
      for(let dev2 of devolutionSubSalesModified){
        devolutionProducts.push({
          productName: dev2.name+" "+dev2.presentation,
          quantity: (mapProductOriginal.get(dev2.name+" "+dev2.presentation)-dev2.quantity),
          price: mapProductOriginalPrice.get(dev2.name+" "+dev2.presentation)*dev2.quantity,
          uniMed: dev2.uniMed
        });
      }
      let ticket:string = await this.ticketUtil.DevolutionTicketSale(sale,devolutionSubSalesOriginal);
      let ticketModified:string = await this.ticketUtil.DevolutionTicketSale(sale,devolutionSubSalesModified);
      
      let response:RequestDevolution={
        adminAccepted,
        folio:sale.folio,
        sellerName,
        dateRequest: devolutionRequest.createAt,
        dateSale: sale.date,
        dateAttended: devolutionRequest.dateAttended,
        observations: devolutionRequest.observations,
        saleId: sale.saleId,
        status: devolutionRequest.status,
        originalTicket: ticket,
        modifiedTicket: ticketModified,
        devolutionProducts
      };
      return response;
    }

  }

  











