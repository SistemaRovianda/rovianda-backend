import { Response, response } from "express";
import { times, zip } from "lodash";
import { Request } from "mssql";
import { AdminPreRegisterProductDetails, AdminSalesRequest, CancelRequest, ChartD3DataInterface, OfflineNewVersionClient, OfflineNewVersionProducts, OfflineNewVersionResponse, RequestPreRegistProduct, SaleInterfaceRequest, SubSaleInterface } from "../Models/DTO/Admin.Sales.Request";
import { ClientEditRequest } from "../Models/DTO/Client.DTO";
import { Address } from "../Models/Entity/Address";
import { Client } from "../Models/Entity/Client";
import { DayVisited } from "../Models/Entity/DayVisited";
import { DevolutionSellerRequest } from "../Models/Entity/DevolutionSellerRequest";
import { PresentationProducts } from "../Models/Entity/Presentation.Products";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { Roles } from "../Models/Entity/Roles";
import { SaleCancel } from "../Models/Entity/SaleCancel";
import { Sale } from "../Models/Entity/Sales";
import { User } from "../Models/Entity/User";
import { ClientRepository } from "../Repositories/Client.Repository";
import { DayVisitedRepository } from "../Repositories/DayVisitedRepository";
import { DevolutionOldSubSaleRepository } from "../Repositories/DevolutionOldSubSalesRepository";
import { DevolutionSellerRequestRepository } from "../Repositories/DevolutionSellerRequestRepository";
import { PresentationsProductsRepository } from "../Repositories/Presentation.Products.Repository";
import { ProductRepository } from "../Repositories/Product.Repository";
import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { RolesRepository } from "../Repositories/Roles.Repository";
import { SaleRepository } from "../Repositories/Sale.Repository";
import { SaleCancelRepository } from "../Repositories/SaleCancelRepository";
import { SellerInventoryRepository } from "../Repositories/Seller.Inventory.Repository";
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
    private sellerInventoryRepository:SellerInventoryRepository;
    private devolutionRequestRepository:DevolutionSellerRequestRepository;
    private devolutionSubSaleRepository:DevolutionOldSubSaleRepository;
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
        this.sellerInventoryRepository= new SellerInventoryRepository();
        this.devolutionRequestRepository=new DevolutionSellerRequestRepository();
        this.devolutionSubSaleRepository=new DevolutionOldSubSaleRepository();
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
        let daysVisited= await this.dayVisitedRepository.getByClient(client);
        if(!daysVisited){
            daysVisited = new DayVisited();
            daysVisited.client=client;
            daysVisited.monday=false;
            daysVisited.tuesday=false;
            daysVisited.wednesday=false;
            daysVisited.thursday=false;
            daysVisited.friday=false;
            daysVisited.saturday=false;
            daysVisited.sunday=false;
            daysVisited = await this.dayVisitedRepository.saveDayVisited(daysVisited);
        }
        return daysVisited;
    }

    async getLastClientId(){
        let count= await this.clientRepository.getLastCount();
        return count[0].clientId;
    }

    async getSummaryReportBySeller(sellerId:string,from:string,to:string){
        let user:User = await this.sellerRepository.getUserById(sellerId);
        let acumulatedSales = await this.salesRepository.getCountByDates(sellerId,from,to);
        let acumulatedAbarrotes = await this.sellerRepository.getAcumulatedBySellerProductAbarrotes(sellerId,from,to,"NORMAL");
        let acumulatedNormal = await this.sellerRepository.getAcumulatedBySellerProductNormal(sellerId,from,to,"NORMAL");
        let acumulatedCheeses = await this.sellerRepository.getAcumulatedBySellerProductCheeses(sellerId,from,to,"NORMAL");
        let acumulatedNormalKg = await this.sellerRepository.getAcumulatedBySellerProductNormalKG(sellerId,from,to,"NORMAL");
        let acumulatedCheeseKg = await this.sellerRepository.getAcumulatedBySellerProductCheesesKG(sellerId,from,to,"NORMAL");
        let rankingProducts = await this.sellerRepository.getRankingProductBySeller(sellerId,from,to,"NORMAL");
        rankingProducts = rankingProducts.sort((a,b)=>b.amount-a.amount);
        let workbook = this.excelHelper.getEmptyWoorbook();
        workbook = this.excelHelper.getSummaryReportBySeller(user,acumulatedAbarrotes,acumulatedNormal,acumulatedNormalKg,acumulatedCheeses,acumulatedCheeseKg,rankingProducts,from,to,acumulatedSales,"NORMAL",workbook);
        let acumulatedAbarrotes2 = await this.sellerRepository.getAcumulatedBySellerProductAbarrotes(sellerId,from,to,"CANCELED");
        let acumulatedNormal2 = await this.sellerRepository.getAcumulatedBySellerProductNormal(sellerId,from,to,"CANCELED");
        let acumulatedCheeses2 = await this.sellerRepository.getAcumulatedBySellerProductCheeses(sellerId,from,to,"CANCELED");
        let acumulatedNormalKg2 = await this.sellerRepository.getAcumulatedBySellerProductNormalKG(sellerId,from,to,"CANCELED");
        let acumulatedCheeseKg2 = await this.sellerRepository.getAcumulatedBySellerProductCheesesKG(sellerId,from,to,"CANCELED");
        let rankingProducts2 = await this.sellerRepository.getRankingProductBySeller(sellerId,from,to,"CANCELED");
        let woorbook2 = this.excelHelper.getSummaryReportBySeller(user,acumulatedAbarrotes2,acumulatedNormal2,acumulatedNormalKg2,acumulatedCheeses2,acumulatedCheeseKg2,rankingProducts2,from,to,acumulatedSales,"CANCELED",workbook);
        return woorbook2;
    }

    async getSummaryReportBySellerPDF(sellerId:string,from:string,to:string){
        let user:User = await this.sellerRepository.getUserById(sellerId);
        let dataCount = await this.salesRepository.getCountByDates(sellerId,from,to);
        let acumulatedAbarrotes = await this.sellerRepository.getAcumulatedBySellerProductAbarrotes(sellerId,from,to,"NORMAL");
        let acumulatedNormal = await this.sellerRepository.getAcumulatedBySellerProductNormal(sellerId,from,to,"NORMAL");
        let acumulatedCheeses = await this.sellerRepository.getAcumulatedBySellerProductCheeses(sellerId,from,to,"NORMAL");
        let acumulatedNormalKg = await this.sellerRepository.getAcumulatedBySellerProductNormalKG(sellerId,from,to,"NORMAL");
        let acumulatedCheeseKg = await this.sellerRepository.getAcumulatedBySellerProductCheesesKG(sellerId,from,to,"NORMAL");
        let rankingProducts = await this.sellerRepository.getRankingProductBySeller(sellerId,from,to,"NORMAL");
        rankingProducts = rankingProducts.sort((a,b)=>b.amount-a.amount);
        let report:any = this.pdfExcelUtil.getSummaryReportBySellerPDF(user,acumulatedAbarrotes,acumulatedNormal,acumulatedNormalKg,acumulatedCheeses,acumulatedCheeseKg,rankingProducts,from,to,dataCount,"NORMAL");
        report+=`<br><br><div style="display:block;width:100%;text-align:center;">Cancelaciones</div>`;
        let acumulatedAbarrotes2 = await this.sellerRepository.getAcumulatedBySellerProductAbarrotes(sellerId,from,to,"CANCELED");
        let acumulatedNormal2 = await this.sellerRepository.getAcumulatedBySellerProductNormal(sellerId,from,to,"CANCELED");
        let acumulatedCheeses2 = await this.sellerRepository.getAcumulatedBySellerProductCheeses(sellerId,from,to,"CANCELED");
        let acumulatedNormalKg2 = await this.sellerRepository.getAcumulatedBySellerProductNormalKG(sellerId,from,to,"CANCELED");
        let acumulatedCheeseKg2 = await this.sellerRepository.getAcumulatedBySellerProductCheesesKG(sellerId,from,to,"CANCELED");
        let rankingProducts2 = await this.sellerRepository.getRankingProductBySeller(sellerId,from,to,"CANCELED");
        rankingProducts2 = rankingProducts2.sort((a,b)=>b.amount-a.amount);
        report+=this.pdfExcelUtil.getSummaryReportBySellerPDF(user,acumulatedAbarrotes2,acumulatedNormal2,acumulatedNormalKg2,acumulatedCheeses2,acumulatedCheeseKg2,rankingProducts2,from,to,dataCount,"CANCELED");
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

    async getGeneralChartDataSales(dateStart:string,dateEnd:string,typeComparation:string){
        let date1="";
        let date2="";
        let date3="";
        let date4="";
        let data1:ChartD3DataInterface[]=[];
        let data2:ChartD3DataInterface[]=[];
        if(typeComparation=="YESTERDAY"){
            let dateP = new Date(dateStart);
            dateP.setHours(dateP.getHours()-1);
            let day = (dateP.getDate()).toString();
            if(+day<10) day="0"+day;
            date1=`${dateStart.substring(0,8)}${day}`;
            date2=`${dateStart.substring(0,8)}${day}`;
            data1 = await this.salesRepository.getGeneralChartDataSales(date1,date2,"COMP");
            date3=dateStart;
            date4=dateStart;
            data2 = await this.salesRepository.getGeneralChartDataSales(date3,date4,"NORMAL");
        }else if(typeComparation=="WEEK"){
            let dates= await this.productRoviandaRepository.getWeekDatesByDate(dateStart,"week");
            date1=dates.date1;
            date2=dates.date2;
            data1 = await this.salesRepository.getGeneralChartDataSales(date1,date2,"COMP");
            date3=dates.date3;
            date4=dates.date4;
            data2 = await this.salesRepository.getGeneralChartDataSales(date3,date4,"NORMAL");
        }else if(typeComparation=="LAST_MONTH"){
            let dates= await this.productRoviandaRepository.getWeekDatesByDate(dateStart,"month");
            date1=dates.date1;
            date2=dates.date2;
            data1 = await this.salesRepository.getGeneralChartDataSales(date1,date2,"COMP");
            date3=dates.date3;
            date4=dates.date4;
            data2 = await this.salesRepository.getGeneralChartDataSales(date3,date4,"NORMAL");
        }else if(typeComparation=="LAST_YEAR"){
            let dateP = new Date(dateStart);
            let currentYear = dateP.getFullYear();
            let lastYear = currentYear-1;
            date1=`${lastYear}-01-01`;
            date2=`${lastYear}-12-31`;
            data1 = await this.salesRepository.getGeneralChartDataSales(date1,date2,"COMP");
            date3=`${currentYear}-01-01`;
            date4=`${currentYear}-12-31`;
            data2 = await this.salesRepository.getGeneralChartDataSales(date3,date4,"NORMAL");
        }else if(typeComparation=="MONTH_LAST_YEAR"){
            let dates= await this.productRoviandaRepository.getWeekDatesByDate(dateStart,"month");
            let dateP = new Date(date1);
            date1=`${dateP.getFullYear()-1}${date1.substring(4,date1.toString().length)}`;
            date2=`${dateP.getFullYear()-1}${date2.substring(4,date2.toString().length)}`;
            data1 = await this.salesRepository.getGeneralChartDataSales(date1,date2,"COMP");
            date3=dates.date3;
            date4=dates.date4;
            data2 = await this.salesRepository.getGeneralChartDataSales(date3,date4,"NORMAL");
        }else{
            return await this.salesRepository.getGeneralChartDataSales(dateStart,dateEnd,"NORMAL");
        }

        let dataFinal:ChartD3DataInterface[]=[];
        data1.forEach(x=>x.typePresentation=x.typePresentation+" (Anterior) ");
        data2.forEach(x=>x.typePresentation=x.typePresentation+" (Actual) ")
        dataFinal=[...data1,...data2];
        dataFinal.sort((a,b)=>a.presentationId-b.presentationId);
        return dataFinal;
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
        let data:ChartD3DataInterface[] = await this.salesRepository.getGeneralChartDataSales(dateStart,dateEnd,"NORMAL");
        data=data.sort((a,b)=>b.amount-a.amount);
        let report = await this.pdfExcelUtil.getReportProductRankingByDates(dateStart,dateEnd,data);
        return report;
    }
    async getGeneralChartDataSalesReportExcel(dateStart:string,dateEnd:string){
        let data:ChartD3DataInterface[] = await this.salesRepository.getGeneralChartDataSales(dateStart,dateEnd,"NORMAL");
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
        let devolutionsRequestIds = await this.devolutionRequestRepository.getAllDevolutionsOfSellerAndDate(sellerId,date);
        let devolutionsRequest= await this.devolutionRequestRepository.getEntitiesToDataInitial(devolutionsRequestIds.map(x=>x.id));
        let devolutionsSubSales = await this.devolutionSubSaleRepository.getAllDevolutionsSubSalesBySellerAndDate(devolutionsRequest.map(x=>x.devolutionAppRequestId));
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
                            weightStandar: x.presentation.presentationPriceMin,
                            subSaleAppId: x.appSubSaleId,
                            esqKey: x.presentation.esqKey,
                            esqDescription: x.presentation.esqDescription
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
                            weightStandar: x.presentation.presentationPriceMin,
                            subSaleAppId: x.appSubSaleId,
                            esqKey: x.presentation.esqKey,
                            esqDescription: x.presentation.esqDescription
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
            salesOfDay: currentSalesList,
            devolutionsRequest,
            devolutionsSubSales
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
                let saleCancelRequest = await this.saleCancelRepository.findCancelRequestByFolio(sale.folio);
                if(saleCancelRequest){
                    saleCancelRequest.status="ACCEPTED";
                    await this.saleCancelRepository.saveCancelSale(saleCancelRequest);
                }
                
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
    async getAllCancelRequests(type:string,dateStart:string,dateEnd:string,page:string,perPage:string){
        return  await this.saleCancelRepository.getAllSaleCancelsPending(type,dateStart,dateEnd,page,perPage);
    }
    async getAllDevolutionsRequests(type:string,dateStart:string,dateEnd:string,page:string,perPage:string){
        return  await this.devolutionRequestRepository.getAllSaleDevolutionsPending(type,dateStart,dateEnd,page,perPage);
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

    async adminSaleDevolutionRequestStatus(saleId:number,status:string,adminId:string){
        let sale:Sale = await this.salesRepository.getSaleById(saleId);
        if(sale){
            let devolutionRequest = await this.devolutionRequestRepository.getDevolutionSellerRequestByFolio(sale.folio);
            if(status=="ACCEPTED"){
                
                if(devolutionRequest){
                    devolutionRequest.status="ACCEPTED";
                    let date = new Date();
                    date.setHours(date.getHours()-5);
                    devolutionRequest.dateAttended=date.toISOString();
                    devolutionRequest.adminId=adminId;
                    await this.devolutionRequestRepository.saveDevolutionSellerRequest(devolutionRequest);
                }
            }else if(status=="DECLINED"){
                
                if(devolutionRequest){
                    devolutionRequest.status="DECLINED";
                    let date = new Date();
                    date.setHours(date.getHours()-5);
                    devolutionRequest.dateAttended=date.toISOString();
                    devolutionRequest.adminId=adminId;
                    await this.devolutionRequestRepository.saveDevolutionSellerRequest(devolutionRequest);
                }
            }
            // try{
            // await this.firebaseHelper.notificateToSeller(sale.seller.id,(status=="ACCEPTED")?"Aceptado":"Rechazado");
            // }catch(err){
            //     console.log("Error al enviar notification a vendedor");
            // }
            
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
            let iva=0;
            let ieps=0;
            switch(result[0].esqKey){
                case 1:
                    iva= result[0].price*.16;
                    result[0].price+=iva;
                    break;
                case 2:// without iva 0%
                    break;
                case 3:// without iva exent
                    break;
                case 4:
                    
                    ieps= result[0].price*.08;
                    iva= (result[0].price+ieps)*.16;
                    result[0].price+=ieps+iva;
                    break;
                case 5:
                    ieps= result[0].price*.25;
                    iva= (result[0].price+ieps)*.16;
                    result[0].price+=ieps+iva;
                    break;
                case 6: 
                    ieps= result[0].price*.50;
                    iva= (result[0].price+ieps)*.16;
                    result[0].price+=ieps+iva;
                    break;
            }
           return result[0];
        }else{
            throw new Error("[404], no existe el producto con ese código")
        }
    }

    async registerPreRegisterProduct(body:RequestPreRegistProduct){
        let product:ProductRovianda;
        if(!body.productId){
            product = await this.productRoviandaRepository.getProductRoviandaByCode(body.code);
            if(!product){
                product  = new ProductRovianda();
                product.name=body.name;
                product.code=body.code;
                product.status=true;
                product.imgS3="";
                product = await this.productRoviandaRepository.saveProductRovianda(product);
            }
        }else{
            product = await this.productRoviandaRepository.getProductRoviandaById(body.productId);
        }
        let presentationProduct:PresentationProducts = new PresentationProducts();
        presentationProduct.presentation=1;
        presentationProduct.presentationType=body.presentation;
        presentationProduct.presentationPricePublic=body.price;
        presentationProduct.presentationPriceMin=body.weight;
        presentationProduct.esqKey=body.esqKey;
        presentationProduct.esqDescription=body.esqDescription;
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
        presentationProduct.uniMed=body.uniMed;
        presentationProduct.productRovianda=product;
        await this.presentationProductRepository.savePresentationsProduct(presentationProduct);
        await this.sellerInventoryRepository.insertNewProductToSellerInventory(presentationProduct.id,product.id);
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
        presentation.esqKey=body.esqKey;
        presentation.esqDescription=body.esqDescription;
        await this.presentationProductRepository.savePresentationsProduct(presentation);
    }


    async deletePreRegistProduct(presentationId:number){
        let presentationProduct:PresentationProducts = await this.presentationProductRepository.getPresentationProductsById(presentationId);
        presentationProduct.status=false;
        await this.presentationProductRepository.savePresentationsProduct(presentationProduct);
        await this.sellerInventoryRepository.deletePresentationOfInventoryOfSeller(presentationId);
    }

}