export interface ClientDTO{
    clientId:number;
    clientName:string;
    debId:number;
    amount:number;
    daysPending:number;
}

export interface ClientsBySeller{
    debId:number;
    clientId:number;
    clientName:string;
    amount:number;
    createDay:string;
    days:number;
}

export interface ClientCreation{
    rfc: string;
    keyClient: string;
    client: string;
    typeClient: boolean;
    currentCredit: number;
    saleuid: string;
    daysCredit: number[];
    addressClient: addressClient; 
}

export interface addressClient{
    state: string;
       municipality: string;
       location: string;
       suburb: string;
       extNumber: number;
       street: string;
       reference: string;
}