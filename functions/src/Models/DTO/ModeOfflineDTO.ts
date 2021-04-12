

export interface ModeOffline{
    logedId:boolean;
    username:string;
    lastSincronization:string;
    sellerId:string;
    cashAcumulated:number;
    weightAcumulated:number;
    inventory: ModeOfflineInventory[],
    folioNomenclature:string;
    foliocount:string;
    sales:ModeOfflineSaleInterface[],
    debts:ModeOfflineSaleInterface[],
    clients:ModeOfflineClients[]
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
}

export interface ModeOfflineProductInterface{
    productKey:string;
    quantity:number;
    type:string;
    price:number;
    weightStandar:number;
}