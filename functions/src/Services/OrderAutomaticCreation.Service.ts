
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
        let items:OrderAutomaticDTO[]= await this.orderSellerRepository.getOrdersForPreSales(dateToSearch);
        let currentSellerId="";
        let orderSellers:OrderSeller[]=[];
        let subOrders:SubOrder[]=[];
        let orderSeller:OrderSeller = null;
        for(let item of items){
            if(currentSellerId!=item.id){
                if(currentSellerId!=""){
                    let seller:User = await this.userRepository.getUserById(currentSellerId);
                    orderSeller.subOrders=subOrders;
                    orderSeller.date=this.getDateStr()+"T00:00:00.000Z"
                    orderSeller.seller=seller;
                    orderSeller.sincronized=false;
                    orderSeller.status="ACTIVE";
                    orderSeller.urgent=false;
                    orderSeller.subOrders=subOrders;
                    orderSellers.push(orderSeller);
                    orderSeller=new OrderSeller();
                    subOrders=[];
                    currentSellerId=item.id;
                }else{
                    orderSeller=  new OrderSeller();
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
            subOrders.push(subOrder);
        }
        if(orderSellers.length>0){
            let seller:User = await this.userRepository.getUserById(currentSellerId);
            orderSeller.subOrders=subOrders;
            orderSeller.date=this.getDateStr()+"T00:00:00.000Z"
            orderSeller.seller=seller;
            orderSeller.sincronized=false;
            orderSeller.status="ACTIVE";
            orderSeller.urgent=false;
            orderSeller.subOrders=subOrders;
            orderSellers.push(orderSeller);
        }
        for(let orderSeller of orderSellers){
            await this.orderSellerRepository.saveSalesSeller(orderSeller);
        }
    }

    getDateStr(){
        let date = new Date();
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