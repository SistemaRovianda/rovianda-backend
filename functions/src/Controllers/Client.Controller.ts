import { Request, Response } from "express";
import { FirebaseHelper } from "../Utils/Firebase.Helper";
import { ClientService } from "../Services/Client.Service";
import PdfHelper from '../Utils/Pdf.Helper';
import * as pdf from 'html-pdf';
import { ClientItemBySeller, ClientVisitBySellerRecord, ClientVisitData } from "../Models/DTO/Client.DTO";
import { User } from "../Models/Entity/User";
import { UserRepository } from "../Repositories/User.Repository";
import { UserService } from "../Services/User.Service";
import ExcelHelper from '../Utils/Excel.Helper';
export class ClientController{
    private clientService: ClientService;
    private pdfHelper:PdfHelper;
    private userService:UserService;
    private excelHelper:ExcelHelper;
    constructor(){
        this.clientService = new ClientService();
        this.pdfHelper = new PdfHelper();
        this.userService = new UserService(null);
        this.excelHelper = new ExcelHelper();
    }

    async createCustomer(req: Request, res: Response){
        await this.clientService.createCustomer(req);
        return res.status(201).send();
    }

    async getCustomerCount(req:Request,res:Response){
        return res.status(200).send({clientCode:await this.clientService.getCurrentCountCustomer()});
    }

    async createSellerCustomer(req:Request,res:Response){
        return res.status(201).send({clientId:await this.clientService.createSellerCustomer(req.body)});
    }

    async getClientByKey(req:Request,res:Response){
        let key:string = req.params.key;
        return res.status(200).send(await this.clientService.getClientByKey(key));
    }

    async getScheduleCustomerBySeller(req:Request,res:Response){
        let sellerUid = req.query.sellerUid;
        let date = req.query.date;
        return res.status(200).send(await this.clientService.getScheduleByDate(sellerUid,date));
    }

    /*async createVisitToClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        await this.clientService.createVisit(clientId);
        return res.status(201).send();
    }*/

    async endVisitToClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        await this.clientService.endVisitToClient(clientId);
        return res.status(204).send();
    }

   async deleteClient(req:Request,res:Response){
        let clientId:number = +req.params.id;
        await this.clientService.deleteClientById(clientId);
        return res.status(204).send();
   }

   async updateKeySaeClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        let code=req.body.code;
        await this.clientService.updateKeyClient(clientId,code);
        return res.status(204).send();
   }

   async searchClientByCodeSae(req:Request,res:Response){
        let code:number = +req.params.code ;
        let clientDetails = await this.clientService.searchClientInSae(code);
        return res.status(200).send(clientDetails);
   }
   async customerReassign(req:Request,res:Response){
        
        if(!req.body.sellerUid) throw new Error("[400],param sellerUid is required");
        if(!req.body.clientId) throw new Error("[400], param clientId is required");
        let sellerUid:string = req.body.sellerUid;
        let clientId:number = req.body.clientId;
        await this.clientService.customerReassign(clientId,sellerUid);
        res.status(204).send();
   }
   async getCustomerReportBySeller(req:Request,res:Response){
    let sellerId:string = req.query.sellerId as string;
    let format:string = req.query.format as string;
    let seller:User = await this.userService.getUserByUid(sellerId);
    let type:string = req.query.type as string;
    let hint:string = req.query.hint as string;
    let customers:ClientItemBySeller[] = await this.clientService.getCustomerReportBySeller(sellerId,type,hint);
    if(format=="PDF"){
        let report = await this.pdfHelper.getCustomerReportBySeller(seller,customers);
        pdf.create(report, {
            format: 'Legal',
            header: {
                height: "30px"
            },
            footer: {
                height: "22mm"
        },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteSecos.pdf`
            });
            stream.pipe(res);
        }));
    }else if(format=="EXCEL"){
        let workbook:any = this.excelHelper.getCustomerReportBySeller(seller,customers);
        workbook.write(`entrada.xlsx`,res);
    }else{
        return res.status(400).send({msg:"Formato no valido"});
    }   
   }

   async registerCustomerV2(req:Request,res:Response){
        let response:{clientId:number,clientMobileId:number}= await this.clientService.createCustomerV2(req.body);
        res.status(200).send(response);    
   }
   async registerCustomerV2Arr(req:Request,res:Response){
    let response:{clientId:number,clientMobileId:number}[]= await this.clientService.createCustomerV2Arr(req.body);
    res.status(200).send(response);    
}
   async synchronizationCustomersV2(req:Request,res:Response){
        let response:{clientId:number,clientMobileId:number}[]= await this.clientService.synchronizationCustomersV2(req.body);
        res.status(200).send(response);    
   }
   async updateCustomerV2(req:Request,res:Response){
        let response:{clientId:number}[]= await this.clientService.updateCustomerV2(req.body);
        res.status(200).send(response);
   }
   

   async createVisit(req:Request,res:Response){
        let response:{clientId:number,date:string}[]=await this.clientService.createVisit(req.body);
        res.status(200).send(response);
   }

   async getVisitsBySellerAndDate(req:Request,res:Response){
        let response:ClientVisitData[] = await this.clientService.getVisitsBySellerAndDate(req.body);
        res.status(200).send(response);
   }
   async getVisitsBySellerAndDateReport(req:Request,res:Response){
    let book= await this.clientService.getReportOfVisitsBySeller(req.body);
    book.write("ReporteVisitasDelDia.xlsx",res);
    }
    
}
