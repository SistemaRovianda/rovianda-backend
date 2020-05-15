export interface OvenDTO{
    estimatedTime:string;
    newLote:string;
    pcc:string;
    productId:string;
    date:string;
    nameElaborated: string;
    jobElaborated: string;
    nameVerify: string;
    jobVerify: string;
    firstRevision: {
        hour:string;
        interTemp:string;
        ovenTemp:string;
        humidity:string;
        observations:string;
    }
}