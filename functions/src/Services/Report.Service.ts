import { SellerVisitsReportRequest } from "../Models/DTO/SellerOperationDTO";
import { SellerClientScheduleData, SellerReportSoldPeriod, SellerScheduleReport, SellerSoldPeriod, SellerVisit } from "../Models/SellerReportRequests";
import { ClientRepository } from "../Repositories/Client.Repository";
import { SaleRepository } from "../Repositories/Sale.Repository";

export class ReportService{
    private clientRepository:ClientRepository;
    private salesRepository:SaleRepository;
    constructor(){
        this.clientRepository = new ClientRepository();
        this.salesRepository = new SaleRepository();
    }
    async getSellerVisits(request:SellerVisitsReportRequest){
        let date = new Date(request.date);
        let day = this.zellerGregorian(date);
        console.log("DIA: "+day);
        let dayStr ="";
        switch(day){
            case 0:
                dayStr="saturday"
                break;
            case 1:
                dayStr="sunday";
                break;
            case 2:
                dayStr="monday";
                break;
            case 3:
                dayStr="tuesday";
                break;
            case 4:
                dayStr="wednesday";
                break;
            case 5:
                dayStr="thursday";
                break;
            case 6:
                dayStr="friday";
                break;
            default:
                dayStr="monday";
            break;
        }
        return await this.clientRepository.getVisits(request,dayStr,request.date);
    }

    async getReportSoldPeriod(request:SellerReportSoldPeriod){
        let date = new Date(request.year,request.month,0);
        let fromDay="01";
        let toDay="15";
        let records:SellerSoldPeriod[]=[];
        let month=request.month.toString();
        if(+month<10){
            month="0"+month;
        }
        if(request.typePeriod==2){
            fromDay="16";
            toDay=date.getDate().toString();
            if(+toDay<10){
                toDay="0"+toDay;
            }
        }else if(request.typePeriod==3){
            fromDay="01";
            toDay=date.getDate().toString();
            if(+toDay<10){
                toDay="0"+toDay;
            }
        }
        records = await this.salesRepository.getReportSoldPeriod(request.oldYear,request.year,month,fromDay,toDay,request.sellersIds);
        return records;
    }
    zellerGregorian(date){
        let h = 0; // day of week, Saturday = 0
        let q = date.getDate(); // day of month
        let m = date.getMonth(); // month, 3 to 14 = March to February
        let Y = 1900 + date.getYear(); // year is 1900-based
        // adjust month to run from 3 to 14 for March to February
        if(m <= 1)
        {
            m+= 13;
        }
        else
        {
            m+= 1;
        }
        // and also adjust year if January or February
        if(date.getMonth() <= 1)
        {
            Y--;
        }
        // Calculate h as per Herr Zeller
        h = (q + Math.floor(((13 * (m + 1)) / 5)) + Y + Math.floor((Y / 4)) - Math.floor((Y / 100)) + Math.floor((Y / 400))) % 7;

        return h;
}   

    async getCustomerScheduleReport(request:SellerScheduleReport){
        if(request.sellersIds.length>0){
            return await this.clientRepository.getAllClientsScheduleByDate(request.day,request.sellersIds);
        }else{
            return [];
        }
    }
}