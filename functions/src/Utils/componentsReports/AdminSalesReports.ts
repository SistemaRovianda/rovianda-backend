import { ChartD3DataInterface, GeneralReportByDay, GeneralReportByMonth, GeneralReportByWeek, GeneralReportByYear, RankingSeller, RankingSellerByProduct, SalesTypes } from "../../Models/DTO/Admin.Sales.Request";
import * as excel from "excel4node";
import { PresentationProducts } from "../../Models/Entity/Presentation.Products";
import { User } from "../../Models/Entity/User";
export class AdminSalesReports{
    getHead(){
        return `<html><head>
        <style>
        .report-container{
            text-align:center;
        }
        .table-ranking{
            width:80%;
            margin-left: 10%
        }
        </style>
        </head><body>`;
    }
    getReportProductRankingByDates(dateStart:string,dateEnd:string,data:ChartD3DataInterface[]){
        
        return this.getHead()+this.getBodyProductRankingByDate(dateStart,dateEnd,data)+this.getFooter();
    }

    getReportProductRankingByDatesExcel(dateStart:string,dateEnd:string,data:ChartD3DataInterface[]){
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet(`Ranking`);

        worksheet.cell(1,1,1,3,true).string('Ranking de productos').style({alignment:{horizontal:"center"}});
        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

        worksheet.cell(4,1,4,1,true).string('PRODUCTO');
        worksheet.cell(4,2,4,2,true).string('Kilos/Paquetes');
        worksheet.cell(4,3,4,3,true).string('MONTO');
        worksheet.column(1).setWidth(50);
        worksheet.column(2).setWidth(50);
        worksheet.column(3).setWidth(50);
        let row = 5;
        let totalAmount = 0;
        let totalKg=0;
        let totalPaquetes =0;
            for(let product of data){
                totalAmount+=product.amount;
                if(product.uniMed=="KG"){
                    totalKg+=product.quantity;
                }else{
                    totalPaquetes+=product.quantity;
                }
                worksheet.cell(row,1,row,1).string(product.name+ " "+product.typePresentation);
                worksheet.cell(row,2,row,2).string(product.quantity+" "+(product.uniMed=="PZ"?"Paquetes":"Kilos"));
                worksheet.cell(row,3,row,3).string(`$ ${this.parseAmount(product.amount)}`);
                row++;
            }
            row+=2;
            worksheet.cell(row,1,row,1).string("Kilos: "+this.parseAmount(totalKg));
            worksheet.cell(row,2,row,2).string("Paquetes: "+totalPaquetes);
            worksheet.cell(row,3,row,3).string(`$ ${this.parseAmount(totalAmount)}`);
            return workbook;

    }

    getBodyProductRankingByDate(dateStart:string,dateEnd:string,data:ChartD3DataInterface[]){
        

        let body=`<div class="report-container">
                <h1>Ranking de productos</h1>
                <label>Desde: ${dateStart} Hasta:${dateEnd}</label>
                <table class="table-ranking"><tbody>
                <tr>
                <th>Producto</th>
                <th>Kilos/Paquetes</th>
                <th>Monto</th>
                </tr>`;
        let totalAmount = 0;
        let totalKg=0;
        let totalPaquetes =0;
        for(let product of data){
            totalAmount+=product.amount;
            if(product.uniMed=="PZ"){
                totalPaquetes+=product.quantity;
                if(product.typeProduct!="ABARROTES"){
                    totalKg+=product.weight;
                }
            }else{
                totalKg+=product.quantity;
            }
            body+=`<tr>
            <td>${product.name+" "+product.typePresentation}</td>
            <td>${this.parseAmount(product.quantity)+" "+(product.uniMed=="PZ"?"Paquetes/"+this.parseAmount(product.weight):"Kilos")}</td>
            <td>$${this.parseAmount(product.amount)}</td>
            </tr>`;
        }
        body+=`
        <tr>
            <td>Kilos: ${this.parseAmount(totalKg)}</td>
            <td>Paquetes: ${totalPaquetes}</td>
            <td>$${this.parseAmount(totalAmount)}</td>
        </tr>
        `;

        return body;
    }

    parseAmount(number:number){
        return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      }

    getFooter(){
        return `</tbody></table>
    
        </body></html>`;
    }

    getReportRankingSellersByProductPdf(dateStart:string,dateEnd:string,data:RankingSellerByProduct[],productPresentation:PresentationProducts){
        return this.getHead()+this.getReportRankingSellersByProductPdfBody(dateStart,dateEnd,data,productPresentation)+this.getFooter();
    }
    getReportRankingSellersByProductPdfBody(dateStart:string,dateEnd:string,data:RankingSellerByProduct[],productPresentation:PresentationProducts){
        let body = `<div class="report-container">
        <h1>Ranking de Vendedores por producto</h1>
        <h1>Producto: ${productPresentation.productRovianda.name+" "+productPresentation.presentationType}</h1>
        <label>Desde: ${dateStart} Hasta:${dateEnd}</label>
        <table class="table-ranking"><tbody>
        <tr>
        <th>Vendedor</th>
        <th>${productPresentation.uniMed=="PZ"?"Paquetes":"Kilos"}</th>
        <th>Monto</th>
        </tr>`;
        let totalAmount=0;
        let totalKg=0;
        let totalPaquetes=0;
        for(let seller of data){
            if(productPresentation.uniMed=="PZ"){
                totalPaquetes+=seller.quantity;
            }else{
                totalKg+=seller.quantity;
            }
            totalAmount+=seller.amount;
            body+=`
                <tr>
                <td>${seller.name}</td>
                <td>${this.parseAmount(seller.quantity)}</td>
                <td>${this.parseAmount(seller.amount)}</td>
                </tr>
            `;
        }
        body+=`
                <tr>
                <td>Total Kg: ${totalKg.toFixed(2)}</td>
                <td>Total Paquetes: ${totalPaquetes}</td>
                <td>Total $ ${this.parseAmount(totalAmount)}</td>
                </tr>
            `;
        return body;
    }

    getReportRankingSellersByProductExcel(dateStart:string,dateEnd:string,data:RankingSellerByProduct[],productPresentation:PresentationProducts){
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet(`RankingPorProducto`);

        worksheet.cell(1,1,1,3,true).string('Ranking de productos').style({alignment:{horizontal:"center"}});
        worksheet.cell(2,1,2,3,true).string(`Producto: ${productPresentation.productRovianda.name+" "+productPresentation.presentationType}`).style({alignment:{horizontal:"center"}});
        worksheet.cell(3,1,3,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

        worksheet.cell(5,1,5,1,true).string('Vendedor');
        worksheet.cell(5,2,5,2,true).string(`${productPresentation.uniMed=="PZ"?"Paquetes":"Kilos"}`);
        worksheet.cell(5,3,5,3,true).string('Monto');
        worksheet.column(1).setWidth(50);
        worksheet.column(2).setWidth(50);
        worksheet.column(3).setWidth(50);
        let row = 6;
        let totalAmount = 0;
        let totalKg=0;
        let totalPaquetes =0;
            for(let product of data){
                totalAmount+=product.amount;
                if(productPresentation.uniMed=="KG"){
                    totalKg+=product.quantity;
                }else{
                    totalPaquetes+=product.quantity;
                }
                worksheet.cell(row,1,row,1).string(product.name);
                worksheet.cell(row,2,row,2).string(product.quantity.toFixed(2)+" "+(productPresentation.uniMed=="PZ"?"Paquetes":"Kilos"));
                worksheet.cell(row,3,row,3).string(`$ ${this.parseAmount(product.amount)}`);
                row++;
            }
            row+=2;
            worksheet.cell(row,1,row,1).string("Kilos: "+totalKg.toFixed(2));
            worksheet.cell(row,2,row,2).string("Paquetes: "+totalPaquetes);
            worksheet.cell(row,3,row,3).string(`$ ${this.parseAmount(totalAmount)}`);
            return workbook;
    }

    getReportMetricsRankingSellerByDatePDF(data:RankingSeller[],dateStart:string,dateEnd:string){
        let body= `
        <div class="report-container">
        <h1>Ranking de Vendedores </h1>
        <label>Desde: ${dateStart} Hasta:${dateEnd}</label>
        <table class="table-ranking"><thead>
        <tr>
            <th>Vendedor</th>
            <th>Kilos</th>
            <th>Total ($)</th>
        </tr></thead><tbody>`;
        let totalBill = 0;
        let totalWeight=0;
        for(let seller of data){
            totalBill+=seller.amount;
            totalWeight+=seller.weight;
            body+=`
            <tr>
            <td>${seller.name}</td>
            <td>${this.parseAmount(seller.weight)}</td>
            <td>${this.parseAmount(seller.amount)}</td>
            </tr>
            `;
        }
        body+=`<tr><td></td><td>Total Kilos: ${this.parseAmount(totalWeight)}</td><td>Monto total: ${this.parseAmount(totalBill)}</td></tr>`;
        return this.getHead()+body+this.getFooter();
    }   

    getReportMetricsRankingSellerByDateEXCEL(data:RankingSeller[],dateStart:string,dateEnd:string){
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet(`Ranking`);

        worksheet.cell(1,1,1,3,true).string('Ranking de Vendedores').style({alignment:{horizontal:"center"}});
        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

        worksheet.cell(5,1,5,1,true).string('Vendedor');
        worksheet.cell(5,2,5,2,true).string(`Kilos`);
        worksheet.cell(5,3,5,3,true).string('Monto');
        worksheet.column(1).setWidth(50);
        worksheet.column(2).setWidth(50);
        worksheet.column(3).setWidth(50);
        let row = 6;
        let totalAmount = 0;
        let totalKg=0;
  
            for(let product of data){
                totalAmount+=product.amount;
                totalKg+=product.weight;
                worksheet.cell(row,1,row,1).string(product.name);
                worksheet.cell(row,2,row,2).string(this.parseAmount(product.weight));
                worksheet.cell(row,3,row,3).string(`$ ${this.parseAmount(product.amount)}`);
                row++;
            }
            row+=2;
            worksheet.cell(row,2,row,2).string("Kilos: "+this.parseAmount(totalKg));
            worksheet.cell(row,3,row,3).string(`$ ${this.parseAmount(totalAmount)}`);
            return workbook;
    }

    getSummaryReportBySellerPDF(seller:User,acumulateAbarrotes:{amount:number},acumulateNormal:{amount:number},acumulatedNormalKg:{totalKg:number},acumulatedCheeses:{amount:number},acumulatedCheesesKg:{totalKg:number},ranking:{amount:number,amountKg:number,name:string,type_presentation:string}[],dateStart:string,dateEnd:string){
        let body= `
        <div class="report-container">
        <h1>Resumen vendedor </h1>
        <label>Vendedor: ${seller.name}</label><br>
        <label>Desde: ${dateStart} Hasta:${dateEnd}</label>
        <table class="table-ranking"><thead>
        <tr>
            <th>Kg carnicos</th>
            <th>Monto carnicos</th>
            <th>Kg Quesos</th>
            <th>Monto quesos</th>
            <th>Monto Abarrotes</th>
        </tr></thead><tbody>
        <tr>
            <td>${this.parseAmount(acumulatedNormalKg.totalKg?acumulatedNormalKg.totalKg:0)}</td><td>${this.parseAmount(acumulateNormal.amount?acumulateNormal.amount:0)}</td>
            <td>${this.parseAmount(acumulatedCheesesKg.totalKg?acumulatedCheesesKg.totalKg:0)}</td><td>${this.parseAmount(acumulatedCheeses.amount?acumulatedCheeses.amount:0)}</td>
            <td>${this.parseAmount(acumulateAbarrotes.amount?acumulateAbarrotes.amount:0)}</td>            
        </tr>
        <tr><th colspan="3">Producto</th><th>Kg</th><th>Monto</th></tr>
        `;
        let totalBill = 0;
        let totalWeight=0;
        for(let product of ranking){
            totalBill+=product.amount;
            totalWeight+=product.amountKg;
            body+=`
            <tr>
            <td colspan="3">${product.name+" "+product.type_presentation}</td>
            <td>${this.parseAmount(product.amountKg)}</td>
            <td>${this.parseAmount(product.amount)}</td>
            </tr>
            `;
        }
        body+=`<tr><td colspan="3"></td><td>Total Kilos: ${this.parseAmount(totalWeight)}</td><td>Monto total: ${this.parseAmount(totalBill)}</td></tr>`;
        return this.getHead()+body+this.getFooter();
    }

    async getHistoryGeneralByDay(records:GeneralReportByDay[],dateStart:string,dateEnd:string){
        var workbook = new excel.Workbook();
        if(records.length){
            let page=1;
            let currentDate = records[0].date;
            let worksheet = workbook.addWorksheet(`${currentDate}`);

        worksheet.cell(1,1,1,3,true).string('Reporte general por dia Hoja '+page).style({alignment:{horizontal:"center"}});
        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

        worksheet.cell(5,1,5,1,true).string('Fecha');
        worksheet.cell(5,2,5,2,true).string(`Vendedor`);
        worksheet.cell(5,3,5,3,true).string('Cliente');
        worksheet.cell(5,4,5,4,true).string('Folio');
        worksheet.cell(5,5,5,5,true).string('Tipo de venta');
        worksheet.cell(5,6,5,6,true).string('Monto general');
        worksheet.cell(5,7,5,7,true).string('Producto');
        worksheet.cell(5,8,5,8,true).string('Cantidad');
        worksheet.cell(5,9,5,9,true).string('Monto');
        worksheet.column(1).setWidth(25);
        worksheet.column(2).setWidth(25);
        worksheet.column(3).setWidth(25);
        worksheet.column(4).setWidth(25);
        worksheet.column(5).setWidth(25);
        worksheet.column(6).setWidth(25);
        worksheet.column(7).setWidth(25);
        worksheet.column(8).setWidth(25);
        worksheet.column(9).setWidth(25);
        let row=7;
        
   
            let group=1;
            let currentFolio = records[0].folio;
            let generalAdded=false;
            for(let record of records){
                
                if(currentFolio!=record.folio){
                    group++;
                    generalAdded=false;
                    currentFolio=record.folio;
                    if(currentDate!=record.date){
                        
                        currentDate=record.date;
                        page++;
                        group=1;
                        worksheet=workbook.addWorksheet(`${currentDate}`);
                        worksheet.cell(1,1,1,3,true).string('Reporte general por dia Hoja '+page).style({alignment:{horizontal:"center"}});
                        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

                        worksheet.cell(5,1,5,1,true).string('Fecha');
                        worksheet.cell(5,2,5,2,true).string(`Vendedor`);
                        worksheet.cell(5,3,5,3,true).string('Cliente');
                        worksheet.cell(5,4,5,4,true).string('Folio');
                        worksheet.cell(5,5,5,5,true).string('Tipo de venta');
                        worksheet.cell(5,6,5,6,true).string('Monto general');
                        worksheet.cell(5,7,5,7,true).string('Producto');
                        worksheet.cell(5,8,5,8,true).string('Cantidad');
                        worksheet.cell(5,9,5,9,true).string('Monto');
                        worksheet.column(1).setWidth(25);
                        worksheet.column(2).setWidth(25);
                        worksheet.column(3).setWidth(25);
                        worksheet.column(4).setWidth(25);
                        worksheet.column(5).setWidth(25);
                        worksheet.column(6).setWidth(25);
                        worksheet.column(7).setWidth(25);
                        worksheet.column(8).setWidth(25);
                        worksheet.column(9).setWidth(25);
                        row=7;
                        generalAdded=true;
                        //console.log("Escribiendo hoja: "+page+" currenDate: "+currentDate);
                    }
                }
                if(generalAdded==false){
                    worksheet.cell(row,1,row,1,true).string(`${record.date}`);
                    worksheet.cell(row,2,row,2,true).string(`${record.name}`);
                    worksheet.cell(row,3,row,3,true).string(`${record.keyClient}-${record.client}`);
                    worksheet.cell(row,4,row,4,true).string(`${record.folio}`);
                    worksheet.cell(row,5,row,5,true).string(`${record.typeSale}`);
                    worksheet.cell(row,6,row,6,true).string(`${this.parseAmount(record.amount)}`);
                    row++;
                    worksheet.cell(row,7,row,7,true).string(`${record.product} ${record.presentation}`);
                    worksheet.cell(row,8,row,8,true).string(`${this.parseAmount(record.quantity)}`);
                    worksheet.cell(row,9,row,9,true).string(`${this.parseAmount(record.subAmount)}`);
                    worksheet.row(row).group(group,true);
                    generalAdded=true;
                }else{
                    worksheet.cell(row,7,row,7,true).string(`${record.product} ${record.presentation}`);
                    worksheet.cell(row,8,row,8,true).string(`${this.parseAmount(record.quantity)}`);
                    worksheet.cell(row,9,row,9,true).string(`${this.parseAmount(record.subAmount)}`);
                    worksheet.row(row).group(group,true);
                }
                row++;
            }
        
    }
            return workbook;
    }

    async getHistoryGeneralByWeek(records:GeneralReportByWeek[],mapWeeks:Map<number,string>,dateStart:string,dateEnd:string){
        var workbook = new excel.Workbook();
        if(records.length){
        records=records.sort((a,b)=>a.week-b.week);
        let currentWeek = records[0].week;
        let page=1;
        let worksheet = workbook.addWorksheet(`${mapWeeks.get(records[0].week)} Hoja `+page);
        // let map = new Map();
        // let indexMap =new Map();
        // map.set(currentWeek,worksheet);
        worksheet.cell(1,1,1,3,true).string('Reporte general por semana').style({alignment:{horizontal:"center"}});
        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

        worksheet.cell(5,1,5,1,true).string('Semana');
        worksheet.cell(5,2,5,2,true).string(`Vendedor`);
        worksheet.cell(5,3,5,3,true).string('Cliente');
        worksheet.cell(5,4,5,4,true).string('Producto');
        worksheet.cell(5,5,5,5,true).string('Cantidad');
        worksheet.cell(5,6,5,6,true).string('Monto');
        worksheet.column(1).setWidth(25);
        worksheet.column(2).setWidth(25);
        worksheet.column(3).setWidth(25);
        worksheet.column(4).setWidth(25);
        worksheet.column(5).setWidth(25);
        let row=7;
        
            let generalAdded=false;
            let currentClientId=records[0].clientId;
            for(let record of records){
                
                if(record.clientId!=currentClientId){
                    generalAdded=false;
                    let otherPage=false;
                    if(row>500 || record.week!=currentWeek){
                        otherPage=true;
                        //let worksheetTemp=null;
                        if(record.week!=currentWeek){
                            currentWeek=record.week;
                            page=1;
                            //worksheetTemp = map.get(record.week);
                        }else{
                            page++;
                        }
                        
                        //if(!worksheetTemp){
                            worksheet=workbook.addWorksheet(`${mapWeeks.get(record.week)} Hoja `+page);
                            //console.log("Agregando hoja: "+page+" semana "+mapWeeks.get(record.week));
                            //map.set(record.week,worksheet);
                        // }else{
                        //     otherPage=false;
                        //     worksheet=worksheetTemp;
                        //     //console.log("Reutilizando semana "+mapWeeks.get(record.week));
                        //     row=indexMap.get(record.week);
                        // }
                    }
                    if(otherPage){
                        worksheet.cell(1,1,1,3,true).string('Reporte general por semana').style({alignment:{horizontal:"center"}});
                        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

                        worksheet.cell(5,1,5,1,true).string('Semana');
                        worksheet.cell(5,2,5,2,true).string(`Vendedor`);
                        worksheet.cell(5,3,5,3,true).string('Cliente');
                        worksheet.cell(5,4,5,4,true).string('Producto');
                        worksheet.cell(5,5,5,5,true).string('Cantidad');
                        worksheet.cell(5,6,5,6,true).string('Monto');
                        worksheet.column(1).setWidth(25);
                        worksheet.column(2).setWidth(25);
                        worksheet.column(3).setWidth(25);
                        worksheet.column(4).setWidth(25);
                        worksheet.column(5).setWidth(25);
                        row=7;
                    }
                }
               
                if(generalAdded==false){
                    currentWeek=record.week;
                    currentClientId=record.clientId;
                    worksheet.cell(row,1,row,1,true).string(`${mapWeeks.get(record.week)}`);
                    worksheet.cell(row,2,row,2,true).string(`${record.name}`);
                    worksheet.cell(row,3,row,3,true).string(`${record.clientId}-${record.client}`);
                    row++;
                    worksheet.cell(row,4,row,4,true).string(`${record.product} ${record.presentation}`);
                    worksheet.cell(row,5,row,5,true).string(`${record.uniMed=="PZ"?this.parseAmount(record.quantity):this.parseAmount(record.weight)}`);
                    worksheet.cell(row,6,row,6,true).string(`${this.parseAmount(record.subAmount)}`);
                    generalAdded=true;
                }else{
                    worksheet.cell(row,4,row,4,true).string(`${record.product} ${record.presentation}`);
                    worksheet.cell(row,5,row,5,true).string(`${record.uniMed=="PZ"?this.parseAmount(record.quantity):this.parseAmount(record.weight)}`);
                    worksheet.cell(row,6,row,6,true).string(`${this.parseAmount(record.subAmount)}`);
                }
                row++;
                //indexMap.set(record.week,row);
            }
        
    }
        //console.log("Libro completado");
            return workbook;
    }

    async getHistoryGeneralByMonth(records:GeneralReportByMonth[],dateStart:string,dateEnd:string){
        var workbook = new excel.Workbook();
        if(records.length){
            records=records.sort((a,b)=>a.month.localeCompare(b.month));
        // let map = new Map();
        // let indexMap = new Map();
        let worksheet = workbook.addWorksheet(`${records[0].month} Hoja 1`);
//            map.set(records[0].month,worksheet);
        worksheet.cell(1,1,1,3,true).string('Reporte general por mes Hoja: 1').style({alignment:{horizontal:"center"}});
        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

        worksheet.cell(5,1,5,1,true).string('Mes');
        worksheet.cell(5,2,5,2,true).string(`Vendedor`);
        worksheet.cell(5,3,5,3,true).string('Cliente');
        worksheet.cell(5,4,5,4,true).string('Producto');
        worksheet.cell(5,5,5,5,true).string('Cantidad');
        worksheet.cell(5,6,5,6,true).string('Monto');
        worksheet.column(1).setWidth(25);
        worksheet.column(2).setWidth(25);
        worksheet.column(3).setWidth(25);
        worksheet.column(4).setWidth(25);
        worksheet.column(5).setWidth(25);
        let row=7;
        let page=1;
        
            let currentMonth=records[0].month;
            let generalAdded=false;
            let currentClientId=0;
            for(let i=0;i<records.length;i++){
                let record = records[i];
                if(record.clientId!=currentClientId){
                    generalAdded=false;
                    if(row>500 || currentMonth!=record.month){
                        //let worksheetTemp=null;
                        if(currentMonth!=record.month){
                            page=1;
                            //worksheetTemp=map.get(record.month);
                        }else{
                            page++;
                        }
                    
                        //if(!worksheetTemp){
                        worksheet=workbook.addWorksheet(`${record.month} Hoja `+page);
                        worksheet.cell(1,1,1,3,true).string('Reporte general por mes Hoja: '+page).style({alignment:{horizontal:"center"}});
                        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

                        worksheet.cell(5,1,5,1,true).string('Mes');
                        worksheet.cell(5,2,5,2,true).string(`Vendedor`);
                        worksheet.cell(5,3,5,3,true).string('Cliente');
                        worksheet.cell(5,4,5,4,true).string('Producto');
                        worksheet.cell(5,5,5,5,true).string('Cantidad');
                        worksheet.cell(5,6,5,6,true).string('Monto');
                        worksheet.column(1).setWidth(25);
                        worksheet.column(2).setWidth(25);
                        worksheet.column(3).setWidth(25);
                        worksheet.column(4).setWidth(25);
                        worksheet.column(5).setWidth(25);
                        
                        row=7;
                        // map.set(record.month,worksheet);
                        // //console.log("Creando hoja con: "+record.month+" Hoja:"+page);
                        // }else{
                        //     //console.log("Reutilizando: "+record.month);
                        //     worksheet=worksheetTemp;
                        //     row=indexMap.get(record.month);
                        // }
                    }
                }
                
                if(generalAdded==false){
                    
                    currentMonth=record.month;
                    currentClientId=record.clientId;
                    worksheet.cell(row,1,row,1,true).string(`${record.month}`);
                    worksheet.cell(row,2,row,2,true).string(`${record.name}`);
                    worksheet.cell(row,3,row,3,true).string(`${record.clientId}-${record.client}`);
                    row++;
                    worksheet.cell(row,4,row,4,true).string(`${record.product} ${record.presentation}`);
                    worksheet.cell(row,5,row,5,true).string(`${record.uniMed=="PZ"?this.parseAmount(record.quantity):this.parseAmount(record.weight)}`);
                    worksheet.cell(row,6,row,6,true).string(`${this.parseAmount(record.subAmount)}`);
                    generalAdded=true;
                }else{
                    worksheet.cell(row,4,row,4,true).string(`${record.product} ${record.presentation}`);
                    worksheet.cell(row,5,row,5,true).string(`${record.uniMed=="PZ"?this.parseAmount(record.quantity):this.parseAmount(record.weight)}`);
                    worksheet.cell(row,6,row,6,true).string(`${this.parseAmount(record.subAmount)}`);
                }
                row++;
                //indexMap.set(record.month,row);
            }
        }
            //console.log("Libro escrito");
            return workbook;
    }

    async getHistoryGeneralByYear(records:GeneralReportByYear[],dateStart:string,dateEnd:string){
        var workbook = new excel.Workbook();
        if(records.length){
            records=records.sort((a,b)=>a.year-b.year);
        let page=1;
        let worksheet = workbook.addWorksheet(`${records[0].year} Hoja ${page}`);
        // let map = new Map();
        // let indexMap = new Map();
        // map.set(records[0].year,worksheet);
        worksheet.cell(1,1,1,3,true).string('Reporte general por año Hoja: 1').style({alignment:{horizontal:"center"}});
        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

       
        worksheet.cell(5,2,5,2,true).string(`Vendedor`);
        worksheet.cell(5,3,5,3,true).string('Cliente');
        worksheet.cell(5,4,5,4,true).string('Producto');
        worksheet.cell(5,5,5,5,true).string('Cantidad');
        worksheet.cell(5,6,5,6,true).string('Monto');
        worksheet.column(1).setWidth(25);
        worksheet.column(2).setWidth(25);
        worksheet.column(3).setWidth(25);
        worksheet.column(4).setWidth(25);
        worksheet.column(5).setWidth(25);
        let row=7;
        
        
            let currentYear=records[0].year;
            
            let generalAdded=false;
            
            let currentClientId=0;
            for(let i=0;i<records.length;i++){
                let record = records[i];
                if(record.clientId!=currentClientId){
                    generalAdded=false;
                    if(row>500 || currentYear!=record.year){
                        //let worksheetTemp = null;
                        if(currentYear!=record.year){
                            page=1;
                          //  worksheetTemp = map.get(record.year);
                        }else{
                            page++;
                        }
                        
                        //if(!worksheetTemp){
                        worksheet=workbook.addWorksheet(`${record.year} Hoja `+page);
                        worksheet.cell(1,1,1,3,true).string('Reporte general por mes Hoja: '+page).style({alignment:{horizontal:"center"}});
                        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

                       
                        worksheet.cell(5,2,5,2,true).string(`Vendedor`);
                        worksheet.cell(5,3,5,3,true).string('Cliente');
                        worksheet.cell(5,4,5,4,true).string('Producto');
                        worksheet.cell(5,5,5,5,true).string('Cantidad');
                        worksheet.cell(5,6,5,6,true).string('Monto');
                        worksheet.column(1).setWidth(25);
                        worksheet.column(2).setWidth(25);
                        worksheet.column(3).setWidth(25);
                        worksheet.column(4).setWidth(25);
                        worksheet.column(5).setWidth(25);
                        
                        row=7;
                        //console.log("Creando hoja: "+page+" para el año: "+record.year );
                        // map.set(record.year,worksheet);
                        // }else{
                        //     worksheet=worksheetTemp;
                        //     row=indexMap.get(record.year);
                        //     //console.log("Reutilizando año: "+record.year);
                        // }
                    }
                }
              
                if(generalAdded==false){
                    currentYear=record.year;
                    currentClientId=record.clientId;
                    
                    worksheet.cell(row,2,row,2,true).string(`${record.name}`);
                    worksheet.cell(row,3,row,3,true).string(`${record.clientId}-${record.client}`);
                    row++;
                    worksheet.cell(row,4,row,4,true).string(`${record.product} ${record.presentation}`);
                    worksheet.cell(row,5,row,5,true).string(`${record.uniMed=="PZ"?this.parseAmount(record.quantity):this.parseAmount(record.weight)}`);
                    worksheet.cell(row,6,row,6,true).string(`${this.parseAmount(record.subAmount)}`);
                    generalAdded=true;
                }else{
                    worksheet.cell(row,4,row,4,true).string(`${record.product} ${record.presentation}`);
                    worksheet.cell(row,5,row,5,true).string(`${record.uniMed=="PZ"?this.parseAmount(record.quantity):this.parseAmount(record.weight)}`);
                    worksheet.cell(row,6,row,6,true).string(`${this.parseAmount(record.subAmount)}`);
                }
                row++;
                //indexMap.set(record.year,row);
            }
        }
    
            //console.log("Libro escrito");
            return workbook;
    }

    async getReportOfSalesTypesBySellersPDF(type:string,sales:SalesTypes[],dateStart:string,dateEnd:string){
        let report= `
            <html>
                <head>
                <style>
                    *.{
                        font-size: 8px
                    }
                </style>
                </head>
                <body>
                <h3>Reporte de ventas, Filtro: ${type=="ALL"?"TODAS":((type=="CANCELED")?"CANCELADAS":"OMITIDAS")}</h3>
                <h3>Desde: ${dateStart} Hasta: ${dateEnd}</h3>
                    <table>
                        <tr>
                            <td>Fecha</td>
                            <td>Vendedor</td>
                            <td>Cliente</td>
                            <td>Folio</td>
                            <td>Monto</td>
                        </tr>`;
                        let amount=0;
            for(let sale of sales){
                report+=`
                    <tr>
                        <td>${sale.date.split("T")[0]}</td>
                        <td>${sale.sellerName}</td>
                        <td>${sale.clientName}</td>
                        <td>${sale.folio}</td>
                        <td>${sale.amount}</td>
                    </tr>
                `;
                if(type=="ALL" && sale.status!="CANCELED"){
                    amount+=sale.amount;
                }else if(type=="CANCELED" && sale.status=="CANCELED"){
                    amount+=sale.amount;
                }else if(type=="OMITED" ){
                    amount+=sale.amount;
                }
            }
                    report+=`</table>
                    <h3>Total acumulado: ${amount.toFixed(2)}</h3>
                </body>
            </html>
        `;
        return report;
    }

    async getReportOfSalesTypesBySellersExcel(type:string,sales:SalesTypes[],dateStart:string,dateEnd:string){
        var workbook = new excel.Workbook();
    
        let worksheet = workbook.addWorksheet(`REPORTE DE VENTAS`);
//            map.set(records[0].month,worksheet);
        worksheet.cell(1,1,1,3,true).string(`Reporte de ventas Filtro: ${(type=="ALL"?"TODOS":((type=="CANCELED")?"CANCELADOS":"OMITIDAS"))} `).style({alignment:{horizontal:"center"}});
        worksheet.cell(2,1,2,3,true).string(`Desde: ${dateStart} Hasta: ${dateEnd}`).style({alignment:{horizontal:"center"}});

        worksheet.cell(5,1,5,1,true).string('Fecha');
        worksheet.cell(5,2,5,2,true).string(`Vendedor`);
        worksheet.cell(5,3,5,3,true).string('Cliente');
        worksheet.cell(5,4,5,4,true).string('Folio');
        worksheet.cell(5,5,5,5,true).string('Monto');
        worksheet.column(1).setWidth(25);
        worksheet.column(2).setWidth(25);
        worksheet.column(3).setWidth(25);
        worksheet.column(4).setWidth(25);
        let amount=0;
        let row=6;
        for(let sale of sales){
            amount+=sale.amount;
            worksheet.cell(row,1,row,1,true).string(`${sale.date.split("T")[0]}`);
            worksheet.cell(row,2,row,2,true).string(`${sale.sellerName}`);
            worksheet.cell(row,3,row,3,true).string(`${sale.clientName}`);
            worksheet.cell(row,4,row,4,true).string(`${sale.folio}`);
            worksheet.cell(row,5,row,5,true).string(`${sale.amount}`);
            row++;
        }
        
        worksheet.cell(row,5,row,5,true).string(`TOTAL: ${amount.toFixed(2)}`);
        return workbook;
    }

}