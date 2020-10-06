export interface routeInterface{
    url:string;
    method:string;
    controller:any;
    target:string;
    files?: Array<FileRequest>;
}

export interface FileRequest{
    name:string;
    isArray:boolean;
    size?:number;
}