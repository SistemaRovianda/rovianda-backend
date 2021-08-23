import {request, Request,response,Response} from 'express';
import { SalesRequestService } from '../Services/Sales.Request.Service';

import { ProductRoviandaService } from '../Services/Product.Rovianda.Service';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Sale } from '../Models/Entity/Sales';
import { RequestDevolution, SalesToSuperAdmin } from '../Models/DTO/Sales.ProductDTO';
import PdfHelper from '../Utils/Pdf.Helper';
import * as pdf from 'html-pdf';
import { User } from '../Models/Entity/User';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { ModeOffline, ModeOfflineRequestSincronization, MOSRM } from '../Models/DTO/ModeOfflineDTO';

export class SalesRequestController{

   
    private salesRequestService: SalesRequestService;
    private productRoviandaService:ProductRoviandaService;
    private pdfHelper:PdfHelper;
    constructor(firebaseHelper:FirebaseHelper){
        this.salesRequestService = new SalesRequestService(firebaseHelper);
        this.productRoviandaService = new ProductRoviandaService(firebaseHelper);
        
    }
    
    async createSeller(req:Request,res:Response){
        await this.salesRequestService.createSeller(req.body);
        
        return res.status(201).send();
    }

    async getAllSalesOfDayOfSeller(req:Request,res:Response){
        let sellerUid:string = req.params.sellerUid;
        let date = req.query.date;
        let sales:Sale[]= await this.salesRequestService.getAllSalesBySellerAndDate(sellerUid,date);
        return res.status(200).send(sales);
    }

    async cancelSale(req:Request,res:Response){
        let saleId:number = +req.params.saleId;
        await this.salesRequestService.cancelSale(saleId);
        return res.status(204).send();
    }

    async saveOrderSeller(req:Request,res:Response){
        let uid = req.params.sellerUid;//req.headers.uid as string;
        if(!uid.length){
            throw new Error("[403],Error en las credenciales del request");
        }
        await this.salesRequestService.saveOrderSeller(uid,req.body);
        return res.status(201).send();
    }

    async getOrdersOfSeller(req:Request,res:Response){
        let uid = req.params.sellerUid;//req.headers.uid as string;
        if(!uid.length){
            throw new Error("[403],Error en las credenciales del request");
        }

        return res.status(200).send(await this.salesRequestService.getOrdersBySeller(uid));
    }

    async getProductOfOrderSeller(req:Request,res:Response){
        let orderId:number = +req.params.orderId;
        let mode=req.query.mode;
        return res.status(200).send(await this.salesRequestService.getProductsOfOrderSeller(orderId,mode));
    }

    async getPresentationsOfProductOfOrderSeller(req:Request,res:Response){
        let orderId:number = +req.params.orderId;
        if(orderId<1) throw new Error("[400], el valor de la orden debe ser mayor a cero");
        return res.status(200).send(await this.salesRequestService.getPresentationsOfProductOfOrder(orderId));
    }
    async getPresentationsOfProductOfOrderSellerApp(req:Request,res:Response){
        let orderId:number = +req.params.orderId;
        let productId:number = +req.params.productId;
        if(orderId<1) throw new Error("[400], el valor de la orden debe ser mayor a cero");
        return res.status(200).send(await this.salesRequestService.getPresentationsOfProductOfOrderApp(orderId,productId));
    }

    async getSellerPackagingInventory(req:Request,res:Response){
        return res.status(200).send(await this.salesRequestService.getRoviandaInventory());
    }

    async getSellerPackagingInventoryProduct(req:Request,res:Response){
        let productId:number = +req.params.productId;
        return res.status(200).send(await this.salesRequestService.getRoviandaInventoryProduct(productId));
    }

    async getSellerInventory(req:Request,res:Response){
        let sellerUid = req.params.sellerUid;
        return res.status(200).send(await this.salesRequestService.getSellerInventory(sellerUid));
    }

    async getSellerInventoryProduct(req:Request,res:Response){
        let sellerUid:string =req.params.sellerUid;
        let productId:number = +req.params.productId;
        return res.status(200).send(await this.salesRequestService.getSellerInventoryProductPresentation(sellerUid,productId));
    }

    async getClientPending(req:Request,res:Response){
        let sellerUid:string = req.params.sellerUid;
        return res.status(200).send(await this.salesRequestService.getClientsOfSeller(sellerUid));
    }

    async payDebPending(req:Request,res:Response){
        let debId:number = +req.params.debId;
        await this.salesRequestService.payDeb(debId,req.body);
        return res.status(204).send();
    }

    async saveSellerOperation(req:Request,res:Response){
        await this.salesRequestService.saveSellerOperation(req.body);
        return res.status(201).send();
    }

    async updateHourSellerOperation(req:Request,res:Response){
        await this.salesRequestService.updateHourSellerOperation(req.params.sellerUid);
        return res.status(204).send();
    }

    async timesMovents(req:Request,res:Response){
        let response = await this.salesRequestService.timesMovents(req.params.sellerUid);
        return res.status(200).send(response);
    }

    async saleClient(req:Request,res:Response){
        let response = await this.salesRequestService.saleClient(req.params.sellerUid,+req.params.saleId);
        return res.status(200).send(response);
    }
    
    async reportSales(req:Request,res:Response){
        let response = await this.salesRequestService.reportSales(req.params.sellerUid);
        return res.status(200).send(response);
    }

    
    async getSalesRequest(req:Request, res:Response){ 
             
        let ordersRequest = await this.salesRequestService.getOrdersSellers(); 
        return res.status(200).send(ordersRequest);
    }

    async getSellerGuard(req:Request,res:Response){
        return res.status(200).send(await this.salesRequestService.getSellerGuards(req.params.sellerUid));
    }

    async getAllClients(req:Request,res:Response){
        let sellerUid:string = req.params.sellerUid;
        let hint:number = !req.query.hint?0:+req.query.hint;
        return res.status(200).send(await this.salesRequestService.getAllSellerClientsBySellerUid(sellerUid,hint));
    }

    async getAllProductRoviandaCatalog(req:Request,res:Response){
        return res.status(200).send(await this.productRoviandaService.getAllproductsRoviandaCatalog());
    }

    async getAllProductRoviandaCatalogPresentation(req:Request,res:Response){
        let productId:number = +req.params.productId;
        return res.status(200).send(await this.productRoviandaService.getProductsPresentation(productId));
    }
    
    async createSaleSae(req:Request,res:Response){
        let sale:Sale =await this.salesRequestService.createSaleSae(req.body);
        return res.status(200).send({saleId:sale.saleId});
    }

    async getAllTaxScheme(req:Request,res:Response){
        let result = await this.salesRequestService.getAllTaxSchemas();
        return res.status(200).send(result);
    }

    async getSellerCountKey(req:Request,res:Response){
        return res.status(200).send(await this.salesRequestService.getSellerCount());
    }

    async getTaxSchema(req:Request,res:Response){
        return res.status(200).send(await this.salesRequestService.getAllTaxSchemas());
    }

    async getClientDebts(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        return res.status(200).send(await this.salesRequestService.getDebtsOfClient(clientId));
    }

    async getSaleTicket(req:Request,res:Response){
        let saleId:number = +req.params.saleId;
        return res.status(200).send(await this.salesRequestService.getTicketOfSale(saleId));
    }

    async getSingleTicket(req:Request,res:Response){
        let saleId:number = +req.params.saleId;
        return res.status(200).send(await this.salesRequestService.getSingleTicketOfSale(saleId));
    }

    async endDaySeller(req:Request,res:Response){
        let sellerUid=req.params.sellerUid;
        let date=req.query.date;
        return res.status(200).send(await this.salesRequestService.endDaySeller(sellerUid,date));
    }

    async getAllSalesSuperadmin(req:Request,res:Response){
        let page=req.query.page;
        let peerPage=req.query.peerPage;
        let salesIds=req.body.sales;
        let date=req.query.date;
        let hint = req.query.hint;
        let dateTo=req.query.dateTo;
        let response:SalesToSuperAdmin = await this.salesRequestService.getAllSalesForSuperAdmin(page,peerPage,salesIds,date,hint,dateTo);
        res.header('Access-Control-Expose-Headers','x-total-count');
        res.setHeader('x-total-count',response.totalCount);
        return res.status(200).send(response.sales);
    }

    async delSalesBySuperAdmin(req:Request,res:Response){
        let salesIds:Array<number>=req.body;
        let date:string = req.query.date;
        await this.salesRequestService.deleteSalesBySuperAdmin(salesIds,date);
        return res.status(204).send();
    }

    async ticketDebSeller(req:Request,res:Response){
        return res.status(200).send("MUCHO TEXTO");
    }

    async getDelSalesBySuperAdmin(req:Request,res:Response){
        let date:string = req.query.date;
        let report:string = await this.salesRequestService.getDelSalesReport(date);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "1cm", 
                right: "1cm",
                bottom: "1cm",
                left: "1cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=deleted.pdf`
            });
            stream.pipe(res);
        }));
    }

    async tranfersSalesToSaes(req:Request,res:Response){
        let saleId:number = +req.query.saleId;
        await this.salesRequestService.transferAllSalesAutorized();
        res.status(204).send();
    }

    async getProductByKeyToSale(req:Request,res:Response){
        let sellerUid:string = req.params.sellerUid;
        // if(isNaN(+req.params.key)){
        //     throw new Error("[404], la clave del producto debe ser un numero");
        // }
        let productKey:string = req.params.key;
        
        let product = await this.salesRequestService.findProduct(sellerUid,productKey);
        res.status(200).send(product);
    }

    async getCurrentTime(req:Request,res:Response){
        let uid=req.params.sellerUid;
        
        let response:{hours:number,minutes:number,seconds:number} = await this.salesRequestService.getCurrentTime(uid);
        return res.status(200).send(response);
    }

    async getProductsInfoOfInventStock(req:Request,res:Response){
        let key:string = req.params.key;
        let response = await this.salesRequestService.findProductInve(key);
        return res.status(200).send(response);
    }

    async getListOfSellers(req:Request,res:Response){
        let sellers: User[] = await this.salesRequestService.getAllSellers();
        return res.status(200).send(sellers);
    }

    async getResguardedOfSeller(req:Request,res:Response){
        let uid = req.params.sellerUid;
        let response:string =await this.salesRequestService.getResguardedTicket(uid);
        return res.status(200).send(response);
    }

    async getDetailsOfOrderSeller(req:Request,res:Response){
        let orderId:number = +req.params.orderId;
        let orderDetails = await this.salesRequestService.getOrderDetails(orderId);
        return res.status(200).send(orderDetails);
    }

    async updateDetailsOfOrderSeller(req:Request,res:Response){
        let orderId:number = +req.params.orderId;
        await this.salesRequestService.deleteOrderDetails(req.body,orderId);
        return res.status(204).send();
    }

    async getDebtsOfClientsOfSeller(req:Request,res:Response){
        let sellerId:string = req.params.sellerId;
        let sales = await this.salesRequestService.getAllDebtsOfSeller(sellerId);
        return res.status(200).send(sales);
    }
    async payDebtsOfClientsOfSeller(req:Request,res:Response){
        let saleId:number = +req.params.saleId;
        await this.salesRequestService.paySalePending(saleId,req.body);
        return res.status(200).send();
    }

    async getStatusSale(req:Request,res:Response){
        let sellerId = req.params.sellerId;
        if(!req.query.from) throw new Error("[400], falta el parametro from");
        let from = (req.query.from as string);
        if(!req.query.to) throw new Error("[400], falta el parametro to");
        let to = (req.query.to as string);
        let response=await this.salesRequestService.getStatusSale(sellerId,from,to);
        return res.status(200).send(response);
    }

    async initTransfer(req:Request,res:Response){
        console.log("Inicializando demonio");
         this.salesRequestService.transferAllSalesAutorized();
         
        return res.status(201).send();
    }

    async getStatusStockOffline(req:Request,res:Response){
        let sellerId:string = req.params.sellerId;
        let date:string = req.query.date;
        let modeOffline:ModeOffline = await this.salesRequestService.getModeOffline(sellerId,date);
        return res.status(200).send(modeOffline);
    }

    async getAcumulatedSales(req:Request,res:Response){
        let dateFrom = req.query.dateFrom;
        let dateTo = req.query.dateTo;
        let response = await this.salesRequestService.getAcumulatedSales(dateFrom,dateTo);
        return res.status(200).send(response);
    }

    async sincronizeModeOffline(req:Request,res:Response){
        let sellerId:string = req.params.sellerId;
        let MoR:ModeOfflineRequestSincronization= req.body;
        await this.salesRequestService.sincronizeDataSeller(MoR,sellerId);
        return res.status(201).send();
    }

    async getDetailsOfOrderSellerToPrint(req:Request,res:Response){
        let orderId:number = +req.params.orderId;
        let ticket:string = await this.salesRequestService.getTicketOfOrder(orderId);
        return res.status(200).send(ticket);
    }

    async sincronizeSingleSale(req:Request,res:Response){
        let sellerId:string = req.query.sellerId;
        let items=await this.salesRequestService.sincronizeSingleSale(req.body,sellerId);
        return res.status(201).send(items);
    }
    async getDevolutionTicket(req:Request,res:Response){
        let saleId:number = +req.params.saleId;
        return res.status(200).send(await this.salesRequestService.getDevolutionTicketOfSale(saleId));
    }
    async getDevolutionRequestDetails(req:Request,res:Response){
        let saleId:number= +req.params.saleId;
        let response:RequestDevolution= await this.salesRequestService.getRequestDevolutionDetails(saleId);
        return res.status(200).send(response)
    }
} 