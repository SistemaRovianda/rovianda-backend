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