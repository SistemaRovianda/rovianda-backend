import { Response, response } from "express";
import { times, zip } from "lodash";
import { Request } from "mssql";
import { AdminPreRegisterProductDetails, AdminSalesRequest, CancelRequest, ChartD3DataInterface, OfflineNewVersionClient, OfflineNewVersionProducts, OfflineNewVersionResponse, RequestPreRegistProduct, SaleInterfaceRequest, SubSaleInterface } from "../Models/DTO/Admin.Sales.Request";
import { ClientEditRequest } from "../Models/DTO/Client.DTO";
import { Address } from "../Models/Entity/Address";
import { Client } from "../Models/Entity/Client";
import { DayVisited } from "../Models/Entity/DayVisited";
import { PresentationProducts } from "../Models/Entity/Presentation.Products";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { Roles } from "../Models/Entity/Roles";
import { SaleCancel } from "../Models/Entity/SaleCancel";
import { Sale } from "../Models/Entity/Sales";
import { User } from "../Models/Entity/User";
import { ClientRepository } from "../Repositories/Client.Repository";
import { DayVisitedRepository } from "../Repositories/DayVisitedRepository";
import { PresentationsProductsRepository } from "../Repositories/Presentation.Products.Repository";
import { ProductRepository } from "../Repositories/Product.Repository";
import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { RolesRepository } from "../Repositories/Roles.Repository";
import { SaleRepository } from "../Repositories/Sale.Repository";
import { SaleCancelRepository } from "../Repositories/SaleCancelRepository";
import { SqlSRepository } from "../Repositories/SqlS.Repositoy";
import { SubSaleRepository } from "../Repositories/SubSale.Repository";
import { UserRepository } from "../Repositories/User.Repository";
import { AdminSalesReports } from "../Utils/componentsReports/AdminSalesReports";
import ExcelHelper from "../Utils/Excel.Helper";
import { FirebaseHelper } from "../Utils/Firebase.Helper";
export class AdminSalesService{

    private sellerRepository:UserRepository;
    private rolRepository:RolesRepository;
    private dayVisitedRepository:DayVisitedRepository;
    private clientRepository:ClientRepository;
    private excelHelper:ExcelHelper;
    private productRepository:ProductRepository;
    private salesRepository:SaleRepository;
    private pdfExcelUtil:AdminSalesReports;
    private presentationProductRepository:PresentationsProductsRepository;
    private subSalesRepository:SubSaleRepository;
    private userRepository:UserRepository;
    private saleCancelRepository:SaleCancelRepository;
    private firebaseHelper:FirebaseHelper;
    private productRoviandaRepository:ProductRoviandaRepository;
    private sqlRepository:SqlSRepository;
    constructor(firebaseHelper: FirebaseHelper){
        this.sellerRepository = new UserRepository();
        this.rolRepository = new RolesRepository();
        this.clientRepository = new ClientRepository();
        this.dayVisitedRepository = new DayVisitedRepository();
        this.excelHelper = new ExcelHelper();
        this.productRepository = new ProductRepository();
        this.salesRepository = new SaleRepository();
        this.pdfExcelUtil = new AdminSalesReports();
        this.subSalesRepository = new SubSaleRepository();
        this.presentationProductRepository = new PresentationsProductsRepository();
        this.userRepository =new UserRepository();
        this.saleCancelRepository=new SaleCancelRepository();
        this.firebaseHelper = firebaseHelper;
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.sqlRepository = new SqlSRepository();
    }

    async getAllSellers(){
        let rol:Roles = await this.rolRepository.getRoleById(10);
        
        return await this.sellerRepository.getAllSellers(rol);
    }

    async updateClientDetails(clientId:number,body:ClientEditRequest){
        let client:Client = await this.clientRepository.getClientById(clientId);
        if(!client) throw new Error("[404], no existe el cliente con el id: "+clientId);
        client.name = body.name;
        client.address.street = body.street;
        client.address.suburb = body.suburb;
        client.address.cp=body.cp;
        client.address.state = body.state;
        client.address.location = body.city;
        client.keySaeNew = body.keySaeNew;
        let daysVisited = await this.dayVisitedRepository.getDayVisitedById(body.daysVisited.id);
        if(daysVisited){
            daysVisited.monday = body.daysVisited.monday;
            daysVisited.tuesday = body.daysVisited.tuesday;
            daysVisited.wednesday = body.daysVisited.wednesday;
            daysVisited.thursday = body.daysVisited.thursday;
            daysVisited.friday = body.daysVisited.friday;
            daysVisited.saturday = body.daysVisited.saturday;
            daysVisited.sunday = body.daysVisited.sunday;
            await this.dayVisitedRepository.saveDayVisited(daysVisited);
        }
        client.modified=true;
        await this.clientRepository.saveClient(client);
    }

    async createClientCount(sellerId:string,body:ClientEditRequest){
        let client:Client = new Client();
        let address:Address = new Address();
        let seller= await this.sellerRepository.getUserById(sellerId);
        let daysVisited:DayVisited =new DayVisited();
        client.id=body.keyClientId;
        client.keyClient= body.keyClientId;
        client.credit=0;
        client.currentCredit=0;
        client.curp="";
        client.dayCharge=0;
        client.hasDebts=false;
        client.paymentSat="";
        client.phone="";
        client.rfc="";
        client.status="ACTIVE";
        client.cfdi="";
        client.clasification="";
        client.daysCredit=0;
        
        client.address =address;
        client.name = body.name;
        client.typeClient="CONTADO";
        client.address.street = body.street;
        client.address.suburb = body.suburb;
        client.address.cp=body.cp;
        client.address.state = body.state;
        client.address.location = body.city;
        client.address.population = body.city;
        client.address.municipality=body.city;
        client.address.reference="";
        client.address.extNumber=0;
        client.address.nationality="MEXICANO";
        client.keySaeNew = body.keySaeNew;
        client.idAspel = +body.keySaeNew;
        client.seller = seller;
        let clientSaved =await this.clientRepository.saveClient(client);

        daysVisited.monday = body.daysVisited.monday;
        daysVisited.tuesday = body.daysVisited.tuesday;
        daysVisited.wednesday = body.daysVisited.wednesday;
        daysVisited.thursday = body.daysVisited.thursday;
        daysVisited.friday = body.daysVisited.friday;
        daysVisited.saturday = body.daysVisited.saturday;
        daysVisited.sunday = body.daysVisited.sunday;
        daysVisited.client = clientSaved;
        await this.dayVisitedRepository.saveDayVisited(daysVisited);
    }

    async deleteLogicClientCount(clientId:number){
        let client =await this.clientRepository.getClientById(clientId);
        client.status="INACTIVE";
        await this.clientRepository.saveClient(client)
    }

    async getDaysVisitedByClient(clientId:number){
        let client:Client = await this.clientRepository.getClientById(clientId);
        if(!client) throw new Error("[404], no existe el cliente con el id: "+clientId);
        return await this.dayVisitedRepository.getByClient(client);
    }

    async getLastClientId(){
        let count= await this.clientRepository.getLastCount();
        return count[0].clientId;
    }

    async getSummaryReportBySeller(sellerId:string,from:string,to:string){
        let user:User = await this.sellerRepository.getUserById(sellerId);
        let acumulatedAbarrotes = await this.sellerRepository.getAcumulatedBySellerProductAbarrotes(sellerId,from,to);
        let acumulatedNormal = await this.sellerRepository.getAcumulatedBySellerProductNormal(sellerId,from,to);
        let acumulatedCheeses = await this.sellerRepository.getAcumulatedBySellerProductCheeses(sellerId,from,to);
        let acumulatedNormalKg = await this.sellerRepository.getAcumulatedBySellerProductNormalKG(sellerId,from,to);
        let acumulatedCheeseKg = await this.sellerRepository.getAcumulatedBySellerProductCheesesKG(sellerId,from,to);
        let rankingProducts = await this.sellerRepository.getRankingProductBySeller(sellerId,from,to);
        rankingProducts = rankingProducts.sort((a,b)=>b.amount-a.amount);
        let report:any = this.excelHelper.getSummaryReportBySeller(user,acumulatedAbarrotes,acumulatedNormal,acumulatedNormalKg,acumulatedCheeses,acumulatedCheeseKg,rankingProducts,from,to);
        return report;
    }

    async getSummaryReportBySellerPDF(sellerId:string,from:string,to:string){
        let user:User = await this.sellerRepository.getUserById(sellerId);
        let acumulatedAbarrotes = await this.sellerRepository.getAcumulatedBySellerProductAbarrotes(sellerId,from,to);
        let acumulatedNormal = await this.sellerRepository.getAcumulatedBySellerProductNormal(sellerId,from,to);
        let acumulatedCheeses = await this.sellerRepository.getAcumulatedBySellerProductCheeses(sellerId,from,to);
        let acumulatedNormalKg = await this.sellerRepository.getAcumulatedBySellerProductNormalKG(sellerId,from,to);
        let acumulatedCheeseKg = await this.sellerRepository.getAcumulatedBySellerProductCheesesKG(sellerId,from,to);
        let rankingProducts = await this.sellerRepository.getRankingProductBySeller(sellerId,from,to);
        rankingProducts = rankingProducts.sort((a,b)=>b.amount-a.amount);
        let report:any = this.pdfExcelUtil.getSummaryReportBySellerPDF(user,acumulatedAbarrotes,acumulatedNormal,acumulatedNormalKg,acumulatedCheeses,acumulatedCheeseKg,rankingProducts,from,to);
        return report;
    }

    async getGeneralReportSales(dateStart:string,dateEnd:string,body:AdminSalesRequest){
        if(body.type=="day"){
           let records = await this.salesRepository.getHistoryGeneralByDay(body,dateStart,dateEnd);
           let workbook = await this.pdfExcelUtil.getHistoryGeneralByDay(records,dateStart,dateEnd);
           return workbook;
        }else if(body.type=="week"){
            let records = await this.salesRepository.getHistoryGeneralByWeek(body,dateStart,dateEnd);
            let mapWeeks = await this.salesRepository.getWeeksCountsBetweenDates(dateStart,dateEnd);
            let workbook = await this.pdfExcelUtil.getHistoryGeneralByWeek(records,mapWeeks,dateStart,dateEnd);
            return workbook;
        }else if(body.type=="month"){
            let records = await this.salesRepository.getHistoryGeneralByMonth(body,dateStart,dateEnd);
            let workbook = await this.pdfExcelUtil.getHistoryGeneralByMonth(records,dateStart,dateEnd);
            return workbook;
        }else if(body.type=="year"){
            let records = await this.salesRepository.getHistoryGeneralByYear(body,dateStart,dateEnd);
            let workbook = await this.pdfExcelUtil.getHistoryGeneralByYear(records,dateStart,dateEnd);
            return workbook;
        }
    }

    async getGeneralChartDataSales(dateStart:string,dateEnd:string){
        return await this.salesRepository.getGeneralChartDataSales(dateStart,dateEnd);
    }

    async getAllClients(){
        let clients = await this.clientRepository.getAllClientsToAdminSales();
        return clients;
    }

    async getAllProductsWithPresentations(){
        return await this.productRepository.getAllProductsCatalogByPresentation();
    }

    async getMetricsRankingSellerByDate(dateStart:string,dateEnd:string){
        return await this.salesRepository.getRankingSellersByDate(dateStart,dateEnd);
    }

    async getReportMetricsRankingSellerByDatePDF(dateStart:string,dateEnd:string){
        let result= await this.salesRepository.getRankingSellersByDate(dateStart,dateEnd);
        return this.pdfExcelUtil.getReportMetricsRankingSellerByDatePDF(result,dateStart,dateEnd);
    }

    async getReportMetricsRankingSellerByDateEXCEL(dateStart:string,dateEnd:string){
        let result= await this.salesRepository.getRankingSellersByDate(dateStart,dateEnd);
        return this.pdfExcelUtil.getReportMetricsRankingSellerByDateEXCEL(result,dateStart,dateEnd);
    }

    async getMetricsRankingSellersByProduct(presentationId:number,dateStart:string,dateEnd:string){
        return await this.salesRepository.getRankingSalesByPresentationProduct(presentationId,dateStart,dateEnd);
    }

    async getMetricsRankingReportSellersByProductPdf(presentationId:number,dateStart:string,dateEnd:string){
        let presentation:PresentationProducts = await this.presentationProductRepository.getPresentationProductsById(presentationId);
        let data= await this.salesRepository.getRankingSalesByPresentationProduct(presentationId,dateStart,dateEnd);
        let report = await this.pdfExcelUtil.getReportRankingSellersByProductPdf(dateStart,dateEnd,data,presentation);
        return report;
    }
    async getMetricsRankingReportSellersByProductExcel(presentationId:number,dateStart:string,dateEnd:string){
        let presentation:PresentationProducts = await this.presentationProductRepository.getPresentationProductsById(presentationId);
        let data= await this.salesRepository.getRankingSalesByPresentationProduct(presentationId,dateStart,dateEnd);
        let workbook = await this.pdfExcelUtil.getReportRankingSellersByProductExcel(dateStart,dateEnd,data,presentation);
        return workbook;
    }

    async getGeneralChartDataSalesReportPdf(dateStart:string,dateEnd:string){
        let data:ChartD3DataInterface[] = await this.salesRepository.getGeneralChartDataSales(dateStart,dateEnd);
        data=data.sort((a,b)=>b.amount-a.amount);
        let report = await this.pdfExcelUtil.getReportProductRankingByDates(dateStart,dateEnd,data);
        return report;
    }
    async getGeneralChartDataSalesReportExcel(dateStart:string,dateEnd:string){
        let data:ChartD3DataInterface[] = await this.salesRepository.getGeneralChartDataSales(dateStart,dateEnd);
        data=data.sort((a,b)=>b.amount-a.amount);
        let workbook = await this.pdfExcelUtil.getReportProductRankingByDatesExcel(dateStart,dateEnd,data);
        return workbook;
    }

    async updateClientSincronized(body:number[]){
        await this.clientRepository.updateSincronizeStatusClients(body);
    }

    async getOfflineNewVersion(sellerId:string,date:string){
        let clients:OfflineNewVersionClient[] = await this.clientRepository.getClientsOfflineNewVersion(sellerId);
        let products:OfflineNewVersionProducts[] = await this.productRepository.getProductsOfflineNewVersion(sellerId);
        let salesToDebts:SaleInterfaceRequest[]=[];
        let currentSalesList:SaleInterfaceRequest[]=[];
        let sales:Sale[] = await this.salesRepository.getSalesPendingBySeller(sellerId);
        let currentSales:Sale[]=await this.salesRepository.getSalleSellerByDateUser(sellerId,date);
        console.log("Current sales: "+currentSales.length);
        
        for(let sale of sales){
            let saleCancelAccepted:string="";
            let statusStr =sale.statusStr;
            if(sale.cancelRequest){
                let saleCancel =await this.saleCancelRepository.findCancelRequestByFolio(sale.folio);
                if(saleCancel){
                    if(saleCancel.status=="ACCEPTED"){
                        saleCancelAccepted="true";
                    }else if(saleCancel.status=="DECLINED"){
                        saleCancelAccepted="false";
                    }else if(saleCancel.status=="PENDING"){
                        statusStr="CANCELED";
                    }
                }
            }
            let subSales = await this.subSalesRepository.getSubSalesBySale(sale);
            salesToDebts.push(
                {
                    amount: sale.amount,
                    clientId: sale.client.id,
                    clientName: sale.client.name,
                    credit: sale.credit,
                    date: sale.date,
                    folio: sale.folio,
                    keyClient: sale.client.keyClient.toString(),
                    payed: sale.payedWith,
                    saleId:sale.saleId,
                    sellerId: sellerId,
                    statusStr: statusStr,
                    status: sale.status,
                    typeSale: sale.typeSale,    
                    cancelAutorized:saleCancelAccepted,
                    products: subSales.map((x)=>{
                        let item:SubSaleInterface= {
                            presentationId: x.presentation.id,
                            price: x.amount,
                            productId: x.product.id,
                            productKey: x.presentation.keySae,
                            productName: x.product.name,
                            productPresentationType: x.presentation.presentationType,
                            quantity: x.quantity,
                            subSaleServerId: x.subSaleId,
                            uniMed: x.presentation.uniMed,
                            weightStandar: x.presentation.presentationPriceMin
                        };
                        return item;
                    })
                }
            );
        }
        for(let currentSale of currentSales){
            let subSales = await this.subSalesRepository.getSubSalesBySale(currentSale);
            let saleCancelAccepted:string="";
            let statusStr =currentSale.statusStr;
            if(currentSale.cancelRequest){
                let saleCancel =await this.saleCancelRepository.findCancelRequestByFolio(currentSale.folio);
                if(saleCancel){

                    if(saleCancel.status=="ACCEPTED"){
                        saleCancelAccepted="true";
                    }else if(saleCancel.status=="DECLINED"){
                        saleCancelAccepted="false";
                    }else if(saleCancel.status=="PENDING"){
                        statusStr="CANCELED";
                    }
                }
            }
            currentSalesList.push(
                {
                    amount: currentSale.amount,
                    clientId: currentSale.client.id,
                    clientName: currentSale.client.name,
                    credit: currentSale.credit,
                    date: currentSale.date,
                    folio: currentSale.folio,
                    keyClient: currentSale.client.keyClient.toString(),
                    payed: currentSale.payedWith,
                    saleId:currentSale.saleId,
                    sellerId: sellerId,
                    statusStr: statusStr,
                    status: currentSale.status,
                    typeSale: currentSale.typeSale,
                    cancelAutorized: saleCancelAccepted,
                    products: subSales.map((x)=>{
                        let item:SubSaleInterface= {
                            presentationId: x.presentation.id,
                            price: x.amount,
                            productId: x.product.id,
                            productKey: x.presentation.keySae,
                            productName: x.product.name,
                            productPresentationType: x.presentation.presentationType,
                            quantity: x.quantity,
                            subSaleServerId: x.subSaleId,
                            uniMed: x.presentation.uniMed,
                            weightStandar: x.presentation.presentationPriceMin
                        };
                        return item;
                    })
                }
            );
        }
        let seller:User=await this.sellerRepository.getUserById(sellerId);
        let saleOfSeller = await this.salesRepository.getLastFolioOfSeller(seller);
        let response:OfflineNewVersionResponse={
            clients,
            products,
            email: seller.email,
            password:"Rovi2020",
            lastSincronization: new Date().toISOString(),
            nomenclature: seller.cve,
            uid: seller.id,
            name: seller.name,
            count: +saleOfSeller.replace(seller.cve,""),
            debts:salesToDebts,
            salesOfDay: currentSalesList
        }
        return response;
    }

    async cancelReactivate(saleId:number){
        let sale:Sale = await this.salesRepository.getSaleById(saleId);
        if(sale){
            if(sale.statusStr=="CANCELED"){
                sale.statusStr="ACTIVE";
                let saleCancelRequest = await this.saleCancelRepository.findCancelRequestByFolio(sale.folio);
                if(saleCancelRequest){
                    if(saleCancelRequest.status=="ACCEPTED"){
                        saleCancelRequest.status="DECLINED";
                    }
                }
            }else if(sale.statusStr=="ACTIVE"){
                sale.statusStr="CANCELED";
            }
            await this.salesRepository.saveSale(sale);
        }
    }

    async getReportPdfSalesTypes(type:string,sellers:string[],dateStart:string,dateEnd:string){
        let sales = await this.salesRepository.getAllSalesByTypeDatesAndSellers(type,sellers,dateStart,dateEnd);
        return this.pdfExcelUtil.getReportOfSalesTypesBySellersPDF(type,sales,dateStart,dateEnd);
    }
    async getReportExcelSalesTypes(type:string,sellers:string[],dateStart:string,dateEnd:string){
        let sales = await this.salesRepository.getAllSalesByTypeDatesAndSellers(type,sellers,dateStart,dateEnd);
        return this.pdfExcelUtil.getReportOfSalesTypesBySellersExcel(type,sales,dateStart,dateEnd);
    }
    
    async setTokenToUser(uid:string,token:string){
        let user:User = await this.userRepository.getUserById(uid);
        user.token=token;
        await this.userRepository.saveUser(user);
    }
    async getAllCancelRequests(type:string,dateStart:string,dateEnd:string){
        return  await this.saleCancelRepository.getAllSaleCancelsPending(type,dateStart,dateEnd);
    }
    async adminSaleChangeStatus(saleId:number,status:string,adminId:string){
        let sale:Sale = await this.salesRepository.getSaleById(saleId);
        if(sale){
            let saleCancelRequest = await this.saleCancelRepository.findCancelRequestByFolio(sale.folio);
            if(status=="ACCEPTED"){
                sale.statusStr="CANCELED";   
                if(saleCancelRequest){
                    saleCancelRequest.status="ACCEPTED";
                    let date = new Date();
                    date.setHours(date.getHours()-5);
                    saleCancelRequest.modifiedAt=date.toISOString();
                    saleCancelRequest.admin=adminId;
                    await this.saleCancelRepository.saveCancelSale(saleCancelRequest);
                }
            }else if(status=="DECLINED"){
                sale.statusStr="ACTIVE";
                if(saleCancelRequest){
                    saleCancelRequest.status="DECLINED";
                    let date = new Date();
                    date.setHours(date.getHours()-5);
                    saleCancelRequest.modifiedAt=date.toISOString();
                    saleCancelRequest.admin=adminId;
                    await this.saleCancelRepository.saveCancelSale(saleCancelRequest);
                }
            }
            // try{
            // await this.firebaseHelper.notificateToSeller(sale.seller.id,(status=="ACCEPTED")?"Aceptado":"Rechazado");
            // }catch(err){
            //     console.log("Error al enviar notification a vendedor");
            // }
            await this.salesRepository.saveSale(sale);
        }
    }

    async getAllProductsRovianda(hint:string){
        return await this.productRoviandaRepository.getAllProductsRovianda(hint);
    }

    async getPreregisterProduct(code:string){
        let result:AdminPreRegisterProductDetails[] = await this.sqlRepository.getPreRegisterProductDetaisl(code);
        if(result.length){
            let presentation:PresentationProducts = await this.presentationProductRepository.findByKeySae(code);
            if(!presentation){
                presentation = await this.presentationProductRepository.findByKeySaeByLike(code);
            }
            if(!presentation){
                result[0].productIdInSystem=null;
            }else{
                result[0].productIdInSystem=presentation.productRovianda.id;
            }
            
           return result[0];
        }else{
            throw new Error("[404], no existe el producto con ese código")
        }
    }

    async registerPreRegisterProduct(body:RequestPreRegistProduct){
        let product:ProductRovianda;
        if(!body.productId){
            product  = new ProductRovianda();
            product.name=body.name;
            product.code=body.code;
            product.status=true;
            product.imgS3="";
            product = await this.productRoviandaRepository.saveProductRovianda(product);
        }else{
            product = await this.productRoviandaRepository.getProductRoviandaById(body.productId);
        }
        let presentationProduct:PresentationProducts = new PresentationProducts();
        presentationProduct.presentation=1;
        presentationProduct.presentationType=body.presentation;
        presentationProduct.presentationPricePublic=body.price;
        presentationProduct.presentationPriceMin=body.weight;
        if(body.type=="ABARROTES"){
            presentationProduct.presentationPriceLiquidation=body.quantityByPresentation
        }else{
            presentationProduct.presentationPriceLiquidation=0;
        }
        presentationProduct.status=true;
        presentationProduct.typePrice="PUBLIC";
        if(body.type=="ABARROTES"){
            presentationProduct.keySae=body.codeAltern;
            presentationProduct.keyAltern=body.code;
        }else{
            presentationProduct.keySae=body.code;
        }
        presentationProduct.typeProduct=body.type;
        presentationProduct.productRovianda=product;
        await this.presentationProductRepository.savePresentationsProduct(presentationProduct);
    }

    async updatePreRegisterProduct(presentationId:number,body:RequestPreRegistProduct){
        let presentation = await this.presentationProductRepository.getPresentationProductsById(presentationId);
        if(!presentation) throw new Error("[404], no existe esa presentación de producto");
        presentation.presentationType=body.presentation;
        presentation.typeProduct=body.type;
        if(body.type=="ABARROTES"){
            presentation.keySae=body.codeAltern;
            presentation.keyAltern=body.code;
            presentation.presentationPriceLiquidation=body.quantityByPresentation
        }else{
            presentation.keySae=body.code;
            presentation.keyAltern=null;
        }
        presentation.presentationPricePublic=body.price;
        presentation.presentationPriceMin=body.weight;
        presentation.uniMed=body.uniMed;
        await this.presentationProductRepository.savePresentationsProduct(presentation);
    }

}