import { SalesRequestRepository } from '../Repositories/SalesRequest.Repostitory';
import { SubOrder } from '../Models/Entity/SubOrder.Sale.Seller';

import { OrderSellerRequest, SaleRequestForm } from '../Models/DTO/Sales.ProductDTO';
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
import { times } from 'lodash';
import { SubSaleRepository } from '../Repositories/SubSale.Repository';
import { SubSales } from '../Models/Entity/Sub.Sales';
import { SqlSRepository } from '../Repositories/SqlS.Repositoy';
import { UserDTO } from '../Models/DTO/UserDTO';
import { Roles } from '../Models/Entity/Roles';
import { RolesRepository } from '../Repositories/Roles.Repository';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Presentation } from '../Models/DTO/Presentations.DTO';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { Debts } from '../Models/Entity/Debts';
import { Client } from '../Models/Entity/Client';
import { DebtsPaymentRequest } from '../Models/DTO/Debts.DTO';
import { TicketUtil } from '../Utils/Tickets/Ticket.Util';
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
    }
    
    async saveOrderSeller(uid:string,request:OrderSellerRequest){
        await validateOrderSeller(request);
        let user:User = await this.userRepository.getUserbyIdWithRol(uid);
        if(!user) throw new Error("[400], Usuario no existe en el sistema");
        console.log("ROL: ",user.roles.description);
        if(user.roles.description!="SALESUSER") throw new Error("[403], Usuario no autorizado");
        //let properties:PackagingProperties[] = await this.packagingRepository.getPackagingWithProperties(request.products);
        let order:OrderSeller = new OrderSeller();
        order.date = request.date;
        order.status="ACTIVE";
        order.urgent=request.urgent;
        order.seller=user;
        
        let subOrderArr:Array<SubOrder> = new Array<SubOrder>();
        for(let suborder of request.products){
          let product = await this.productRoviandaRepository.getById(suborder.productId);
          if(!product) throw new Error(`[404], el producto con el id = '${suborder.productId}' no existe`);
          let presentation = await this.presentationProductsRepository.getPresentationProductsById(suborder.presentationId);
          if(!presentation) throw new Error(`[404], la presentacion con el id = '${suborder.presentationId}' no existe`);
          let subOrder:SubOrder = new SubOrder();
          subOrder.units= suborder.quantity;
          subOrder.productRovianda = product;
          subOrder.presentation = presentation;
          subOrder.typePrice=presentation.typePrice;
          subOrder.active=true;
          subOrderArr.push(subOrder);
        }
        order.subOrders = subOrderArr;
        
        await this.saleSellerRepository.saveSalesSeller(order);
    }

    async getOrdersBySeller(uid:string){
        return await this.saleSellerRepository.getOrders(uid);
    }

    async getProductsOfOrderSeller(orderId:number){
        return await this.salesRequestRepository.getProductsOfOrder(orderId);
    }

    async getPresentationsOfProductOfOrder(orderId:number,productId:number){
        // let order:OrderSeller = await this.saleSellerRepository.getOrderById(orderId);
        // if(!order) throw new Error("[404], la orden no existe");
        // let product:ProductRovianda = await this.productRoviandaRepository.getById(productId);
        // if(!product) throw new Error("[404], el producto de rovianda no existe");
        return await this.salesRequestRepository.getPresentationOfProductOfOrder(orderId,productId);
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
        let claveEsq = +productSae[0].CVE_ESQIMPU;
      switch(claveEsq){
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
      }
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
        let claveEsq = +productSae[0].CVE_ESQIMPU;
      switch(claveEsq){
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
      }
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
            response.push( {
              clientName:client.name,
              debId:debt.debId,
              date: debt.createDay,
              dayRest: debt.days,
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

    async saveSellerOperation(sellerOperationDTO:SellerOperationDTO){
      if(!sellerOperationDTO.date) throw new Error("[400], date is required");
      if(!sellerOperationDTO.sellerUid) throw new Error("[400], date is required");
      if(!sellerOperationDTO.timeStart) throw new Error("[400], date is required");
      let user:User = await this.userRepository.getUserById(sellerOperationDTO.sellerUid);
      if(!user) throw new Error("[404], user not found");
      let sellerOperation:SellerOperation = new SellerOperation();
      sellerOperation.date = sellerOperationDTO.date;
      sellerOperation.eatingTimeStart = sellerOperationDTO.timeStart;
      sellerOperation.seller = user;
      await this.sellerOperationRepository.saveSellerOperation(sellerOperation);
    }

    async updateHourSellerOperation(sellerUid:string){
      let sellerOperationEntity:Array<{sellerOperationId:number}> = await this.sellerOperationRepository.getLastSellerOperation(sellerUid);
      if(!sellerOperationEntity.length) throw new Error("[409], no existe una actividad de comida actualmente");
      let date = new Date();
      date.setHours(date.getHours()-6)
      let newHour = date.getHours() + ":" + date.getMinutes();
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
        return await this.clientRepository.getAllClientBySeller(seller);
        }else{
          return await this.clientRepository.getAllClientBySellerAndHint(seller,hint);
        }
     }

     async createSeller(userDTO:UserDTO){
        let rol:Roles = await this.rolesRepository.getRoleById(userDTO.rolId);
        let user:User= new User();
        user.name = userDTO.name +" "+ userDTO.firstName+" "+userDTO.lastName;
        user.email = userDTO.email;
        user.job = userDTO.job;
        user.roles = rol;
        user.saeKey = userDTO.clave;
        await this.firebaseHelper.createUser(userDTO).then(async(userRecord)=>{
          user.id= userRecord.uid;
          await this.userRepository.saveUser(user);
          return await this.sqlsRepository.createSeller(userDTO);
        });        
     }
    
    async createSaleSae(saleRequestForm:SaleRequestForm){
      console.log("iniciando creacin de venta");
      let seller:User = await this.userRepository.getUserById(saleRequestForm.sellerId);
      console.log("obteniendo vendedor");
      let alreadyActive = await this.sqlsRepository.getSellerActive(seller.saeKey);
      console.log("obteniendo vendedor de sae");
      if(!alreadyActive.recordset.length) throw new Error("[409], el vendedor no esta activo en SAE");
      let client = await this.sqlsRepository.getClientsByKey(saleRequestForm.keyClient);
      let clientRovianda = await this.clientRepository.findByClientKey(saleRequestForm.keyClient);

      console.log("obteniendo cliente de sae");
      if(!client.recordset.length) throw new Error("[404], no existe el cliente en SAE");
      let clientSAE:ClientSAE = client.recordset[0] as ClientSAE;
      console.log("iniciando recorrido de articulos");
      let saleGral = new Sale();
      saleGral.client = clientRovianda;
      saleGral.seller=seller;
      let date = new Date();
      date.setHours(date.getHours()-6);
      saleGral.date = date.toISOString();
      saleGral.hour = `${date.getHours()}:${date.getMinutes()}`;
      saleGral.subSales = new Array<SubSales>();
      if(saleRequestForm.credit){
        saleGral.credit = saleRequestForm.credit;
      }
      for(let sale of saleRequestForm.products){
       let subSale:SubSales = new SubSales();
       let presentation:PresentationProducts = await this.presentationProductsRepository.getPresentationProductsById(sale.presentationId);
       subSale.presentation = presentation;
       subSale.product = presentation.productRovianda;
       subSale.quantity=sale.quantity;
       
       let exist = await this.sqlsRepository.getProductExist(+presentation.productRovianda.code,sale.quantity);
       console.log("buscando existencia en stock");
       if(!presentation) throw new Error("[404], no existe la presentacion del producto en el sistema rovianda");
       let productSae = await this.sqlsRepository.getProductSaeByKey(presentation.productRovianda.code);
       console.log("buscando producto en sae");
       if(!exist.length) throw new Error("[404], no existe el producto o no hay stock completo acorde a la orden");
        sale.taxSchema = productSae[0].CVE_ESQIMPU;
        sale.warehouseKey = exist[0].EXISTENCIA;
        let price =0;
        if(presentation.typePrice=="PUBLICO"){
          price = presentation.presentationPricePublic;
        }else if(presentation.typePrice=="MIN"){
          price = presentation.presentationPriceMin;
        }else if(presentation.typePrice=="LIQUIDATION"){
          price = presentation.presentationPriceLiquidation;
        }
        let claveEsq = +productSae[0].CVE_ESQIMPU;
        switch(claveEsq){
          case 1:
            price +=(price*.16);
            break;
            case 2: // sin IVA operaciones no necesarias
              break;
              case 3: // IVA EXCENTO
                break;
                case 4: // 16 IVA mas 8% de IEPS
                price += (price*.16);
                price += (price*.08)
                  
                  break;
                  case 5:// 16 IVA mas 25% de IEPS
                  
                  price += (price*.16);
                  price += (price*.25)
                    break;
                    case 6:// 16 IVA mas 50% de IEPS
                    price += (price*.16);
                    price += (price*.50)
                      break;
        }
        sale.price= price;
        
        sale.total = price*sale.quantity;

        subSale.amount = sale.total;
        subSale.loteId="desconocido";
        saleGral.subSales.push(subSale);
     }
     saleGral.amount = saleGral.subSales.map(x=>x.amount).reduce((a,b)=>a+b,0);
     if(saleRequestForm.payed<saleGral.amount){
        saleGral.debts= new Array<Debts>();
       let debs:Debts = new Debts();
       debs.amount=saleGral.amount-saleRequestForm.payed;
       let date=new Date();
        date.setHours(date.getHours()-6)
        debs.createDay= date.toISOString();
        debs.days=saleRequestForm.days;
        debs.status=true;
        debs.seller=seller;
        saleGral.debts.push(debs);
      clientRovianda.hasDebts=true;
      saleGral.status=true;
      await this.clientRepository.saveClient(clientRovianda);
     }else{
       saleGral.status=false;
     }
     let folio = await this.sqlsRepository.createSaleSae(saleRequestForm,seller.saeKey,clientSAE);
     saleGral.folio=folio;
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
        return {count:(+result[0].CVE_VEND)+1}
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
      
      let subSales = await this.subSalesRepository.getSubSalesBySale(sale);
      let ticket:string = await this.ticketUtil.TicketSale(sale,subSales);
      
      return ticket;
    }

    async endDaySeller(sellerUid:string,date:string){
      let user:User = await this.userRepository.getUserById(sellerUid);
      if(!user) throw new Error("[404], vendedor no existe la venta");
      
      let dateParsed=new Date(date);
      dateParsed.setHours(dateParsed.getHours()-6);
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
      let tickets:string[]=[];
      for(let sale of sales){
        let subSales = await this.subSalesRepository.getSubSalesBySale(sale);
        tickets.push(await this.ticketUtil.TicketSale(sale,subSales,user));
      }
      return tickets;
    }
  }

  











