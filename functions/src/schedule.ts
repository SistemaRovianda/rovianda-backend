import {schedule} from "node-cron";
import {SalesRequestService} from "./Services/Sales.Request.Service";
console.log("Script de transferencia de ventas iniciado, esperando la hora: 11AM para transferencia...");
schedule(' * 11 * * 1,2,3,4,5,6 ',async()=>{
    let date= new Date();
    date.setHours(date.getHours()-5);
    console.log(date.toISOString());
    let saleService = new SalesRequestService(null);    
    await saleService.transferAllSalesAutorized();
    console.log("Script se reiniciará dentro de 24 hrs a las 11am");
});