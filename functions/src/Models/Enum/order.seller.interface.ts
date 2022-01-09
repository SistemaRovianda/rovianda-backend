export interface OrderSellerInterface{
    orderSellerId:number,
    dateAttended:string,
    clientCode:string,
    warehouseCode:string,
    amount:number,
    saeKey:string,
    folioRemission:number,
    subOrders: SubOrderSellerInterface[],
}

export interface SubOrderSellerInterface{
    esqImp: number,
    amount:number,
    quantity:number,
    quantityByAbarrotes:number,
    presentationCode:string,
    typeProduct:string,
    presentationCodeAltern:string,
    uniMed:string
}