import { Request, Response } from "express";
import { DayVisited } from "../Models/Entity/DayVisited";
import { User } from "../Models/Entity/User";
import { AdminSalesService } from "../Services/Admin.Sales.Service";
import * as pdf from 'html-pdf';
import { AdminPreRegisterProductDetails, AdminProductsCatalog, CancelRequest, ChartD3DataInterface, OfflineNewVersionResponse, RankingSeller, RankingSellerByProduct } from "../Models/DTO/Admin.Sales.Request";
import { FirebaseHelper } from "../Utils/Firebase.Helper";
export class AdminSalesController{
    
    private adminSalesService:AdminSalesService;
    constructor(firebaseHelper: FirebaseHelper){
        this.adminSalesService = new AdminSalesService(firebaseHelper);
    }

    async getOnlySellers(req:Request,res:Response){
        let sellers:User[] =await this.adminSalesService.getAllSellers(); 
        return res.status(200).send(sellers);
    }


    async updateSellerClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        await this.adminSalesService.updateClientDetails(clientId,req.body);
        return res.status(204).send();
    }

    async createClientCount(req:Request,res:Response){
        let sellerId = req.params.sellerId;
        await this.adminSalesService.createClientCount(sellerId,req.body);
        return res.status(201).send();
    }

    async deleteLoginClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        await this.adminSalesService.deleteLogicClientCount(clientId);
        return res.status(204).send();
    }

    async getDaysVisitsByClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        let response:DayVisited=await this.adminSalesService.getDaysVisitedByClient(clientId);
        return res.status(200).send(response);
    }

    async getLastCountClient(req:Request,res:Response){
        let count = await this.adminSalesService.getLastClientId();
        return res.status(200).send({count});
    }

    async getSummaryReportBySeller(req:Request,res:Response){
        let sellerId:string = req.params.sellerId;
        let from = req.query.from;
        let to = req.query.to;
        let type = req.query.type;
        if(type=="pdf"){
            let report = await this.adminSalesService.getSummaryReportBySellerPDF(sellerId,from,to);
            let date = new Date();
            date.setHours(date.getHours()-5);
            let dateString = this.parseDate(date);
        pdf.create(report, {
            format: 'Legal',
            header: {
                height: "30px"
            },
            footer: {
                height: "22mm",
                contents:{
                default: `<span style="text-align:center">Fecha de impresión: ${dateString}</span>`
                }
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=resumenVendedor_${from}-${to}.pdf`
            });
            stream.pipe(res);
        }));
        }else{
        let workbook:any =await this.adminSalesService.getSummaryReportBySeller(sellerId,from,to);
        workbook.write(`ResumenVendedor${from}-${to}.xlsx`,res);
        }
    }

    async getAllClientsToAdminSales(req:Request,res:Response){
        let clients = await this.adminSalesService.getAllClients();
        return res.status(200).send(clients);
    }   

    async getAllProductsToAdminSales(req:Request,res:Response){
        let products = await this.adminSalesService.getAllProductsWithPresentations();
        return res.status(200).send(products);
    }

    async getGeneralReportSales(req:Request,res:Response){
        let dateStart=req.query.dateStart;
        let dateEnd = req.query.dateEnd;
        let workbook:any= await this.adminSalesService.getGeneralReportSales(dateStart,dateEnd,req.body);
        console.log("Retornando reporte");
        workbook.write(`ReporteGeneral.xlsx`,res);
    }

    async getGeneralChartDataSales(req:Request,res:Response){
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let response:ChartD3DataInterface[]=await this.adminSalesService.getGeneralChartDataSales(dateStart,dateEnd);
        return res.status(200).send(response);
    }

    async getMetricsRankingSellers(req:Request,res:Response){
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let response:RankingSeller[] =await this.adminSalesService.getMetricsRankingSellerByDate(dateStart,dateEnd);
        return res.status(200).send(response);
    }

    async getMetricsRankingSellersByProduct(req:Request,res:Response){
        let dateStart:string =req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let presentationId:number = +req.params.presentationId;
        let response:RankingSellerByProduct[]=await this.adminSalesService.getMetricsRankingSellersByProduct(presentationId,dateStart,dateEnd);
        return res.status(200).send(response);
    }

    async getGeneralChartDataSalesReport(req:Request,res:Response){
        let type:string = req.query.type;
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        if(type=="pdf"){
            let report:string = await this.adminSalesService.getGeneralChartDataSalesReportPdf(dateStart,dateEnd);
            let date = new Date();
                date.setHours(date.getHours()-5);
                let dateString = this.parseDate(date);
            pdf.create(report, {
                format: 'Legal',
                header: {
                    height: "30px"
                },
                footer: {
                    height: "22mm",
                    contents:{
                    default: `<span style="text-align:center">Fecha de impresión: ${dateString}</span>`
                    }
              },
            }).toStream((function (err, stream) {
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'responseType': 'blob',
                    'Content-disposition': `attachment; filename=ranking_productos_${dateStart}-${dateEnd}.pdf`
                });
                stream.pipe(res);
            }));
        }else {
            let workbook:any = await this.adminSalesService.getGeneralChartDataSalesReportExcel(dateStart,dateEnd)
            workbook.write(`ranking_productos_${dateStart}-${dateEnd}.xlsx`,res);
        }    
    }

    async getMetricsrReportRankingSellersByProduct(req:Request,res:Response){
        let type:string = req.query.type;
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let presentationId:number = +req.params.presentationId;
        if(type=="pdf"){
            let report:string=await this.adminSalesService.getMetricsRankingReportSellersByProductPdf(presentationId,dateStart,dateEnd);
            let date = new Date();
                date.setHours(date.getHours()-5);
                let dateString = this.parseDate(date);
            pdf.create(report, {
                format: 'Legal',
                header: {
                    height: "30px"
                },
                footer: {
                    height: "22mm",
                    contents:{
                    default: `<span style="text-align:center">Fecha de impresión: ${dateString}</span>`
                    }
              },
            }).toStream((function (err, stream) {
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'responseType': 'blob',
                    'Content-disposition': `attachment; filename=ranking_productos_${dateStart}-${dateEnd}.pdf`
                });
                stream.pipe(res);
            }));
        }else{
            let workbook=await this.adminSalesService.getMetricsRankingReportSellersByProductExcel(presentationId,dateStart,dateEnd);
            workbook.write(`ranking_vendedores_${dateStart}-${dateEnd}.xlsx`,res);
        }
    }

    parseDate(date:Date){
        let month = (date.getMonth()+1).toString();
        if(+month<10) month="0"+month;
        let day = date.getDate().toString();
        if(+day<10) day="0"+day;
        let typeHours = date.getHours()>12?"pm":"am";
        return `${date.getFullYear()}-${month}-${day} ${date.getHours()}:${date.getMinutes()} ${typeHours}`;
    }

    async getReportMetricsRankingSellers(req:Request,res:Response){
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let type:string = req.query.type;
        if(type=="pdf"){
            let report = await this.adminSalesService.getReportMetricsRankingSellerByDatePDF(dateStart,dateEnd);
            let date = new Date();
                date.setHours(date.getHours()-5);
                let dateString = this.parseDate(date);
            pdf.create(report, {
                format: 'Legal',
                header: {
                    height: "30px"
                },
                footer: {
                    height: "22mm",
                    contents:{
                    default: `<span style="text-align:center">Fecha de impresión: ${dateString}</span>`
                    }
              },
            }).toStream((function (err, stream) {
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'responseType': 'blob',
                    'Content-disposition': `attachment; filename=ranking_vendedores_${dateStart}-${dateEnd}.pdf`
                });
                stream.pipe(res);
            }));
        }else{
            let workbook = await this.adminSalesService.getReportMetricsRankingSellerByDateEXCEL(dateStart,dateEnd)
            workbook.write(`ranking_vendedores_${dateStart}-${dateEnd}.xlsx`,res);
        }
    }

    async updateStatusSincronizedClient(req:Request,res:Response){
        await this.adminSalesService.updateClientSincronized(req.body);
        return res.status(204).send();
    }

    async getDataInitial(req:Request,res:Response){
        let sellerId:string = req.params.sellerId;
        let date:string = req.query.date;
        let response:OfflineNewVersionResponse=await this.adminSalesService.getOfflineNewVersion(sellerId,date);
        return res.status(200).send(response);
    }

    async cancelReactivateSale(req:Request,res:Response){
        let saleId:number = +req.params.saleId;
        await this.adminSalesService.cancelReactivate(saleId);
        return res.status(204).send();
    }

    async reportTypeSales(req:Request,res:Response){
        let format:string = req.body.format;
        let type:string = req.body.type;
        let sellers:string[] = req.body.sellers;
        let dateStart:string = req.query.dateStart;
        let dateEnd:string=req.query.dateEnd;
        if(format=="pdf"){
            let report = await this.adminSalesService.getReportPdfSalesTypes(type,sellers,dateStart,dateEnd);
            pdf.create(report, {
                format: 'Legal',
                header: {
                    height: "30px"
                }
              
            }).toStream((function (err, stream) {
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'responseType': 'blob',
                    'Content-disposition': `attachment; filename=repoteDeVentas.pdf`
                });
                stream.pipe(res);
            }));
        }else{
            let workbook = await this.adminSalesService.getReportExcelSalesTypes(type,sellers,dateStart,dateEnd);
            workbook.write(`REPORTE_DE_VENTAS.xlsx`,res);
        }
    }

    async setUserToken(req:Request,res:Response){
        let uid = req.params.uid as string;
        await this.adminSalesService.setTokenToUser(uid,req.body.token);
        return res.status(204).send();
    }
    async deleteUserToken(req:Request,res:Response){
        let uid = req.params.uid as string;
        await this.adminSalesService.setTokenToUser(uid,null);
        return res.status(204).send();
    }
    async getCancelationsRequest(req:Request,res:Response){
        let type=req.query.type as string;
        let dateStart:string = req.query.dateStart as string;
        let dateEnd:string = req.query.dateEnd as string;
        let response:CancelRequest[] = await this.adminSalesService.getAllCancelRequests(type,dateStart,dateEnd);
        return res.status(200).send(response);
    }
    async updateCancelRequest(req:Request,res:Response){
        let saleId:number = +req.params.saleId;
        if(!req.query.status) throw new Error("[400], falta el parametro status");
        if(!req.query.adminId) throw new Error("[400], falta el parametro adminId");
        let status:string = req.query.status;
        let adminId:string = req.query.adminId;
        await this.adminSalesService.adminSaleChangeStatus(saleId,status,adminId);
        return res.status(204).send();
    }

    async getAllProductsRoviandaCatalog(req:Request,res:Response){
        let hint = req.body.hint;
        let products:AdminProductsCatalog[]= await this.adminSalesService.getAllProductsRovianda(hint);
        return res.status(200).send(products);
    }

    async getPreregisterProduct(req:Request,res:Response){
        let code = req.query.code;
        let response: AdminPreRegisterProductDetails=await this.adminSalesService.getPreregisterProduct(code);
        return res.status(200).send(response);
    }
    async registerPreRegisterProduct(req:Request,res:Response){
        await this.adminSalesService.registerPreRegisterProduct(req.body);
        return res.status(201).send();
    }

    async updatePreRegisterProduct(req:Request,res:Response){
        let presentationId:number = +req.params.presentationId;
        await this.adminSalesService.updatePreRegisterProduct(presentationId,req.body);
        return res.status(204).send();
    }   
}
