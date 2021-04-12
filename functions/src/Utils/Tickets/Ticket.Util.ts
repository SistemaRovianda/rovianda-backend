import { min } from "lodash";
import { PresentationsAvailables } from "../../Models/DTO/Presentations.DTO";
import { Sale } from "../../Models/Entity/Sales";
import { SellerOperation } from "../../Models/Entity/Seller.Operations";
import { SubSales } from "../../Models/Entity/Sub.Sales";
import { User } from "../../Models/Entity/User";
import { VisitClientOperation } from "../../Models/Entity/VisitClientOperation";
import { SqlSRepository } from "../../Repositories/SqlS.Repositoy";

export class TicketUtil{

    private sqlServer:SqlSRepository;
    constructor(){
        this.sqlServer=new SqlSRepository();
    }

    async TicketSale(sale:Sale,subSales:SubSales[],seller?:User){
        let date=new Date();
        date.setHours(date.getHours()-6);
        let month = (date.getMonth()+1).toString();
        let day = date.getDate().toString();
        if(+month<10){
            month="0"+month;
        }
        if(+day<10){
            day="0"+day;
        }
        let ticket =`ROVIANDA SAPI DE CV\nAV.1 #5 Esquina Calle 1\nCongregación Donato Guerra\nParque Industrial Valle de Orizaba\nC.P 94780\nRFC 8607056P8\nTEL 272 72 46077, 72 4 5690\n`
        ticket+=`Pago en una Sola Exhibición\nLugar de Expedición: Ruta\nNota No. ${sale.folio}\nFecha: ${day+"/"+month+"/"+date.getFullYear()} ${date.getHours()+":"+date.getMinutes()}\n\n`;
        ticket+=`Vendedor: ${(seller)?seller.name:sale.seller.name}\n\nCliente: ${sale.client.keyClient}\n${sale.client.name}\nColonia: ${sale.client.address.suburb}\nCp: ${sale.client.address.cp}\n`;
        ticket+=`Tipo de venta: ${sale.typeSale}\n--------------------------------\nDESCR   CANT    PRECIO  IMPORTE\n--------------------------------\n`;
        let total=0;
        let pieces =0;
        for(let saleItem of subSales){
            
            ticket+=`${saleItem.product.name} ${saleItem.presentation.presentationType} \n${saleItem.quantity} $${this.pipeNumber(saleItem.amount)}\n`;
            total+=saleItem.amount;
            pieces+=saleItem.quantity;
        }
        ticket+=`--------------------------------\nTOTAL: $ ${total.toFixed(2)}\n`;
        ticket+=`Piezas: ${pieces}\n\n*** GRACIAS POR SU COMPRA ***\n
        ${sale.typeSale=="CREDITO"?`\nEsta venta se incluye en la\nventa global del dia, por el\npresente reconozco deber\ny me obligo a pagar en esta\nciudad y cualquier otra que\nse me de pago a la orden de\nROVIANDA S.A.P.I. de C.V. la\ncantidad que se estipula como\ntotal en el presente documento.\n-------------------\n      Firma\n\n${sale.status==true?"SE ADEUDA":"PAGADO"}`:""}\n\n `;
        return ticket;
    }

    pipeNumber(x:number){
        x=+x.toFixed(2);
        var parts=x.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
      }

    async TickedEndDate(sales:Sale[],seller:User,sellerOperations:SellerOperation,/*visits:VisitClientOperation[],*/date:string,subSales:SubSales[]){
        
        let ticket =`\nREPORTE DE CIERRE\nVendedor: ${seller.name}\nFecha: ${date}\n-----------------------------------------\n`;
        ticket+=`\nART.    DESCR   CANT    PRECIO  IMPORTE\n-----------------------------------------\n`; 
        let amountContado:number=0;
        let amountCredito:number=0;
        let amountTransferencia:number=0;
        let amountCheque:number=0;
        let clients:string=`\n-----------------------------------------\nDOC NOMBRE  CLIENTE IMPORTE TIPOVENTA\n-----------------------------------------\n`;
        let totalKilos =0;
        let totalAmount=0;
        let productsNameSKU= new Map();
        let productsNameAmount= new Map();
        let productsNameWeight= new Map();

        for(let venta of sales){
            if(venta.statusStr=="ACTIVE"){
            if(venta.typeSale=="Efectivo"){
                amountContado+=venta.amount;
            }else if(venta.typeSale=="CREDITO"){
                amountCredito+=venta.amount;
            }else if(venta.typeSale=="Cheque"){
                amountCheque+=venta.amount;
            }else if(venta.typeSale=="Transferencia"){
                amountTransferencia+=venta.amount;
            }
            for(let subOrder of venta.subSales){    
                let sku = productsNameSKU.get(subOrder.presentation.keySae);
                
                if(sku){
                    
                let amount=productsNameAmount.get(subOrder.presentation.keySae);
                
                productsNameAmount.set(subOrder.presentation.keySae,((+amount)+(+subOrder.amount)));
                let weight=productsNameWeight.get(subOrder.presentation.keySae);
                        if(subOrder.presentation.uniMed=="KG"){
                            productsNameWeight.set(subOrder.presentation.keySae,(+weight)+(+subOrder.quantity));
                        }else if(subOrder.presentation.uniMed=="PZ"){
                            productsNameWeight.set(subOrder.presentation.keySae,(+weight)+(+subOrder.quantity*subOrder.presentation.presentationPriceMin));
                        }             
                        console.log(productsNameWeight.get(subOrder.presentation.keySae));
            }else{
                        productsNameSKU.set(subOrder.presentation.keySae,subOrder.product.name+" "+subOrder.presentation.presentationType);
                        productsNameAmount.set(subOrder.presentation.keySae,+subOrder.amount);
                    if(subOrder.presentation.uniMed=="KG"){
                        productsNameWeight.set(subOrder.presentation.keySae,(+subOrder.quantity));
                    }else{
                        productsNameWeight.set(subOrder.presentation.keySae,(+subOrder.quantity*(+subOrder.presentation.presentationPriceMin)));
                    }
                    console.log(productsNameWeight.get(subOrder.presentation.keySae));
            }
            }
            
        }
            //     ticket+=`\n${subOrder.product.name} ${subOrder.presentation.presentation} ${subOrder.presentation.presentationType}    ${subOrder.quantity} ${subOrder.presentation.uniMed.toUpperCase()}  ${this.pipeNumber(subOrder.amount)} `;
            // if(subOrder.presentation.uniMed=="PZ"){
            //     totalKilos+=subOrder.quantity*subOrder.presentation.presentationPriceMin;
            // }else if(subOrder.presentation.uniMed=="KG"){
            //     totalKilos+=subOrder.quantity;
            // }
            // if(venta.credit==0){
            //     amountContado+=venta.amount;
            // }else{
            //     amountCredito+=venta.amount;
            // }
            
            // }
            clients+=`${venta.folio}  ${venta.client.name}    $ ${venta.amount.toFixed(2)} ${venta.typeSale} ${venta.statusStr=="CANCELED"?"CANCELADO":""}\n`;

        }
        let skus = Array.from(productsNameSKU.keys());
        for(let sku of skus){
            let skuName = productsNameSKU.get(sku);
            let weight = productsNameWeight.get(sku);
            let amount = productsNameAmount.get(sku); 
            ticket+=`${sku} ${skuName} ${(weight as number).toFixed(2)} $${(amount as number).toFixed(2)}\n`;
            totalKilos+=weight;
            totalAmount+=amount;
        }
        ticket+=clients;
            ticket+=`Ventas por concepto\nEFECTIVO        $ ${this.pipeNumber(amountContado)}\nCREDITO         $ ${this.pipeNumber(amountCredito)}\nTRANSFERENCIA         $${this.pipeNumber(amountTransferencia)}\nCHEQUE         $${this.pipeNumber(amountCheque)}\n-----------------\n$${this.pipeNumber(amountContado)}\nTOTAL KILOS: ${this.pipeNumber(totalKilos)}\n-----------------\nVENTA TOTAL: $ ${this.pipeNumber(amountContado+amountCredito+amountCheque+amountTransferencia)}`;
            let cobranza =0;
            for(let sub of subSales){
                cobranza+=sub.amount;
            }
            ticket+=`\nRecup. Cobranza\n $ ${this.pipeNumber(cobranza)}\n\n\n\n\n\n`
        // if(sellerOperations){
        //     let eatTextTime = this.getTimeDiff(sellerOperations.eatingTimeStart,sellerOperations.eatingTimeEnd,sellerOperations.date);
            
        //     //ticket+=`\n-----------------------------------------\nHORA DE COMIDA: ${sellerOperations.eatingTimeStart}\n${eatTextTime}`;
        // }
        //ticket+=`\n------TIEMPO EN TIENDAS-----`;
        // for(let visit of visits){
        //     ticket+=`\n ${visit.client.name} \n${this.getTimeDiff(visit.startVisitTime,visit.endVisitTime,visit.date)}`;
        // }
        //ticket+=`\n---------RESGUARDO----------`;
        // for(let product of productsAvailables){
        //     ticket+=`\n ${ product.keySae} ${product.nameProduct} ${product.presentationType} \n ${product.quantity} ${product.isPz?"PZ":"KG"}\n----`;
        // }
        return ticket;
    }

    async getResguardedTicket(productsAvailables:PresentationsAvailables[],name:string){
        let date = new Date();
        let month = (date.getMonth()+1).toString();
        let day = date.getDate().toString();
        if(+month<10){
            month+="0"+month;
        }
        if(+day<10){
            day+="0"+day;
        }
        let ticket=name.toUpperCase()+`\nROVIANDA SAPI DE CV\nAV.1 #5 Esquina Calle 1\nCongregación Donato Guerra\nParque Industrial Valle de Orizaba\nC.P 94780\nRFC 8607056P8\nTEL 272 72 46077, 72 4 5690\nINVENTARIO DISPONIBLE\n${day+"/"+month+"/"+date.getFullYear() + " "+date.getHours()+":"+date.getMinutes()}\nSKU   NOMBRE  PZ  KG\n`;
        productsAvailables=productsAvailables.sort((a,b)=>a.keySae.length-b.keySae.length);
        for(let product of productsAvailables){
            ticket+=`\n${product.keySae}    ${product.nameProduct.split(" ")[0]}    ${product.quantity}    ${product.isPz==false?`${product.weight}`:""}`;
        }
        return ticket;
    }
    
    getTimeDiff(hourStart:string,hourEnd:string,date:string){
        let date1=hourStart.split(":");
        let hour1:string =date1[0];
        let min1:string = date1[1];
        let sec1:string = date1[2];
        let date2=hourEnd.split(":");
        let hour2:string =date2[0];
        let min2:string = date2[1];
        let sec2:string = date2[2];

        if(+hour1<10 && hour1.length!=2){
            hour1='0'+hour1;
        }
        if(+hour2<10 && hour2.length!=2){
            hour2='0'+hour2;
        }
        if(+min1<10 && min1.length!=2){
            min1='0'+min1;
        }
        if(+min2<10 && min2.length!=2){
            min2='0'+min2;
        }
        if(+sec1<10 && sec1.length!=2){
            sec1='0'+sec1;
        }
        if(+sec2<10 && sec2.length!=2){
            sec2='0'+sec2;
        }
        let dateParse1:any=  new Date(date+'T'+hour1+":"+min1+":"+sec1);
            let dateParse2:any=  new Date(date+'T'+hour2+":"+min2+":"+sec2);
            let diffMs:any = (dateParse2-dateParse1);
            let diffSeconds = Math.round(((diffMs % 86400000) % 3600000 % 3600000 ) / 60000);
            let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
            return `TIEMPO: Horas: ${diffHrs} Minutos: ${diffMins} Segundos: ${diffSeconds}`;
    }

    async getAllDeletesTickets(sales:Sale[]){
        let body=`<html>
        <body>
        <table style="width:80%" border="1" align="center">
        <tr>
            <th>No.</th>
            <th>Folio</th>
            <th>Monto</th>
            </tr>
        `;
        let amount=0;
        for(let i=0;i<sales.length;i++){
            let sale=sales[i];
            body+=`
            <tr>
            <td>${i+1}</td>
            <td>${sale.folio}</td>
            <td>${sale.amount}</td>
            </tr>
            `;
            amount+=sale.amount;
        }
        body+=`
        <tr>
        <td style="text-align:left" colspan="2">Total a retirar: </td>
        <td>$${amount}</td>
        </tr>
        </table>
        </body>
        </html>`;
        return body;
    }
}