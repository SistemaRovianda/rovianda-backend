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
    nameCheck:string;
    jobCheck:string;
    oven:number
    firstRevision: {
        hour:string;
        interTemp:string;
        ovenTemp:string;
        humidity:string;
        observations:string;
    }
}