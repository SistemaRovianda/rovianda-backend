export interface SausagedDTO{
    productId:number;
    temperature:string;
    date: string;
    time:
    {
        hour1:string;
        weightInitial:number;
        hour2:string;
        weightMedium:number;
        hour3:string;
        weightFinal:number;
    };
}