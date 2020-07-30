export interface EntranceMeatDTO{

    proveedor:string;
    lotProveedor:string;
    createdAt:string;
    rawMaterial:string;
    weight:PropsEntrance2;
    temperature:PropsEntrance;
    strageMaterial:PropsEntrance2;
    expiration:PropsEntrance2;
    packing: PropsEntrance2;
    odor: PropsEntrance2;
    transport:PropsEntrance2;
    texture: PropsEntrance2;
    fridge: PropsFridge;
    slaughterDate: PropsEntrance2;
    photo: string;
    job: string;
    qualityInspector:string;
    lotInternal:string;
    }

    export interface PropsEntrance{
        value: string,
        descriptions: string,
        accepted: boolean
    }

    export interface PropsEntrance2{
        value: string,
        observations: string,
        accepted: boolean
    }

    export interface PropsFridge{
        fridgeId: number,
        observations: string,
        accepted: boolean
        }