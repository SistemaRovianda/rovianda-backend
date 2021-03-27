import { Inspection } from "../../Models/Entity/Inspection";
import { OvenProducts } from "../../Models/Entity/Oven.Products";
import { SubOrderMetadata } from "../../Models/Entity/SubOrder.Sale.Seller.Metadata";

import { User } from "../../Models/Entity/User";
import LOGO from '../../Models/Logo';
import { PresentationsProductsRepository } from "../../Repositories/Presentation.Products.Repository";
import { SalesSellerRepository } from "../../Repositories/SaleSeller.Repository";
import { SalesRequestRepository } from "../../Repositories/SalesRequest.Repostitory";
import { SubOrderMetadataRepository } from "../../Repositories/SubOrder.Metadata.Repository";

import { UserRepository } from "../../Repositories/User.Repository";
export class EndedProductReport{
    private userRepository:UserRepository;
    private presentationProductRepository:PresentationsProductsRepository;
    private subOrdersRepository:SalesRequestRepository;
    private subOrdersMetadataRepository:SubOrderMetadataRepository;
    private orderSellerRepository:SalesSellerRepository;
    
    constructor(){
        this.userRepository = new UserRepository();
        this.presentationProductRepository = new PresentationsProductsRepository();
        this.subOrdersRepository = new SalesRequestRepository();
        this.subOrdersMetadataRepository = new SubOrderMetadataRepository();
        this.orderSellerRepository = new SalesSellerRepository();
    }

    async getReportOfEndedProduct(items:{ovenProduct:OvenProducts,inspection:Inspection[]}[]){
        let content = await this.getHeaderEndedProductReport();
        for(let item of items){
            for(let inspection of item.inspection ){
                content+=await this.getBodyEndedProductReport(inspection);
            }
        }
        content += await this.getFooterEndedProductReport();
        return content;
    }

    async getHeaderEndedProductReport(){
        return `<html></body><h4>ROVIANDA S.A.P.I. DE C.V</h4><h4>INSPECCIÓN DE PRODUCTO TERMINADO Y SALIDA</h4>`;
    }

    async getFooterEndedProductReport(){
        return `</body></html>`;
    }

    async getBodyEndedProductReport(inspection:Inspection){
        let userInspector:User = await this.userRepository.getUserById(inspection.userIspector);
        let presentationProduct  = await this.presentationProductRepository.getPresentationProductsById(inspection.presentationId);
        console.log(inspection.productId.name,inspection.productId.id,presentationProduct.presentationType,presentationProduct.id);
        let subOrders =  await this.subOrdersRepository.getByProductAndPresentation(inspection.productId,presentationProduct,false);
        console.log("Suborders: "+subOrders.length);
        let subOrdersIds = subOrders.map(x=>x.subOrderId);
        let subOrdersMetadata:SubOrderMetadata[] = await this.subOrdersMetadataRepository.findBySubOrdersIdsAndLotId(subOrdersIds,inspection.lotId);
        for(let subOrderM of subOrdersMetadata){
            let subOrder = await this.subOrdersRepository.getSubOrderById(subOrderM.subOrder.subOrderId);
            subOrderM.subOrder = subOrder;
            let orderSeller = await this.orderSellerRepository.getOrderById(subOrder.orderSeller.id);
            subOrderM.subOrder.orderSeller = orderSeller;
        }
        let content = `<table boder=1>
        <tr>
        <td colspan="2" rowspan="3">
        <img with="50px" height="50px" src="${LOGO.data}" >
        </td>
        <td colspan="3">Nombre: ${userInspector.name}</td>
        <td rowspan="3" ></td>
        </tr>

          <tr>
        <td colspan="3">Firma: </td>
        </tr>
          <tr>
        <td colspan="3">Puesto: ${userInspector.job}</td>
        </tr>
  
  <tr>
  <td>Producto:</td>
      <td colspan="3"> ${inspection.productId.name} ${presentationProduct.presentationType}</td>
 <td>Lote y caducidad: </td>   
    <td colspan="2"> fecha de ingreso: ${inspection.expirationDate}</td>
  </tr>
  
  <tr>
  <td colspan="2">Peso total del lote</td>
    <td colspan="2"></td>
    <td rowspan="2"></td>
     <td rowspan="2" colspan="2"></td>
  </tr>
  <tr>
  <td colspan="3">Número de paquetes o piezas</td>
    <td>${inspection.numberPackages}</td>
  </tr>
  <tr>
  <td colspan="2">Control</td>
      <td>Estándar</td>
      <td>Aceptado</td>
      <td>Rechazado</td>
    <td colspan="2">Observaciones</td>
  </tr>
  
    <tr>
  <td colspan="2">Empaque</td>
      <td>Sin daños y limpio</td>
      <td>${inspection.packagingControl==true?"X":""}</td>
      <td>${inspection.packagingControl==false?"X":""}</td>
 
    <td colspan="2"></td>
  </tr>
  <tr>
    <td colspan="2">Materia extraña</td>
      <td>Ausente</td>
      <td>${inspection.foreingMatter==true?"X":""}</td>
      <td>${inspection.foreingMatter==false?"X":""}</td>
   
    <td colspan="2"></td>
  </tr>
<tr>
  <td colspan="2">Transporte</td>
      <td>Limpio</td>
      <td>${inspection.transport==true?"X":""}</td>
      <td>${inspection.transport==false?"X":""}</td>
      
    <td colspan="2"></td>
  </tr>
	<tr>
  <td colspan="2">Peso por pieza</td>
      <td>Según empaque</td>
      <td>${inspection.packagingControl==true?"X":""}</td>
      <td>${inspection.packagingControl==false?"X":""}</td>
   
    <td colspan="2"></td>
  </tr>

	<tr>
  <td colspan="2">Temperatura</td>
      <td>Máximo 4ºC</td>
      <td>${inspection.temperature==true?"X":""}</td>
      <td>${inspection.temperature==false?"X":""}</td>
      
    <td colspan="2"></td>
  </tr>
  
  	<tr>
  <td colspan="2">Olor</td>
      <td>Caracteristico</td>
      <td>${inspection.odor==true?"X":""}</td>
      <td>${inspection.odor==false?"X":""}</td>
     
    <td colspan="2"></td>
  </tr>
  
  	<tr>
  <td colspan="2">Color</td>
      <td>Caracteristico</td>
      <td>${inspection.colour==true?"X":""}</td>
      <td>${inspection.colour==false?"X":""}</td>
  
    <td colspan="2"></td>
  </tr>
  
  	<tr>
  <td colspan="2">Textura</td>
      <td>Caracteristico</td>
      <td>${inspection.temperature==true?"X":""}</td>
      <td>${inspection.temperature==false?"X":""}</td>
      
    <td colspan="2"></td>
  </tr>
  <tr>
    <td colspan="7"></td>
  </tr>
  <tr>
    <td colspan="2">Día de salida</td>
        <td colspan="2">Cliente o vendedor</td>
        <td colspan="2">Cantidad entregada</td>
        <td>Cantidad del lote</td>
  </tr>
  `;
  let totalLot:number = +inspection.numberPackages;
for(let subOrderM of subOrdersMetadata){
    totalLot-=subOrderM.quantity;
    content+=`<tr>
    <td colspan="2"> ${subOrderM.outputDate.split("T")[0]} </td>
    <td colspan="2">${subOrderM.subOrder.orderSeller.seller.name}</td>
    <td  colspan="2">${subOrderM.quantity}</td>
    <td>${totalLot}</td>
    <tr>`;
}

  content+=`
</table>
        `;
    return content;
    }
    
}