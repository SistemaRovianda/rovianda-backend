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