export interface SausagedDTO{
    temperature:string;
    date: string;
    time:
    {
        hour:string;
        weight:number;
    },
    defrostId:number;
}

export interface SausagedUpdateDTO{
    hour:string;
    weight:number;
}