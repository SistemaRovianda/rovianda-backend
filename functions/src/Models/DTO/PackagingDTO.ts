export interface PackagingDTO{
    registerDate: string;
    productId: number;
    lotId : number;
    expiration: string;
    pieces : number;
    packs: number;
    weight: number;
    observations: string;
}

export interface UserPackagingDTO{
    nameElaborated: string;
    jobElaborated: string;
    nameVerify: string;
    jobVerify: string;
}