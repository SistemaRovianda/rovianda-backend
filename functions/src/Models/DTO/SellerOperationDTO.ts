export interface SellerOperationDTO{
    sellerUid:string;
}

export interface SellerVisitsReportRequest{
    sellersIds:string[],
    date:string
}