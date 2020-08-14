export interface SausagedDTO{
    productId:number;
    temperature:string;
    date: string;
    loteMeat:string
    time:
    {
        hour:string;
        weight:number;
    };
}

export interface SausagedUpdateDTO{
    hour:string;
    weight:number;
}