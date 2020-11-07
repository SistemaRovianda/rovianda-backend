export interface SausagedDTO{
    temperature:string;
    date: string;
    time:
    {
        hour1:string;
        weightInitial:number;
    },
    defrostId:number;
    lotId:string;
}

export interface SausagedUpdateDTO{
    hour:string;
    weight:number;
}
export interface SausageHourRequest{
    hour:number;
    hourSaved:string;
    weigthSaved:string;
}