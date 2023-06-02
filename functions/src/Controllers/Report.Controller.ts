import {Request,Response, request} from 'express';
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
import { Process } from '../Models/Entity/Process';
import { ProcessService } from '../Services/Process.Service';
import { Conditioning } from '../Models/Entity/Conditioning';
import { ConditioningService } from '../Services/Conditioning.Service';
import { Sausaged } from '../Models/Entity/Sausaged';
import { Tenderized } from '../Models/Entity/Tenderized';
import { SausagedService } from '../Services/Sausaged.Service';
import { TenderizedService } from '../Services/Tenderized.Service';
import Excel4Node from "../Utils/Excel.Helper" 
import * as os from "os";
import * as fs from "fs";
const fsP =require("fs-path");
const multer = require("multer");
const pdfMergeL = require('easy-pdf-merge');
import { Packaging } from '../Models/Entity/Packaging';
import { PackagingService } from '../Services/Packaging.Service';
import { ProductRoviandaService } from '../Services/Product.Rovianda.Service';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import _ = require('lodash');
import { DryingLabel } from '../Models/Entity/Dryng.Label';
import { DryngLabelService } from '../Services/Dring.Label.Service';
import { ProductService } from '../Services/Product.Services';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { OutputsCoolingRepository } from '../Repositories/Outputs.Cooling.Repository';
import { Defrost } from '../Models/Entity/Defrost';
import { DefrostRepository } from '../Repositories/Defrost.Repository';
import { DefrostFormulationRepository } from '../Repositories/DefrostFormulation.Repository';
import { FormulatioIngredientsRepository } from '../Repositories/Formulation.Ingredients.Repository';
import { PropertiesPackagingRepository } from '../Repositories/Properties.Packaging.Repository';
import { InspectionRepository } from '../Repositories/Inspection.Repository';
import { Inspection } from '../Models/Entity/Inspection';
import { EndedProductReport } from '../Utils/componentsReports/endedProductReports';
import {DeliveredProductWarehouse} from "../Utils/componentsReports/DeliveredProductWarehouse";
import ExcelHelper from '../Utils/Excel.Helper';
import { WarehouseDriefRepository } from '../Repositories/Warehouse.Drief.Repository';
import { SellerClientScheduleData, SellerVisit } from '../Models/SellerReportRequests';
import { ReportService } from '../Services/Report.Service';
const pdfMerger = require("pdf-merger-js");
export class ReportController{

    private entranceDriefService: EntranceDriefService;
    private entranceMeatService:EntranceMeatService;
    private userService: UserService;
    private formulationService: FormulationService
    private warehouseDriefService: WarehouseDriefService;
    private entrancePackingService: EntrancePackingService;
    private ovenService:OvenService;
    private revisionOvenProductService:RevisionOvenProductService;
    private processService:ProcessService;
    private conditioningService:ConditioningService;
    private sausagedService:SausagedService;
    private tenderizedService:TenderizedService;
    private packagingService:PackagingService;
    private productRoviandaService:ProductRoviandaService;
    private dryingLabelService: DryngLabelService;
    private productService: ProductService;
    private pdfHelper: PdfHelper;
    private excel: Excel4Node;
    private excelHelper:ExcelHelper;
    private  outputCoolingRepository:OutputsCoolingRepository;
    private defrostRepository:DefrostRepository;
    private defrostFormulationRepository:DefrostFormulationRepository;
    private formulationIngredientsRepository:FormulatioIngredientsRepository;
    private propertiesPackagingRepository:PropertiesPackagingRepository;
    private inspectionRepository:InspectionRepository;
    private endedProductReports: EndedProductReport; 
    private deliveredProductWarehouse: DeliveredProductWarehouse;
    private warehouseDriefRepository:WarehouseDriefRepository;
    private reportService:ReportService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.entranceDriefService = new EntranceDriefService(this.firebaseInstance);
        this.entranceMeatService = new EntranceMeatService(this.firebaseInstance);
        this.userService = new UserService(this.firebaseInstance);
        this.formulationService = new FormulationService();
        this.warehouseDriefService = new WarehouseDriefService();
        this.entrancePackingService = new EntrancePackingService();
        this.ovenService = new OvenService();
        this.revisionOvenProductService = new RevisionOvenProductService();
        this.processService = new ProcessService(this.firebaseInstance);
        this.conditioningService = new ConditioningService();
        this.sausagedService = new SausagedService();
        this.tenderizedService = new TenderizedService();
        this.packagingService = new PackagingService();
        this.productRoviandaService = new ProductRoviandaService(this.firebaseInstance);
        this.dryingLabelService = new DryngLabelService();
        this.productService = new ProductService();
        this.pdfHelper = new PdfHelper();
        this.excel = new Excel4Node();
        this.defrostRepository = new DefrostRepository();
        this.defrostFormulationRepository = new DefrostFormulationRepository();
        this.outputCoolingRepository = new OutputsCoolingRepository();
        this.formulationIngredientsRepository = new FormulatioIngredientsRepository();
        this.propertiesPackagingRepository = new PropertiesPackagingRepository();
        this.inspectionRepository = new InspectionRepository();
        this.endedProductReports = new EndedProductReport();
        this.deliveredProductWarehouse = new DeliveredProductWarehouse();
        this.excelHelper=new ExcelHelper();
        this.warehouseDriefRepository = new WarehouseDriefRepository();
        this.reportService = new ReportService();
    }

    async reportEntranceDrief(req:Request, res:Response){ 
        let warehouseDrief= await this.warehouseDriefRepository.getWarehouseDriefByWarehouseDriefId(+req.params.driefId);
        let drief:EntranceDrief = await this.entranceDriefService.getEntranceDriefByWarehouseDrief(warehouseDrief);
        let userId: string = warehouseDrief.userId;
        let user:User = await this.userService.getUserByUid(userId);
        let report = await this.pdfHelper.reportEntranceDrief(user,drief);
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
        }))
    }

    async reportDryinById(req: Request, res: Response){
        let { dryingId } = req.params;
        let drying: DryingLabel = await this.dryingLabelService.getDryngById(+dryingId);
        let product = await this.productRoviandaService.getById(+drying.productId);
        let report = this.pdfHelper.reportDryingLaberById(product, drying);
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
                'Content-disposition': `attachment; filename=reporte-drying.pdf`
            });
            stream.pipe(res);
        }))


    }

    async reportFormulation(req:Request, res:Response){
        let formulation:Formulation = await this.formulationService.reportFormulation(+req.params.formulationId);
        let formulationIngredents:FormulationIngredients[] = await this.formulationService.reportFormulationIngredents(+req.params.formulationId)
        let report = await this.pdfHelper.reportFormulation(formulation,formulationIngredents);
        pdf.create(report, {
            format: 'Legal',
            orientation:"landscape",
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
                'Content-disposition': `attachment; filename=reporteFormulacion.pdf`
            });
            stream.pipe(res);
        }))
    }

    async reportDocumentFormulation(req:Request, res:Response){
        let tmp = os.tmpdir();
        
        let formulation:Formulation = await this.formulationService.reportFormulation(+req.params.formulationId);
        let formulationIngredents:FormulationIngredients[] = await this.formulationService.reportFormulationIngredents(+req.params.formulationId)
        
        let workbook = this.excel.generateFormulationDocumentById(formulation, formulationIngredents);
        
        workbook.write(`${tmp}/formulation-report.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="formulation-report.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/formulation-report.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/formulation-report.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        })
    }
  
  async reportEntranceMeat(req:Request, res:Response){ 
        
        let entranceId: number = +req.params.entranceId;
        let meat:EntranceMeat = await this.entranceMeatService.reportEntranceMeat(entranceId);
        let user:User = meat.qualityInspector;
        let report = await this.pdfHelper.reportEntranceMeat(user,meat);
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
                'Content-disposition': `attachment; filename=reporteCarnicos.pdf`
            });
            stream.pipe(res);
        }))
    }

    async reportExcelEntranceMeat(req:Request,res:Response){
        let entranceId: number = +req.params.entranceId;
        let meat:EntranceMeat = await this.entranceMeatService.reportEntranceMeat(entranceId);
        let user:User = meat.qualityInspector;
        let workbook = this.excelHelper.generateEntryMeatDocumentById(user,meat);
        workbook.write(`entrada.xlsx`,res);
    }

    async reportEntrancePacking(req:Request, res:Response){
        let packin:EntrancePacking = await this.entrancePackingService.getReportPacking(+req.params.pakingId);
        let report = await this.pdfHelper.reportEntrancePacking(packin);
        pdf.create(report, {
            format:'Letter',
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
                'Content-disposition': `attachment; filename=reporteEmpaquetado.pdf`

            });
            stream.pipe(res);
        }))
    }
  
    async documentReportEntrancePackingById(req: Request, res: Response){
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let tmp = os.tmpdir(); 
        
        let packing:EntrancePacking = await this.entrancePackingService.getReportPacking(+req.params.pakingId);
    
        let workbook = this.excel.generatePackingDocumentById(user,packing); 
    
        workbook.write(`${tmp}/Reporte-Entrada-Paquetes.xlsx`,(err, stats)=>{ 
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="Reporte-Entrada-Paquetes.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/Reporte-Entrada-Paquetes.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/Reporte-Entrada-Paquetes.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        })
    }

    async reportWarehouseDrief(req:Request, res:Response){
        let dateInit = req.query.initDate;
        let dateEnd = req.query.finalDate;
        let data:WarehouseDrief[] = await this.warehouseDriefService.getDataReport(dateInit,dateEnd);
        let report = await this.pdfHelper.reportWarehouseDrief(data);
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
                'Content-disposition': `attachment; filename=reportAlmacenSecos.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportDocumentWarehouseDrief(req:Request, res:Response){
        let dateInit = req.query.initDate;
        let dateEnd = req.query.finalDate;
        let tmp = os.tmpdir();
        let data:WarehouseDrief[] = await this.warehouseDriefService.getDataReport(dateInit,dateEnd);
        
        let workbook = this.excel.generateReportWarehouseDrief(data); 

        workbook.write(`${tmp}/reporte-almacen-secos.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="reporte-almacen-secos.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/reporte-almacen-secos.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/reporte-almacen-secos.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        })
    }

    async reportOven(req:Request, res:Response){
        let revisionOven:OvenProducts = await this.ovenService.getDataReport(req.params.ovenId);
        let dataRevision:RevisionsOvenProducts[] = await this.revisionOvenProductService.getDataReport(revisionOven.id);
        let report = await this.pdfHelper.reportOven(revisionOven,dataRevision);
        pdf.create(report, {
            format: 'Letter',
            zoomFactor: "0",
            border: {
              top: "1.2cm",
              right: "1cm",
              bottom: "0.5cm",
              left: "1.5cm",
            }
            
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reportOven.pdf`
            });
            stream.pipe(res);
        }));
    }

    async documentReportOvenById(req: Request, res: Response){
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let tmp = os.tmpdir(); 
        
        let revisionOven:OvenProducts = await this.ovenService.getDataReport(req.params.ovenId);
        let dataRevision:RevisionsOvenProducts[] = await this.revisionOvenProductService.getDataReport(revisionOven.id);
    
        let workbook = this.excel.generateOvenProductsDocumentsById(revisionOven,dataRevision); 
    
        workbook.write(`${tmp}/Reporte-Horno.xlsx`,(err, stats)=>{ 
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="Reporte-Horno.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/Reporte-Horno.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/Reporte-Horno.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        })
    }
    
    async reportFormulationByDate(req: Request, res:Response){
        let dateInit = req.params.dateInit;
        let dateEnd = req.params.dateEnd;
        let entranceId:number = +req.params.entranceId;
        let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,dateInit,dateEnd);
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
            
            let ingredientes:FormulationIngredients[] = await this.formulationIngredientsRepository.getByFormulation(defrostF.formulation);
            defrostF.formulation.ingredients=ingredientes;
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        
    
        let html = this.pdfHelper.generateFormulationReport(formulations);
        pdf.create(html, {
            orientation:"landscape",
            format: 'Legal',
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
                'Content-disposition': `attachment; filename=reportFormulation.pdf`
            });
            stream.pipe(res);
        }));
    }
//crear proceso tomar lote interno

//regresar por tipo de area
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
            format: 'Legal',
            border: {
                top: "1cm", 
                right: "1cm",
                bottom: "1cm",
                left: "1cm"
            },
            footer: {
                height: "10mm",
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

    async reportDocumentEntryMeatByDates(req:Request, res:Response){
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let tmp = os.tmpdir();
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let entrysMeats:EntranceMeat[] = await this.entranceMeatService.reportEntrancesMeats(dateInit,dateEnd);
        let workbook =  this.excel.generateEntryMeatsDocumentByDate(user,entrysMeats);

        workbook.write(`${tmp}/entry-meat-report.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="entry-meat-report.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/entry-meat-report.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/entry-meat-report.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            });
        });
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

    async reportOvenByDates(req:Request, res:Response){
        
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let entranceId:number = +req.params.entranceId;
        let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,dateInit,dateEnd);
        
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        let userMapped = new Map<number,{userVerify:User,userElaborated:User}>();
        let process:Process[] = await this.processService.getProcessWithData(formulations.map(x=>x.id));
        let oven:OvenProducts[] = await this.ovenService.getByProcessIds(process.map(x=>x.id));
        for(let ove of oven){
        let userElaborated:User= await this.userService.getUserByName(ove.nameElaborated);
        let userVerify:User= await this.userService.getUserByName(ove.nameVerify);
        let revisions:RevisionsOvenProducts[] = await this.revisionOvenProductService.getRevisionByOven(ove);
        ove.revisions=revisions;
        userMapped.set(ove.id,{userElaborated,userVerify});
        }
        let report = await this.pdfHelper.reportOvenProducts(userMapped,oven);
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
                'Content-disposition': `attachment; filename=reporteHornos.pdf`
            });
            stream.pipe(res);
        }));
    }

    async documentReportOvenByDates(req:Request, res:Response){
        let tmp = os.tmpdir();
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let entranceId:number = +req.params.entranceId;
        let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,dateInit,dateEnd);
        
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        let process:Process[] = await this.processService.getProcessWithData(formulations.map(x=>x.id));
        let oven:OvenProducts[] = await this.ovenService.getByProcessIds(process.map(x=>x.id));
        for(let ove of oven){
            let revisions = await this.revisionOvenProductService.getRevisionByOven(ove);
            ove.revisions= revisions;
        }
        let workbook = this.excel.generateOvenProductsDocumentsByDate(oven); 
        console.log(oven);

        workbook.write(`${tmp}/oven-products-report.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="oven-products-report.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/oven-products-report.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/oven-products-report.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        })

        
    }

    async getReportByPackaging(req:Request,res:Response){
        let dateInit = req.params.dateInit;
        let dateEnd = req.params.dateEnd;
        let entranceId:number = +req.params.entranceId;
        let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,dateInit,dateEnd);
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        let process:Process[] = await this.processService.getProcessWithData(formulations.map(x=>x.id));
        let oven:OvenProducts[] = await this.ovenService.getByProcessIds(process.map(x=>x.id));
        let ovenLots =  oven.map(x=>x.newLote);
        let packaging:Packaging[] = await this.packagingService.getPackgingByLotsIds(ovenLots);
        for(let pack of packaging){
            let packagingDetails = await this.packagingService.getPackagingById(pack.id);
            pack.productId = packagingDetails.productId;
            let properties: PropertiesPackaging[] = await this.packagingService.getPackagingPropertiesById(pack);
            
            pack.propertiesPackaging = properties;
        }
        let report = await this.pdfHelper.reportPackagings(packaging);
        
        pdf.create(report, {
            format: 'Legal',
            orientation:'landscape',
            border: {
                top: "2cm", 
                right: "2cm",
                bottom: "1cm",
                left: "2cm"
            }
            
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteEmpaquetadoPDF.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportProcess(req:Request, res:Response){
        let process:Process = await this.processService.getProcessById(+req.params.processId);
                    
        let report = await this.pdfHelper.reportProcess(process);
        pdf.create(report, {
            format: 'legal',
            orientation:`landscape`,
            header: {
                height: ".5cm"
            },
            footer: {
                height: ".5cm"
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteProceso.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportProcessByEntranceId(req:Request,res:Response){
        let dateStart=req.query.dateStart;
        let dateEnd=req.query.dateEnd;
        let entranceId=req.query.entranceId;
        let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,dateStart,dateEnd);
        
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        let process:Process[] = await this.processService.getProcessWithData(formulations.map(x=>x.id));
        let report = await this.pdfHelper.reportProcessByEntranceId(process);
        pdf.create(report, {
            format: 'legal',
            orientation:`landscape`,
            header: {
                height: ".5cm"
            },
            footer: {
                height: ".5cm"
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteProceso.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportDocumentProcess(req:Request, res:Response){
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let entranceId:number = req.query.entranceId;
        let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,dateStart,dateEnd);
        
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        let process:Process[] = await this.processService.getProcessWithData(formulations.map(x=>x.id));
        let tmp = os.tmpdir();
                                                                   
        let workbook = this.excel.generateReportProcess(process); 
        workbook.write(`${tmp}/Reporte-procesos.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="Reporte-procesos.xlsx"'
            );
            res.setHeader("Content-Type", "application/vnd.ms-excel");
            res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/Reporte-procesos.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/Reporte-procesos.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        });
    }

    async documentReportFormulationByDates(req: Request, res: Response){
        let entranceId:number = +req.params.entranceId;
        let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let {iniDate, finDate} = req.params;
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,iniDate,finDate);
        
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
                let ingredients = await this.formulationIngredientsRepository.getByFormulation(defrostF.formulation);
                defrostF.formulation.ingredients=ingredients;
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        let tmp = os.tmpdir(); //se obtiene la carpeta temporal ya que las cloudfunctions solo permiten escritura en carpeta tmp

        

        let workbook = this.excel.generateFormulationDocumentByDates(formulations); // se llama a la utileria con los mismos datos que se envian al reporte html

        workbook.write(`${tmp}/formulation-report.xlsx`,(err, stats)=>{//workbook escribe y permite un callback
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",//se pone un tipo de cabecera
                'inline; filename="formulation-report.xlsx"'//para indicar a front el nombre del archivo
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");// se añade cabecera para permitir excel
              res.status(200); 
            console.log(stats);//stats solo trae informacion de la creacion del archivo
            return res.download(`${tmp}/formulation-report.xlsx`,(er) =>{ //response.download manda un documento para ser descargado en el response
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/formulation-report.xlsx"}`);//aunque en la carpeta tmp no sea necesario eliminar archivos es mejor hacerlo para no aumentar el peso de las cloud functions    
                fs.unlinkSync(`${tmp}/imageTmp.png`);//borrar aqui la imagen temporal si no, dara error al generar el documento y no encontrar la imagen
            })
        })
    }

    async getReportEndedProduct(req:Request,res:Response){
        let dateInit:string = req.params.dateInit;
        let dateEnd:string = req.params.dateEnd;
        let entranceId:number = +req.params.entranceId;
        let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,dateInit,dateEnd);
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        let process:Process[] = await this.processService.getProcessWithData(formulations.map(x=>x.id));
        let ovenProducts = await this.ovenService.getByProcessIdsAndStatus(process.map(x=>x.id),"CLOSED");
        let itemsToReport:{ovenProduct:OvenProducts,inspection:Inspection[]}[] =[]; 
        for(let oven of ovenProducts){
            let inspection:Inspection[] = await this.inspectionRepository.getByProcessId(oven.processId);
            if(inspection){
                itemsToReport.push({ovenProduct:oven,inspection});
            }
        }
        
        let report =await this.endedProductReports.getReportOfEndedProduct(itemsToReport);
        pdf.create(report, {
            format: 'Legal',
            orientation:'landscape',
            border: {
                top: "2cm", 
                right: "2cm",
                bottom: "1cm",
                left: "2cm"
            }
            
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteEmpaquetadoPDF.pdf`
            });
            stream.pipe(res);
        }));
    }

    async getReportDocumentEndedProduct(req:Request,res:Response){
        let dateInit:string = req.params.dateInit;
        let dateEnd:string = req.params.dateEnd;
        let entranceId:number = +req.params.entranceId;
        let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,dateInit,dateEnd);
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        let process:Process[] = await this.processService.getProcessWithData(formulations.map(x=>x.id));
        let ovenProducts = await this.ovenService.getByProcessIdsAndStatus(process.map(x=>x.id),"CLOSED");
        let itemsToReport:{ovenProduct:OvenProducts,inspection:Inspection[]}[] =[]; 
        for(let oven of ovenProducts){
            let inspection:Inspection[] = await this.inspectionRepository.getByProcessId(oven.processId);
            if(inspection){
                itemsToReport.push({ovenProduct:oven,inspection});
            }
        }
        
        
        let tmp = os.tmpdir(); //se obtiene la carpeta temporal ya que las cloudfunctions solo permiten escritura en carpeta tmp

        
        let workbook = await this.excel.generateEndedProductReportDocument(itemsToReport); // se llama a la utileria con los mismos datos que se envian al reporte html
        workbook.write(`${tmp}/Reportes-salidas-producto-terminado.xlsx`,(err, stats)=>{//workbook escribe y permite un callback
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",//se pone un tipo de cabecera
                'inline; filename="Reportes-salidas-producto-terminado.xlsx"'//para indicar a front el nombre del archivo
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");// se añade cabecera para permitir excel
              res.status(200); 
            console.log(stats);//stats solo trae informacion de la creacion del archivo
            return res.download(`${tmp}/Reportes-salidas-producto-terminado.xlsx`,(er) =>{ //response.download manda un documento para ser descargado en el response
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/Reportes-salidas-producto-terminado.xlsx"}`);//aunque en la carpeta tmp no sea necesario eliminar archivos es mejor hacerlo para no aumentar el peso de las cloud functions    
                fs.unlinkSync(`${tmp}/imageTmp.png`);//borrar aqui la imagen temporal si no, dara error al generar el documento y no encontrar la imagen
            })
        })
    }

    async documentReportPackingByDates(req: Request, res: Response){
        
        let {iniDate, finDate} = req.params;
        let entranceId:number = +req.params.entranceId;
        let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,iniDate,finDate);
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        let process:Process[] = await this.processService.getProcessWithData(formulations.map(x=>x.id));
        let oven:OvenProducts[] = await this.ovenService.getByProcessIds(process.map(x=>x.id));
        let ovenLots =  oven.map(x=>x.newLote);
        let packagings:Packaging[] = await this.packagingService.getPackgingByLotsIds(ovenLots);
        
        for(let pack of packagings){
            let packagingDetails = await this.packagingService.getPackagingById(pack.id);
            pack.productId = packagingDetails.productId;
            let properties: PropertiesPackaging[] = await this.packagingService.getPackagingPropertiesById(pack);
            pack.propertiesPackaging = properties;
        }

        let tmp = os.tmpdir(); //se obtiene la carpeta temporal ya que las cloudfunctions solo permiten escritura en carpeta tmp

        let entrysPacking:EntrancePacking[] = await this.entrancePackingService.getReportEntrysPacking(iniDate,finDate);
        
        let workbook = this.excel.generatePackingDocumentByDates(null,entrysPacking); // se llama a la utileria con los mismos datos que se envian al reporte html

        workbook.write(`${tmp}/Reporte-Empaques.xlsx`,(err, stats)=>{//workbook escribe y permite un callback
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",//se pone un tipo de cabecera
                'inline; filename="Reporte-Empaques.xlsx"'//para indicar a front el nombre del archivo
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");// se añade cabecera para permitir excel
              res.status(200); 
            console.log(stats);//stats solo trae informacion de la creacion del archivo
            return res.download(`${tmp}/Reporte-Empaques.xlsx`,(er) =>{ //response.download manda un documento para ser descargado en el response
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/Reporte-Empaques.xlsx"}`);//aunque en la carpeta tmp no sea necesario eliminar archivos es mejor hacerlo para no aumentar el peso de las cloud functions    
                fs.unlinkSync(`${tmp}/imageTmp.png`);//borrar aqui la imagen temporal si no, dara error al generar el documento y no encontrar la imagen
            })
        })
    }


 async documentReportEntryDriefsByDates(req: Request, res: Response){
    let user:User = await this.userService.getUserByUid(req.query.uid);
    let {iniDate, finDate} = req.params;
    let tmp = os.tmpdir();

    let entrysDriefs:EntranceDrief[] = await this.entranceDriefService.reportEntrancesDriefs(iniDate,finDate);
    
    let workbook = this.excel.generateEntrysDriefsDocumentByDates(user,entrysDriefs); 
    workbook.write(`${tmp}/Reporte-Entrada-Secos.xlsx`,(err, stats)=>{
        if(err){
            console.log(err);
        }
        res.setHeader(
            "Content-disposition",
            'inline; filename="Reporte-Entrada-Secos.xlsx"'
          );
          res.setHeader("Content-Type", "application/vnd.ms-excel");
          res.status(200); 
        console.log(stats);
        return res.download(`${tmp}/Reporte-Entrada-Secos.xlsx`,(er) =>{ 
            if (er) console.log(er);
            fs.unlinkSync(`${tmp+"/Reporte-Entrada-Secos.xlsx"}`);
            fs.unlinkSync(`${tmp}/imageTmp.png`);
        })
    });
  }

  async documentReportEntryMeatById(req: Request, res: Response){
    let user:User = await this.userService.getUserByUid(req.query.uid);
    let tmp = os.tmpdir();

    let entrysMeat:EntranceMeat = await this.entranceMeatService.reportEntranceMeat(+req.params.meatId);
    
    let workbook = this.excel.generateEntryMeatDocumentById(user,entrysMeat); 
    workbook.write(`${tmp}/Reporte-Entrada-Carnicos.xlsx`,(err, stats)=>{
        if(err){
            console.log(err);
        }
        res.setHeader(
            "Content-disposition",
            'inline; filename="Reporte-Entrada-Carnicos.xlsx"'
          );
          res.setHeader("Content-Type", "application/vnd.ms-excel");
          res.status(200); 
        console.log(stats);
        return res.download(`${tmp}/Reporte-Entrada-Carnicos.xlsx`,(er) =>{ 
            if (er) console.log(er);
            fs.unlinkSync(`${tmp+"/Reporte-Entrada-Carnicos.xlsx"}`);
            fs.unlinkSync(`${tmp}/imageTmp.png`);
        })
    });
  }

  async documentReportEntryDriefById(req: Request, res: Response){
    
    let tmp = os.tmpdir();

    let drief:EntranceDrief = await this.entranceDriefService.reportEntranceDrief(+req.params.driefId);
    
    let user:User = await this.userService.getUserByUid(drief.warehouseDrief.userId);
    let workbook = this.excel.generateEntryDriefDocumentById(user,drief); 
    workbook.write(`${tmp}/Reporte-Entrada-Secos.xlsx`,(err, stats)=>{
        if(err){
            console.log(err);
        }
        res.setHeader(
            "Content-disposition",
            'inline; filename="Reporte-Entrada-Secos.xlsx"'
          );
          res.setHeader("Content-Type", "application/vnd.ms-excel");
          res.status(200); 
        console.log(stats);
        return res.download(`${tmp}/Reporte-Entrada-Secos.xlsx`,(er) =>{ 
            if (er) console.log(er);
            fs.unlinkSync(`${tmp+"/Reporte-Entrada-Secos.xlsx"}`);
            fs.unlinkSync(`${tmp}/imageTmp.png`);
        })
    });
  }

  async reportPackagingById(req:Request,res:Response){
    let packagingId = req.params.packaginId;

    let packaging:Packaging = await this.packagingService.getPackagingById(+packagingId);
    let properties: PropertiesPackaging[] = await this.packagingService.getPackagingPropertiesById(packaging);
    let report = await this.pdfHelper.reportPackagingById(packaging,properties);
    pdf.create(report, {
        format: 'Legal',
        orientation:'landscape',
        border: {
            top: "2cm", 
            right: "2cm",
            bottom: "1cm",
            left: "2cm"
        }
        
    }).toStream((function (err, stream) {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'responseType': 'blob',
            'Content-disposition': `attachment; filename=reporteEmpaquetadoPDF.pdf`
        });
        stream.pipe(res);
    }));
}

async reportDocumentPackagingById(req:Request,res:Response){
    let dateInit = req.params.dateInit;
    let dateEnd = req.params.dateEnd;
    let entranceId:number = +req.params.entranceId;
    let entrance:EntranceMeat = await this.entranceMeatService.getEntranceMeatById(entranceId);
        let outputsCooling:OutputsCooling[]=await this.outputCoolingRepository.findByLotIdAndDates(entrance.loteInterno,entrance.loteProveedor,dateInit,dateEnd);
        let defrosts:Defrost[] = await this.defrostRepository.getByOutputsIds(outputsCooling.map(x=>x.id));
        
        let formulations:Formulation[] =[];
        let ids = [];
        for(let df of defrosts){
            let defrostF = await this.defrostFormulationRepository.getDefrostFormulationByDefrostWithFormulation(df);
            if(!ids.includes(defrostF.formulation.id)){
            formulations.push(defrostF.formulation);
            ids.push(defrostF.formulation.id);
            }
        }
        let process:Process[] = await this.processService.getProcessWithData(formulations.map(x=>x.id));
        let oven:OvenProducts[] = await this.ovenService.getByProcessIds(process.map(x=>x.id));
        let ovenLots =  oven.map(x=>x.newLote);
        let packagings:Packaging[] = await this.packagingService.getPackgingByLotsIds(ovenLots);
        
        for(let pack of packagings){
            let packagingDetails = await this.packagingService.getPackagingById(pack.id);
            pack.productId = packagingDetails.productId;
            let properties: PropertiesPackaging[] = await this.packagingService.getPackagingPropertiesById(pack);
            pack.propertiesPackaging = properties;
        }
    let tmp = os.tmpdir();
    
    let workbook = this.excel.generatePackagingsDocument(packagings); 
    workbook.write(`${tmp}/Reporte-Rebanado-Empacado.xlsx`,(err, stats)=>{
        if(err){
            console.log(err);
        }
        res.setHeader(
            "Content-disposition",
            'inline; filename="Reporte-Rebanado-Empacado.xlsx"'
          );
          res.setHeader("Content-Type", "application/vnd.ms-excel");
          res.status(200); 
        console.log(stats);
        return res.download(`${tmp}/Reporte-Rebanado-Empacado.xlsx`,(er) =>{ 
            if (er) console.log(er);
            fs.unlinkSync(`${tmp+"/Reporte-Rebanado-Empacado.xlsx"}`);
            fs.unlinkSync(`${tmp}/imageTmp.png`);
        })
    });
}

    async getReportPackagingDelivered(req:Request,res:Response){
        let orderSellerId:number = +req.params.orderSellerId;
        let mode=req.query.mode;
        let report:string = await this.packagingService.getReportOfDeliveredSeller(orderSellerId,mode);
        pdf.create(report, {
            format: 'Legal',
            border: {
                top: "2cm", 
                right: "1cm",
                bottom: "2cm",
                left: "1cm"
            }
            
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteEmpaquetadoAVendedorPDF.pdf`
            });
            stream.pipe(res);
        }));
    }

    async getListOfOrdersSeller(req:Request,res:Response){
        let urgent:boolean = JSON.parse(req.query.urgent);
        let date = req.query.date;
        let type= req.query.type;
        let reports:string[] = await this.packagingService.getReportOrdersOfSeller(urgent,date,type);
        
        let tmp = os.tmpdir();
        if(reports.length>1){
            let merger = new pdfMerger();
        for(let i=0;i<reports.length;i++){
            merger.add((await this.parsePdf(reports[i],i,tmp)) as string);
            //paths.push( );
        }
        await merger.save(tmp+"/ordenes.pdf");
                fs.readFile(tmp+"/ordenes.pdf",(err,buffer)=>{
                    if(err) console.log("Error al escribir");
                    console.log("Lectura correcta");
                    res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'responseType': 'blob',
                        'Content-disposition': `attachment; filename=ordenes.pdf`,
                        'Content-Length':buffer.length
                    });
                    res.end(buffer);
                });
    }else{
        pdf.create(reports[0], {
            format: 'Legal',
            border: {
                top: "2cm", 
                right: "1cm",
                bottom: "2cm",
                left: "1cm"
            }
            
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=ordenes.pdf`
            });
            stream.pipe(res);
        }));
    }
       
    }

    async parsePdf(html:string,index:number,tmp:string){
        return new Promise((resolve,reject)=>{
             pdf.create(html,{
                format: 'Legal',
                border: {
                    top: "2cm", 
                    right: "1cm",
                    bottom: "2cm",
                    left: "1cm"
                }
                
            }).toBuffer((err,buffer)=>{
                if(err) reject(null);
                let date=new Date();
                let path =tmp+`/${date.getTime()}${index}.pdf`;
                fs.writeFile(path,buffer,(err)=>{
                    if(err) reject(null);
                    resolve(path);
                }); 
            });
        });
    }

    async getEntrancesToSellerInventoryByWarehouse(req:Request,res:Response){
        let warehouseId:string = req.params.warehouseId;
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let type:string=req.query.type;
        let format:string = req.query.format;
        let productDelivered = await this.packagingService.getEntrancesOfWarehouseId(warehouseId,dateStart,dateEnd,type);
        let seller:User = await this.userService.getByWarehouseId(warehouseId);
        let report:string ="";
        if(seller){
            report = await this.deliveredProductWarehouse.getReportWarehouseDeliveredBySeller(productDelivered,seller,dateStart,dateEnd,type);
        }else if(+warehouseId==53){
            report = await this.deliveredProductWarehouse.getReportWarehouseDeliveredByPlant(productDelivered,dateStart,dateEnd);
        }else{
            report = "<html><body>NO EXISTE EL USUARIO VENDEDOR</body></html>"
        }
        if(format=="excel"){
            let workbook = this.excel.getReportWarehouseDeliveredBySeller(productDelivered,dateStart,dateEnd,seller.name,type);
            workbook.write(`Reporte-Rebanado-Empacado.xlsx`,res);
        }else if(format=="pdf"){
            pdf.create(report, {
                format: 'Legal',
                orientation: (+warehouseId==53)?"landscape":"portrait",
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
                    'Content-disposition': `attachment; filename=reporteEntregaAAlmacen.pdf`
                });
                stream.pipe(res);
            }));
        }
        
        
    }

    async getReportPlantDelivery(req:Request,res:Response){
        let from = req.query.from;
        let to=req.query.to;
        let type=req.query.type;
        let records = await this.packagingService.getAllOutputsByPlant(from,to);
        
        if(type=="pdf"){
            let report =  this.pdfHelper.getReportPlanDelivery(records,from,to);
            pdf.create(report, {
                format: 'letter',
                border: {
                    top: "2cm", 
                    right: "1cm",
                    bottom: "2cm",
                    left: "1cm"
                }
                
            }).toStream((function (err, stream) {
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'responseType': 'blob',
                    'Content-disposition': `attachment; filename=reporteEntregaPlanta.pdf`
                });
                stream.pipe(res);
            }));
    }else if(type=="excel"){
        let tmp = os.tmpdir();
        let workbook = this.excel.generatePlantDelivery(records,from,to); 
            workbook.write(`${tmp}/reporteEntregaPlanta.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="reporteEntregaPlanta.xlsx"'
            );
            res.setHeader("Content-Type", "application/vnd.ms-excel");
            res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/reporteEntregaPlanta.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/reporteEntregaPlanta.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        });
    }
    }
    
    async getReportSellerDelivered(req:Request,res:Response){
        let endDate:string = req.body.endDate;
        let startDate:string = req.body.startDate;
        let sellers:string[] = req.body.sellers;
        let type:string = req.query.type;
        let report:string = await this.packagingService.getAllProductsDeliveredToSellers(startDate,endDate,type,sellers);
        
            pdf.create(report, {
                format: 'letter',
                border: {
                    top: "2cm", 
                    right: "1cm",
                    bottom: "2cm",
                    left: "1cm"
                }
                
            }).toStream((function (err, stream) {
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'responseType': 'blob',
                    'Content-disposition': `attachment; filename=reporteEntregaPlanta.pdf`
                });
                stream.pipe(res);
            }));
    }

    async getReportVisits(req:Request,res:Response){
        console.log("Controller: Report.Controller method getReportVisits starting");
        let result:{items:SellerVisit[],dateString:string} = await this.reportService.getSellerVisits(req.body);
        let workBook:any = this.excelHelper.getSellerVisits(result.items,result.dateString);
        res.setHeader("Content-Type", "application/vnd.ms-excel");
        res.status(200); 
        workBook.write("reporteVisitas",res);
        console.log("Controller: Report.Controller method getReportVisits ended");
    }

    async getReportSoldPeriod(req:Request,res:Response){
        console.log("Controller: Report.Controller method getReportSoldPeriod starting");
        let records = await this.reportService.getReportSoldPeriod(req.body);
        let workBook:any = this.excelHelper.getSellerSoldsPeriod(records,req.body);
        res.setHeader("Content-Type", "application/vnd.ms-excel");
        res.status(200); 
        workBook.write("reporteVisitas",res);
        console.log("Controller: Report.Controller method getReportSoldPeriod ended");
    }
    async getCustomerScheduleReport(req:Request,res:Response){
        console.log("Controller: Report.Controller method getCustomerScheduleReport starting");
        let records:SellerClientScheduleData[] = await this.reportService.getCustomerScheduleReport(req.body);
        let workBook:any=null;
        if(req.body.day!="ALL"){
            workBook= this.excelHelper.getCustomerScheduleReport(req.body.day,records);
        }else{
            workBook= this.excelHelper.getCustomerScheduleAllDaysReport(records);
        }
        res.setHeader("Content-Type", "application/vnd.ms-excel");
        res.status(200); 
        workBook.write("reporteAgenda",res);
        console.log("Controller: Report.Controller method getCustomerScheduleReport ended");
    }   
}