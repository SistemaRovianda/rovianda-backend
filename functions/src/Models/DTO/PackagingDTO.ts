export interface PackagingDTO{
    registerDate: string;
    productId: number;
    lotId : number;
    expiration: string;
    products: [
        {
            pieces: number;
            packs: number;
            weight: number;
            observations: string;
        }
    ]
}