export enum ProcessStatus{
    ACTIVE="ACTIVE",
    INACTIVE="INACTIVE"
}
export interface ProcessAvailablesToOven{
    recordId:number
    lotId:string;
    productId:number;
    productName:string;
    dateEndedProcess:string;
    lotDay:string;
}
export interface ProcessAvailablesByLots{
    productId:number;
    productName:string;
    lots: LotsAvailablesByProcess[]
}

export interface LotsAvailablesByProcess{
    dateEndedProcess:string;
    recordId:number;
    lotDay:string;
}