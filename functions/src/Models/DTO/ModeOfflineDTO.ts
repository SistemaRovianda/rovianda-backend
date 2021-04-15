

export interface ModeOffline{
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
    weightOriginal:number;
}

export interface ModeOfflineSaleInterface{
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