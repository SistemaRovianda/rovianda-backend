import {schedule} from "node-cron";
import {SalesRequestService} from "./Services/Sales.Request.Service";

schedule('*/10 * * * * * ',async()=>{
    let date= new Date();
    date.setHours(date.getHours()-5)
    console.log(date.toISOString());
    let saleService = new SalesRequestService(null);    
    await saleService.transferAllSalesAutorized();
    console.log("Script se reiniciará dentro de 24 hrs a las 10am");
});