import { SalesRequestRepository } from '../Repositories/SalesRequest.Repostitory';
import { SubOrder } from '../Models/Entity/SubOrder.Sale.Seller';

import { OrderSellerRequest } from '../Models/DTO/Sales.ProductDTO';
import { User } from '../Models/Entity/User';
import { UserRepository } from '../Repositories/User.Repository';

import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';

import { PresentationsProductsRepository } from '../Repositories/Presentation.Products.Repository';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { SalesSellerRepository } from '../Repositories/SaleSeller.Repository';
import {validateOrderSeller} from "../Utils/Validators/OrderSellerValidator";
import {PackagingRepository} from "../Repositories/Packaging.Repository";
import {SellerInventoryRepository} from "../Repositories/Seller.Inventory.Repository";
import { ClientsBySeller, ClientDTO } from '../Models/DTO/Client.DTO';
import { ClientRepository } from '../Repositories/Client.Repository';
import { DebtsRepository } from '../Repositories/Debts.Repository';
import { SellerOperation } from '../Models/Entity/Seller.Operations';
import { SellerOperationRepository } from '../Repositories/Seller.Operation.Repository';
import { SellerOperationDTO } from '../Models/DTO/SellerOperationDTO';
import { RelationCount } from 'typeorm';
import { Sale } from '../Models/Entity/Sales';
import { SaleRepository } from '../Repositories/Sale.Repository';
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
    constructor(){
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
    }
    
    async saveOrderSeller(uid:string,request:OrderSellerRequest){
        await validateOrderSeller(request);
        let user:User = await this.userRepository.getUserbyIdWithRol(uid);
        if(!user) throw new Error("[400], Usuario no existe en el sistema");
        if(user.roles.description!="SALESUSER ") throw new Error("[403], Usuario no autorizado");
        //let properties:PackagingProperties[] = await this.packagingRepository.getPackagingWithProperties(request.products);
        let order:OrderSeller = new OrderSeller();
        order.date = request.date;
        order.status=true;
        order.urgent=request.urgent;
        order.user=user;
        
        let subOrderArr:Array<SubOrder> = new Array<SubOrder>();
        for(let suborder of request.products){
          let subOrder:SubOrder = new SubOrder();
          subOrder.units= suborder.quantity;
          subOrder.product = await this.productRoviandaRepository.getById(suborder.productId);;
          subOrder.presentation = await this.presentationProductsRepository.getPresentatiosProductsById(suborder.presentationId);
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
      return await this.packagingRepository.getPackagingAvailableProduct(productId);
    }

    async getSellerInventoryProductPresentation(sellerUid:string,productId:number){
      return await this.sellerInventoryRepository.getSellerInventoryProductPresentation(sellerUid,productId);
    }

    async getClientsOfSeller(sellerUid:string):Promise<ClientDTO[]>{
      let clients:Array<ClientsBySeller> = await this.clientRepository.getClientBySeller(sellerUid);
      
      return clients.map((client:ClientsBySeller)=>{
        let date = new Date();
        date.setHours(date.getHours()+6);
        let dateRecord = new Date(client.createDay);
        dateRecord.setHours(dateRecord.getHours()+6);
        console.log("DATE",date);
        console.log("DATERECORDS",dateRecord);
        let clientMapped:ClientDTO={
          amount: client.amount,
          clientId: client.clientId,
          clientName: client.clientName,
          daysPending: this.dateDiffInDays(date,dateRecord),
          debId: client.debId
        };
        return clientMapped;
      })
    }

    async payDeb(debId:number){
      await this.debRepository.payDeb(debId);
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
      return await this.sellerOperationRepository.saveSellerOperation(sellerOperation);
    }

    async updateHourSellerOperation(sellerUid:number){
      if(!sellerUid) throw new Error("[400], sellerUid is required");
      let sellerOperation:SellerOperation = await this.sellerOperationRepository.getSellerOperationById(sellerUid);
      if(!sellerOperation) throw new Error("[404], sellerOperation not found");
      let date = new Date();
      let horas = 6;
      let newHour = (date.setHours(date.getHours() + horas) && date.getHours()) + ":" + date.getMinutes();
      sellerOperation.eatingTimeEnd = newHour;
      return await this.sellerOperationRepository.saveSellerOperation(sellerOperation);
    }

    async timesMovents(sellerUid:string){
      if(!sellerUid) throw new Error("[400], sellerUid is required");
      let user:User = await this.userRepository.getUserById(sellerUid);
      if(!user) throw new Error("[404], sellerUid not found");
      let today = new Date();
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


  }

  











