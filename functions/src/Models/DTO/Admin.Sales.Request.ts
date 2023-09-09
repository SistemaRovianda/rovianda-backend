import { DevolutionOldSubSales } from "../Entity/DevolutionOldSubSales";
import { DevolutionSellerRequest } from "../Entity/DevolutionSellerRequest";
import { Sale } from "../Entity/Sales";
import { DevolutionRequest } from "./PackagingDTO";

export interface AdminSalesRequest{
    clientsIds:number[],
    sellersIds:string[],
    productsIds:number[],
    type: string;
}

export interface ChartD3DataInterface{
    amount:number,
    quantity:number,
    weight:number,
    typeProduct:string,
    name:string,
    typePresentation:string,
    presentationId:number,
    //*dateStr:string,
    price:number,
    uniMed:string,
    comparation:string
}

export interface RankingSeller{
    amount:number,
    weight:number,
    name:string;
    sellerId:string;
}

export interface RankingSellerByProduct{
    amount:number,
    quantity:number,
    sellerId:string;
    name:string
}
export interface GeneralReportByDay{
    subAmount:number,
    quantity:number,
    product:string,
    presentation:string,
    folio:string,
    typeSale:string,
    name:string,
    date:string,
    amount:number,
    client:string,
    keyClient:number
}

export interface GeneralReportByWeek{
    presentationId:number,
    product:string,
    presentation:string,
    name:string,
    client:string,
    clientId:number,
    subAmount:number,
    quantity:number,
    weight:number,
    uniMed:string,
    week:number
}

export interface GeneralReportByMonth{
    presentationId:number,
    product:string,
    presentation:string,
    name:string,
    client:string,
    clientId:number,
    subAmount:number,
    quantity:number,
    weight:number,
    uniMed:string,
    month:string
}

export interface GeneralReportByYear{
    presentationId:number,
    product:string,
    presentation:string,
    name:string,
    client:string,
    clientId:number,
    subAmount:number,
    quantity:number,
    weight:number,
    uniMed:string,
    year:number
}

export interface OfflineNewVersionResponse{
    clients:OfflineNewVersionClient[],
    products:OfflineNewVersionProducts[],
    uid:string,
    count:number;
    nomenclature:string;
    name:string;
    lastSincronization:string;
    email:string;
    password:string;
    debts:SaleInterfaceRequest[],
    salesOfDay:SaleInterfaceRequest[],
    devolutionsRequest:DevolutionSellerRequest[],
    devolutionsSubSales:DevolutionOldSubSales[]
}
export interface SaleInterfaceRequest{
    folio:string,
    saleId:number,
    sellerId:string,
    keyClient:string,
    payed:number,
    amount:number,
    credit:number,
    typeSale:string,
    clientName:string,
    date:string,
    statusStr:string,
    status:boolean,
    clientId:number,
    products:SubSaleInterface[],
    cancelAutorized:string
 }

 export interface SubSaleInterface{
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



export interface OfflineNewVersionProducts{
    productId:number;
    productKey:string;
    name:string;
    presentationName:string;
    uniMed:string;
    price:number;
    secondPrice:number;
    quantity:number;
    presentationId:number;
    weightOriginal:number;
    esqKey:number,
    esqDescription:string;
}


export interface OfflineNewVersionClient{
    clientId:number;
    keyClient:number;
    sellerOwner:string;
    name:string;
    type:string;
    currentCreditUsed:number;
    creditLimit:number;
    monday:boolean;
    tuesday:boolean;
    wednesday:boolean;
    thursday:boolean;
    friday:boolean;
    saturday:boolean;
    sunday:boolean;
    cp:string;
    modified:boolean;
    street:string,
    municipality:string,
    suburb:string,
    extNum:number,
    latitude:number,
    longitud:number,
    status:string,
    phone:string,
    reference:string,
    contact:string
}

export interface SalesTypes{
    folio:string,
    amount:number,
    sellerName:string,
    clientName:string,
    date:string,
    status:string,
    dateSort:string,
}

export interface CancelRequest{
    requestId:number,
    sellerName:string,
    folio:string,
    date:string,
    saleId:number,
    createAt:string,
    status:string
}

export interface AdminProductsCatalog{
    id:number,
    product:string,
    presentation:string,
    price:string,
    weight:string,
    keySae:string,
    keyAltern:string,
    type:string,
    uniMed:string,
    quantityByPresentation:number,
    esqKey:number,
    esqDescription:string
}
export interface AdminPreRegisterProductDetails{
    productIdInSystem:number,
    name:string,
    price:number,
    keySae:string,
    uniMed:string,
    esqKey: number,
    descriptionImp:string
}

export interface RequestPreRegistProduct{
    productId:number,
    name:string,
    code:string,
    codeAltern:string,
    presentation:string,
    price:number,
    weight:number,
    type:string,
    quantityByPresentation:number,
    uniMed:string
    esqKey:number;
    esqDescription:string;
}