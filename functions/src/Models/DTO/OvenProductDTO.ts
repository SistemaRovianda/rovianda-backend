export interface OvenDTO{
    estimatedTime:string;
    newLote:string;
    pcc:string;
    productId:string;
    date:string;
    firstRevision: {
        hour:string;
        interTemp:string;
        ovenTemp:string;
        humidity:string;
        observations:string;
    }
}