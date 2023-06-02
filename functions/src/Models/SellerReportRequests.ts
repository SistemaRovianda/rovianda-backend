export interface SellerVisit{
    clientId:number,
    mustVisited:number,
    date:string,
    amount:number,
    name:string,
    keyClient:number,
    sellerId:string,
    sellerName:string
}

export interface SellerReportSoldPeriod{
    month:number,
    year:number,
    oldYear:number
    sellersIds:string[],
    typePeriod:number
}
export interface SellerScheduleReport{
    day:string,
    sellersIds:string[]
}

export interface SellerClientScheduleData{
    name:string,
    typeClient:string,
    keyClient:string,
    aspelKey:string,
    status:string,
    sellerName:string,
    city:string,
    suburb:string,
    street:string,
    monday:number,
    tuesday:number,
    wednesday:number,
    thursday:number,
    friday:number,
    saturday:number
}

export interface SellerSoldPeriod{
    quantity:number,
    productId:number,
    code:string,
    sellerId:string,
    product:string,
    sellerName:string,
    period:number
}

export interface SellerPeriod{
    period:string,
    items: SellerPeriod[]
}