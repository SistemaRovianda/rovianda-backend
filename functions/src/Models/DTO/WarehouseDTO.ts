import { WarehouseStatus } from "../Enum/WarehouseStatus";

export interface WarehouseDTO{
    loteId:string,
    productId:number,
    date:string
    status: WarehouseStatus
}

export interface WarehousePackingDTO{
    warehouseId:number,
    date:string
    status: WarehouseStatus
}

export interface WarehouseCollingDTO{
    loteId:string;
    fridgeId:number;
    date:string;
    status: WarehouseStatus;
    materialId:number;
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