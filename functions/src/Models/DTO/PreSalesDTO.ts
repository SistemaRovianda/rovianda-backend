import { OfflineNewVersionClient, OfflineNewVersionProducts } from "./Admin.Sales.Request";

export interface OfflinePreSaleNewVersionResponse{
    clients:OfflineNewVersionClient[],
    products:OfflineNewVersionProducts[],
    uid:string,
    count:number;
    nomenclature:string;
    name:string;
    lastSincronization:string;
    email:string;
    password:string;
    preSalesOfDay:SaleInterfaceRequestForPresale[],
    debts?:SaleInterfaceRequestForPresale[]
}

export interface SaleInterfaceRequestForPresale{
    folio:string,
    folioSale:string,
    preSaleId:number,
    sellerId:string,
    keyClient:string,
    payed:number,
    amount:number,
    typeSale:string,
    clientName:string,
    date:string,
    dateToDeliver:string,
    statusStr:string,
    clientId:number,
    solded:boolean,
    urgent:boolean,
    products:SubSaleInterfaceForPresale[],
    dateSolded:string
 }

 export interface SubSaleInterfaceForPresale{
    subSaleAppId:number;
    subSaleServerId:number,
    productKey:string,
    quantity: number,
    price: number,
    weightStandar:number,
    productName:string,
    productPresentationType:string,
    presentationId:number,
    productId:number,
    uniMed:string,
    esqKey:number,
    esqDescription:string;
 }

 export interface ModelUpdatePresaleRequest{
    folioPresale:string,
    folioForSale:string,
    typePayment:string,
    dateSolded:string,
    modificated:boolean,
    modifications:ModificationsPreSale[]
 }

 export interface ModificationsPreSale{
   presentationId:number,
   quantity:number,
   amount:number
 }
 export interface ModelUpdatePresaleResponse{
    folioPreSale:string
 }

 export interface ModelDebtDeliverRequest{
   createdAt:string,
   folioSale:string,
   payedType:string,
 }

 export interface ModelDebtDeliverResponse{
   folioPreSale:string
 }