export interface PackagingDTO{
    registerDate: string;
    productId: number;
    lotId : number;
    expiration: string;
    products: [
        {
            presentationId: number;
            units:number
            weight: number;
            observations: string;
        }
    ]
 }

export interface UserPackagingDTO{
    nameElaborated: string;
    jobElaborated: string;
    nameVerify: string;
    jobVerify: string;
}

export interface UserPackaginggDTO{
    userId: string;
}

export interface PackagingAssignedDTO{
    boxs: number,
    presentationId: number,
    packagingId: number
}