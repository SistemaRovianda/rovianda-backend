import { String } from "lodash";
import { Sale } from "../Entity/Sales";
import { PreSale } from "../Entity/PreSale";

export interface SalesProductDTO{
    userId: string,
    urgent: boolean,
    requestedProducts: [
       {
          productId: number,
          presentationId: number,
          units: number
       }
    ]
 }

export interface OrderSellerRequest{
   products:Array<OrderSellerRequestProduct>,
   urgent:boolean;
   date:string;
}

export interface OrderSellerRequestProduct{
   keySae:string;   
   quantity:number;
   observations:string;
   outOfStock:boolean;
}

export interface PackagingProperties{
   productId:number;
   presentationId:number;
   units:number;
}

export interface SaleOrderDTO {
   urgent: boolean,
   date: string,
   products: [
     {
       presentationId: number,
       productId: number,
       quantity: number
     }
   ]
 }

 export interface SaleRequestForm{
    keyClient:number;
    sellerId:string;
    products: productSaled[],
    payed:number,
    amount:number;
    credit?:number,
    days?:number,
    typeSale:string
 }

 export interface productSaled{
    productKey?:string;
    quantity: number;
    price:number;
 }

 export interface ImpuSchemaSAE{
    CVE_ESQIMPU:number;
    DESCRIPESQ:string;
    IMPUESTO1:number;
    IMP1APLICA:number;
    IMPUESTO2:number;
    IMP2APLICA:number;
    IMPUESTO3:number;
    IMP3APLICA:number;
    IMPUESTO4:number;
    IMP4APLICA:number;
    STATUS:string;
    UUID:string;
    VERSION_SINC:string;
 }


 export interface SalesToSuperAdmin{
   sales:Sale[],
   totalCount:number
 }
 export interface PreSalesToSuperAdmin{
   sales:PreSale[],
   totalCount:number
 }

 export interface SubOrderMetadataOutputs{
      presentationId:number,
      lotId?:string,
      quantity:number,
      weight:number,
      sellerUid:string,
      presentation:string,
      name:string,
      keySae:string,
      expiration:string,
      observations:string,
      outputDate:string,
      price:number,
      total: number
 }

 export interface OrderSellerUpdateProperties{
      subOrderId:number,
      quantity:number;
 }


 export interface DevolutionSellerRequestBody{
    devolutionId:number,
    typeDevolution:string,
    observations:string,
    folio:string,
    createAt:string,
    productsNew:DevolutionSellerRequestProduct[],
    productsOld:DevolutionSellerRequestProduct[]
 }
 export interface DevolutionSellerRequestProduct{
    devolutionSellerRequestProductId:number,
    productId:number,
    presentationId:number,
    appSubSaleId:number;
    quantity:number,
    amount:number,
    createAt:string
 }

 export interface DevolutionEntityToDevolutionTicket{
   quantity:number,
   amount:number,
   name:string,
   presentation:string,
   uniMed:string
 }

 
export interface RequestDevolution{
   saleId:number,
   folio:string,
   sellerName:string,
   adminAccepted:string,
   status:string,
   dateSale:string,
   dateRequest:string,
   dateAttended:string,
   observations:string,
   originalTicket:string,
   modifiedTicket:string,
   devolutionProducts:ProductDevolution[]
}

export interface ProductDevolution{
   productName:string,
   quantity:number,
   price:number,
   uniMed:string
}

export interface SaleMetricsAcumulated{
   amount:number,
   tickets:number,
   ticketsCanceled:number
}