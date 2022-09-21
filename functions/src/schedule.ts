import {schedule} from "node-cron";
import {SalesRequestService} from "./Services/Sales.Request.Service";
import {Command} from "commander";

(async () => {
    console.log("Script de transferencia de ventas iniciado, esperando la hora: 11AM para transferencia...");
    const program = new Command();
    program.version('0.0.1');
    program.option('-d, --date <date>','fecha de traspazo de ventas');
    program.parse(process.argv);
    const options  = program.opts();
    if(options.date) {
        let date= new Date(options.date);
        console.log(date.toISOString());
        let saleService = new SalesRequestService(null);    
        await saleService.transferAllSalesAutorized(options.date);
        console.log("Script se reiniciará dentro de 24 hrs a las 11am");
    }else{
        schedule(' 1 11 * * 1,2,3,4,5,6 ',async()=>{
            let date= new Date();
            date.setHours(date.getHours()-5);
            console.log(date.toISOString());

            let saleService = new SalesRequestService(null);   
            await saleService.transferAllSalesAutorized();
            
            console.log("Script se reiniciará dentro de 24 hrs a las 11am");
        });
    }
})();