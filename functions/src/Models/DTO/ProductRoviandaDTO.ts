export interface ProductRoviandaDTO{
    name:string;
    ingredients:Array<number>;
}

export interface SaveProductRoviandaDTO{
    code: string,
    nameProduct: string,
    ingredents: [
       {
          productId: number,
          nameProduct: string
       }
    ],
    presentations: [
       {
          presentation: number,
          typePresentation: string,
          pricePresentation: string
       }
    ]
}