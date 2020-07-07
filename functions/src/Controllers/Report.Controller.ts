import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { EntranceDriefService } from '../Services/Entrance.Drief.Service';
import { UserService } from '../Services/User.Service';
import { User } from '../Models/Entity/User';
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import PdfHelper from '../Utils/Pdf.Helper';
import * as pdf from 'html-pdf';


export class ReportController{

   
    private entranceDriefService: EntranceDriefService;
    private userService: UserService;
    private pdfHelper: PdfHelper;
    constructor(private firebaseInstance:FirebaseHelper){
        this.entranceDriefService = new EntranceDriefService(this.firebaseInstance);
        this.userService = new UserService(this.firebaseInstance);
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
  
}