import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { EntranceDriefService } from '../Services/Entrance.Drief.Service';
import { UserService } from '../Services/User.Service';
import { User } from '../Models/Entity/User';
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import { Formulation } from '../Models/Entity/Formulation';
import PdfHelper from '../Utils/Pdf.Helper';
import * as pdf from 'html-pdf';
import { FormulationService } from '../Services/Formulation.Service';
import { FormulationIngredients } from '../Models/Entity/Formulation.Ingredients';


export class ReportController{

   
    private entranceDriefService: EntranceDriefService;
    private userService: UserService;
    private formulationService: FormulationService
    private pdfHelper: PdfHelper;
    constructor(private firebaseInstance:FirebaseHelper){
        this.entranceDriefService = new EntranceDriefService(this.firebaseInstance);
        this.userService = new UserService(this.firebaseInstance);
        this.formulationService = new FormulationService();
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
  
}