
import { OrderAutomaticDTO } from "../Models/DTO/OrderAutomaticItemDTO";
import { OrderSeller } from "../Models/Entity/Order.Seller";
import { SubOrder } from "../Models/Entity/SubOrder.Sale.Seller";
import { User } from "../Models/Entity/User";
import { PresentationsProductsRepository } from "../Repositories/Presentation.Products.Repository";
import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { SalesSellerRepository } from "../Repositories/SaleSeller.Repository";
import { UserRepository } from "../Repositories/User.Repository";

export class OrderAutomaticCreationService{
    private orderSellerRepository:SalesSellerRepository;
    private presentationRepository:PresentationsProductsRepository;
    private productRepository:ProductRoviandaRepository;
    private userRepository:UserRepository;
    constructor(){
        this.orderSellerRepository = new SalesSellerRepository();
        this.presentationRepository = new PresentationsProductsRepository();
        this.productRepository = new ProductRoviandaRepository();
        this.userRepository = new UserRepository();
    }

    async checkForOrders(){
        let dateToSearch =this.getDateStr();
        console.log("Fecha a sincronizar: "+dateToSearch);
        let items:OrderAutomaticDTO[]= await this.orderSellerRepository.getOrdersForPreSales("2023-09-26");
        console.log("items: "+items);
        let currentSellerId="";
        let orderSeller:OrderSeller = null;
        for(let item of items){
            if(currentSellerId!=item.id){
                if(currentSellerId!=""){
                    await this.orderSellerRepository.saveSalesSeller(orderSeller);
                    orderSeller=  new OrderSeller();
                    orderSeller.indexNoDuplicate=dateToSearch+"-"+item.id;
                    orderSeller.subOrders=[];
                    currentSellerId=item.id;
                    let seller:User = await this.userRepository.getUserById(currentSellerId);
                    orderSeller.date=dateToSearch+"T00:00:00.000Z"
                    orderSeller.seller=seller;
                    orderSeller.sincronized=false;
                    orderSeller.status="ACTIVE";
                    orderSeller.urgent=false;

                }else{
                    currentSellerId=item.id;
                    orderSeller=  new OrderSeller();
                    orderSeller.indexNoDuplicate=dateToSearch+"-"+item.id;
                    orderSeller.subOrders=[];
                    let seller:User = await this.userRepository.getUserById(currentSellerId);
                    orderSeller.date=dateToSearch+"T00:00:00.000Z"
                    orderSeller.seller=seller;
                    orderSeller.sincronized=false;
                    orderSeller.status="ACTIVE";
                    orderSeller.urgent=false;
                }
                
            }
            let subOrder:SubOrder = new SubOrder();
            subOrder.active=true;
            subOrder.observations="";
            subOrder.weight=0;
            subOrder.typePrice="PUBLIC";
            subOrder.units=item.quantity;
            subOrder.orderSeller=orderSeller;
            subOrder.outOfStock=false;
            let presentation = await this.presentationRepository.getPresentationProductsById(item.presentationId);
            subOrder.presentation=presentation;
            let product = await this.productRepository.getProductRoviandaById(item.productId);
            subOrder.productRovianda=product;
            orderSeller.subOrders.push(subOrder);
        }
        if(orderSeller.subOrders.length>0) {
            await this.orderSellerRepository.saveSalesSeller(orderSeller);
        }
       
    }

    getDateStr(){
        let date = new Date();
        console.log("Hora: "+date.getHours());
         date.setHours(date.getHours()-6);
         date.setDate(date.getDate()+1);
        let monthStr =(date.getMonth()+1).toString();
        let dayStr= date.getDate().toString();
        if(+monthStr<10){
            monthStr="0"+monthStr;
        }
        if(+dayStr<10){
            dayStr="0"+dayStr;
        }
        
        return date.getFullYear()+"-"+monthStr+"-"+dayStr;
    }
}