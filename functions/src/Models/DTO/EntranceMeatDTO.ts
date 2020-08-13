export interface EntranceMeatDTO{

    proveedor:string;
    lotProveedor:string;
    createdAt:string;
    rawMaterial:string;
    weight:PropsEntrance3;
    temperature:PropsEntrance4;
    strageMaterial:PropsEntrance2;
    expiration:PropsEntrance2;
    packing: PropsEntrance2;
    odor: PropsEntrance2;
    transport:PropsEntrance2;
    texture: PropsEntrance2;
    fridge: PropsFridge;
    slaughterDate: PropsEntrance3;
    photo: string;
    job: string;
    qualityInspector:string;
    lotInternal:string;
    }

    export interface PropsEntrance{
        descriptions: string,
        accepted: boolean
    }

    export interface PropsEntrance2{
        observations: string,
        accepted: boolean
    }

    export interface PropsEntrance3{
        value: string,
        observations: string,
        accepted: boolean
    }

    export interface PropsEntrance4{
        value: string,
        descriptions: string,
        accepted: boolean
    }

    export interface PropsFridge{
        fridgeId: number,
        observations: string,
        accepted: boolean
        }