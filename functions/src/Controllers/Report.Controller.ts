import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { EntranceDriefService } from '../Services/Entrance.Drief.Service';
import { UserService } from '../Services/User.Service';
import { User } from '../Models/Entity/User';
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import { Formulation } from '../Models/Entity/Formulation';
import PdfHelper from '../Utils/Pdf.Helper';
import * as pdf from 'html-pdf';
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';
import { EntranceMeatService } from '../Services/Entrances.Meat.Services';
import { EntrancePackingService } from '../Services/Entrance.Packing.Service';
import { FormulationService } from '../Services/Formulation.Service';
import { FormulationIngredients } from '../Models/Entity/Formulation.Ingredients';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
import { WarehouseDriefService } from '../Services/Warehouse.Drief.Service';
import { EntrancePacking } from '../Models/Entity/Entrances.Packing';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenService } from '../Services/Oven.Service';
import { RevisionOvenProductService } from '../Services/Revision.Oven.Product.Service';
import { RevisionsOvenProducts } from '../Models/Entity/Revisions.Oven.Products';

export class ReportController{

    private entranceDriefService: EntranceDriefService;
    private entranceMeatService:EntranceMeatService;
    private userService: UserService;
    private formulationService: FormulationService
    private warehouseDriefService: WarehouseDriefService;
    private entrancePackingService: EntrancePackingService;
    private ovenService:OvenService;
    private revisionOvenProductService:RevisionOvenProductService;
    private pdfHelper: PdfHelper;
    constructor(private firebaseInstance:FirebaseHelper){
        this.entranceDriefService = new EntranceDriefService(this.firebaseInstance);
        this.entranceMeatService = new EntranceMeatService(this.firebaseInstance);
        this.userService = new UserService(this.firebaseInstance);
        this.formulationService = new FormulationService();
        this.warehouseDriefService = new WarehouseDriefService();
        this.entrancePackingService = new EntrancePackingService();
        this.ovenService = new OvenService();
        this.revisionOvenProductService = new RevisionOvenProductService();
        this.pdfHelper = new PdfHelper();
    }

    async reportEntranceDrief(req:Request, res:Response){ 
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let drief:EntranceDrief = await this.entranceDriefService.reportEntranceDrief(+req.params.driefId);
        let report = await this.pdfHelper.reportEntranceDrief(user,drief);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "0in", // default is 0, units: mm, cm, in, px
                right: "1in",
                bottom: "2in",
                left: "2cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteSecos.pdf`
            });
            stream.pipe(res);
        }))
    }

    async reportFormulation(req:Request, res:Response){
        let formulation:Formulation = await this.formulationService.reportFormulation(+req.params.formulationId);
        let formulationIngredents:FormulationIngredients[] = await this.formulationService.reportFormulationIngredents(+req.params.formulationId)
        let report = await this.pdfHelper.reportFormulation(formulation,formulationIngredents);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "0in", // default is 0, units: mm, cm, in, px
                right: "1in",
                bottom: "2in",
                left: "2cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteFormulacion.pdf`
            });
            stream.pipe(res);
        }))
    }
  
  async reportEntranceMeat(req:Request, res:Response){ 
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let meat:EntranceMeat = await this.entranceMeatService.reportEntranceMeat(+req.params.meatId);
        let report = await this.pdfHelper.reportEntranceMeat(user,meat);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "2cm", 
                right: "2cm",
                bottom: "2cm",
                left: "2cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteCarnicos.pdf`
            });
            stream.pipe(res);
        }))
    }

    async reportEntrancePacking(req:Request, res:Response){
        let packin:EntrancePacking = await this.entrancePackingService.getReportPacking(+req.params.pakingId);
        let report = await this.pdfHelper.reportEntrancePacking(packin);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "0in",
                right: "1in",
                bottom: "2in",
                left: "2cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteEmpaquetado.pdf`

            });
            stream.pipe(res);
        }))
    }
  
    async reportWarehouseDrief(req:Request, res:Response){
        let dateInit = req.query.initDate;
        let dateEnd = req.query.finalDate;
        let data:WarehouseDrief[] = await this.warehouseDriefService.getDataReport(dateInit,dateEnd);
        let report = await this.pdfHelper.reportWarehouseDrief(data);
        pdf.create(report, {
            format: 'Letter',
            orientation: "landscape",
            border: {
                top: "2cm", 
                right: "2cm",
                bottom: "2cm",
                left: "2cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reportAlmacenSecos.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportOven(req:Request, res:Response){
        let revisionOven:OvenProducts = await this.ovenService.getDataReport(req.params.ovenId);
        let dataRevision:RevisionsOvenProducts[] = await this.revisionOvenProductService.getDataReport(revisionOven.id);
        let userElaborated:User= await this.userService.getUserByName(revisionOven.nameElaborated);
        let userVerify:User= await this.userService.getUserByName(revisionOven.nameVerify);
        let report = await this.pdfHelper.reportOven(userElaborated,userVerify,revisionOven,dataRevision);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "1cm", 
                right: "2cm",
                bottom: "2cm",
                left: "2cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteHornos.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportEntryDriefByDates(req:Request, res:Response){
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let entrysDriefs:EntranceDrief[] = await this.entranceDriefService.reportEntrancesDriefs(dateInit,dateEnd);
        let report = await this.pdfHelper.reportEntryDriefs(user,entrysDriefs);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "1cm", 
                right: "1cm",
                bottom: "2cm",
                left: "1cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteEntradaSecos.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportEntryMeatByDates(req:Request, res:Response){
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let entrysMeats:EntranceMeat[] = await this.entranceMeatService.reportEntrancesMeats(dateInit,dateEnd);
        let report = await this.pdfHelper.reportEntryMeats(user,entrysMeats);
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
                'Content-disposition': `attachment; filename=reporteEntradaCarnicos.pdf`
            });
            stream.pipe(res);
        }));
    }


    async reportEntryPackingByDates(req:Request, res:Response){
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let entrysPacking:EntrancePacking[] = await this.entrancePackingService.getReportEntrysPacking(dateInit,dateEnd);
        let report = await this.pdfHelper.reportEntryPacking(user,entrysPacking);
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
                'Content-disposition': `attachment; filename=reporteEntradaPaquetes.pdf`
            });
            stream.pipe(res);
        }));
    }
}