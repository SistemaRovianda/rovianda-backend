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
        let ticket =`ROVIANDA SAPI DE CV\nAV.1 #5 Esquina Calle 1\nCongregación Donato Guerra\nParque Industrial Valle de Orizaba\nC.P 94780\nRFC 8607056P8\nTEL 272 72 46077, 72 4 5690\n`
        ticket+=`Pago en una Sola Exhibición\nLugar de Expedición: Ruta\nNota No. ${sale.folio}\nFecha: ${date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()}\n\n`;
        ticket+=`Vendedor: ${(seller)?seller.name:sale.seller.name}\n\nCliente: ${sale.client.keyClient}\n${sale.client.name}\nColonia: ${sale.client.address.suburb}\nCp: ${sale.client.address.cp}\n`;
        ticket+=`Tipo de venta: ${sale.typeSale}\n--------------------------------\nDESCR   CANT    PRECIO  IMPORTE\n--------------------------------\n`;
        let total=0;
        let pieces =0;
        for(let saleItem of subSales){
            let productSae = await this.sqlServer.getProductSaeByKey(saleItem.presentation.keySae);
            ticket+=`${saleItem.product.name} ${saleItem.presentation.presentationType} \n${saleItem.quantity} $${this.pipeNumber(saleItem.amount)}\n`;
            total+=saleItem.amount;
            pieces+=saleItem.quantity;
        }
        ticket+=`--------------------------------\nTOTAL: $ ${this.pipeNumber(total)}\nPAGO CON: ${sale.payedWith}\nCAMBIO: ${sale.payedWith-sale.amount}\n`;
        ticket+=`Piezas: ${pieces}\n\n*** GRACIAS POR SU COMPRA ***\n
        ${sale.typeSale=="CREDITO"?"Esta venta se incluye en la\nventa global del dia, por el\npresente reconozco deber\ny me obligo a pagar en esta\nciudad y cualquier otra que\nse me de pago a la orden de\nROVIANDA S.A.P.I. de C.V. la\ncantidad que se estipula como\ntotal en el presente documento.":""}\n\n `;

        ticket+=ticket;
        return ticket;
    }

    pipeNumber(x:number){
        var parts=x.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
      }

    async TickedEndDate(sales:Sale[],seller:User,sellerOperations:SellerOperation,visits:VisitClientOperation[],productsAvailables:PresentationsAvailables[],date:string){
        
        let ticket =`\nREPORTE DE CIERRE\nVendedor: ${seller.name}\nFecha: ${date}\n-----------------------------------------\n`;
        ticket+=`\nART.    DESCR   CANT    PRECIO  IMPORTE\n-----------------------------------------`; 
        let amountContado:number=0;
        let amountCredito:number=0;
        let clients:string=`\n-----------------------------------------\nDOC NOMBRE  CLIENTE IMPORTE TIPOVENTA\n-----------------------------------------\n`;
        for(let venta of sales){
            for(let subOrder of venta.subSales){
                let productSae = await this.sqlServer.getProductSaeByKey(subOrder.presentation.keySae);
            ticket+=`\n${subOrder.product.name} ${subOrder.presentation.presentation} ${subOrder.presentation.presentationType}    ${subOrder.quantity} ${(productSae[0].UNI_MED as string).toUpperCase()}  ${this.pipeNumber(subOrder.amount)} `;
            if(venta.credit==0){
            amountContado+=venta.amount;
            }else{
            amountCredito+=venta.amount;
            }
            clients+=`${venta.folio}  ${venta.client.name}    $ ${this.pipeNumber(venta.amount)} ${venta.typeSale}\n`;
            }
        }
        ticket+=clients;
            ticket+=`\nVentas por concepto\nEFECTIVO        $ ${this.pipeNumber(amountContado)}\nCREDITO         $ ${this.pipeNumber(amountCredito)}\n-----------------\n$${this.pipeNumber(amountContado+amountCredito)}`;
        if(sellerOperations){
            let eatTextTime = this.getTimeDiff(sellerOperations.eatingTimeStart,sellerOperations.eatingTimeEnd,sellerOperations.date);
            
            ticket+=`\n-----------------------------------------\nHORA DE COMIDA: ${sellerOperations.eatingTimeStart}\n${eatTextTime}`;
        }
        ticket+=`\n------TIEMPO EN TIENDAS-----`;
        for(let visit of visits){
            ticket+=`\n ${visit.client.name} \n${this.getTimeDiff(visit.startVisitTime,visit.endVisitTime,visit.date)}`;
        }
        ticket+=`\n---------RESGUARDO----------`;
        for(let product of productsAvailables){
            ticket+=`\n ${ product.keySae} ${product.nameProduct} ${product.presentationType} \n ${product.quantity} ${product.isPz?"PZ":"KG"}\n----`;
        }
        return ticket;
    }

    async getResguardedTicket(productsAvailables:PresentationsAvailables[],name:string){
        let ticket=name.toUpperCase()+"\nROVIANDA SAPI DE CV\nAV.1 #5 Esquina Calle 1\nCongregación Donato Guerra\nParque Industrial Valle de Orizaba\nC.P 94780\nRFC 8607056P8\nTEL 272 72 46077, 72 4 5690\nINVENTARIO DISPONIBLE\n";
        for(let product of productsAvailables){
            ticket+=`-------------\n${product.nameProduct} ${product.presentationType} \nCantidad en piezas: ${product.quantity} ${product.isPz==false?`\nCantidad de kilos: ${product.weight}`:""}\n`;
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