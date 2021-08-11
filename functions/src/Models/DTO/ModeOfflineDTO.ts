

export interface ModeOffline{
    limitOfSales:number,
    logedId:boolean;
    username:string;
    lastSincronization:string;
    sellerId:string;
    cashAcumulated:number;
    weightAcumulated:number;
    inventory: ModeOfflineInventory[],
    folioNomenclature:string;
    folioCount:string;
    sales:ModeOfflineSaleInterface[],
    debts:ModeOfflineSaleInterface[],
    clients:ModeOfflineClients[],
    clientsToVisit:ModeOfflineClients[]
}

export interface ModeOfflineClients{
    keyClient:string;
    clientName:string;
    rfc:string;
    type:string;
    clientId:number;
}

// export interface ModeOfflineDebst{
//     folio:string;
//     keyClient:number;
//     products:ModeOfflineInventory[],
//     payed:number,
//     amount:number,
//     credit:number,
//     typeSale:string
// }

export interface ModeOfflineInventory{
    codeSae:string;
    productName:string;
    uniMed:string;
    weight:number;
    pieces:number;
    price:number;
    presentation:string;
    presentationId:number;
    productId:number;
    weightOriginal:number;
}

export interface ModeOfflineSaleInterface{
    saleId:number;
    folio:string;
    sellerId:string;
    keyClient:string;
    products:ModeOfflineProductInterface[],
    payed:number;
    amount:number;
    credit:number;
    typeSale:string;   
    clientName:string;
    date:string;
    status:boolean;
    statusStr:string;
}


export interface ModeOfflineProductInterface{
    productKey:string;
    quantity:number;
    type:string;
    price:number;
    weightStandar:number;
    productName:string;
    productPresentationType:string;
}

export interface ModeOfflineRequestSincronization{
    salesMaked:MOSRM[];
    debts:MODR[],
    sales:MOSR[]
}

export interface MOSR{
    saleId:number;
    folio:string;
    statusStr:string;
    status:boolean;
    date:string;
}

export interface MODR{
    saleId:number;
    folio:string;
    typeSale:string;
    date:string;
    status:boolean;
}

export interface MOSRM{
    folio:string;
    date:string;
    amount:number;
    payedWith:number;
    credit:number;
    typeSale:string;
    statusStr:string;
    status:boolean;
    sellerId:string;
    clientId:string;
    products:MOSRMP[]
}

export interface DebtsRequest{
    folio:string,
    payedType:string,
    datePayed:string,
    amountPayed:number
}

export interface MOSRMP{
    quantity:number;
    amount:number;
    productId:number;
    presentationId:number;
}
