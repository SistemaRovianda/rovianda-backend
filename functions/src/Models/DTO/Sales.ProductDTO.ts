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
   productId:number,
   presentationId:number,
   quantity:number;
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
    products: productSaled[]
 }

 export interface productSaled{
    productKey:string;
    quantity: number;
    price:number;
    total:number;
    taxSchema:number;
    warehouseKey:number;
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