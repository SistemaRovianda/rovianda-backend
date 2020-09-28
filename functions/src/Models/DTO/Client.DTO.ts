export interface ClientDTO{
    clientId:number;
    name:string;
    firstSurname:string;
    lastSurname:string;
    debId:number;
    amount:number;
    daysPending:number;
}

export interface ClientsBySeller{
    debId:number;
    clientId:number;
    name:string;
    firstSurname:string;
    lastSurname:string;
    amount:number;
    createDay:string;
    days:number;
}

export interface ClientCreation{
    rfc: string;
    keyClient: string;
    name: string;
    firstSurname: string;
    lastSurname: string;
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
       extNumber: string;
       street: string;
       reference: string;
}