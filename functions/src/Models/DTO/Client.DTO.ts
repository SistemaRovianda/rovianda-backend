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