import { WarehouseStatus } from "../Enum/WarehouseStatus";

export interface WarehouseDTO{
    loteId:string,
    productId:number,
    date:string
    status: WarehouseStatus
}

export interface WarehouseExitPackingDTO{
    loteId:string;
    productId:number;
    quantity: number;
    name: string;
    date: string;
}

export interface WarehouseExitDriefDTO{
    productId:number;
    loteId:string;
    observations:string;
    date:string;
}