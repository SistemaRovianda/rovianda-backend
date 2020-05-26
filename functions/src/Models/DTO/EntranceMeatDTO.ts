export interface EntranceMeatDTO{

    proveedor:string;
    lotProveedor:string;
    createdAt:string;
    rawMaterial:string;
    weight:PropsEntrance;
    temperature:PropsEntrance;
    strageMaterial:PropsEntrance;
    expiration:PropsEntrance;
    packing: PropsEntrance;
    odor: PropsEntrance;
    transport:PropsEntrance
    texture: PropsEntrance;
    fridge: PropsFridge;
    slaughterDate: PropsEntrance;
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
    export interface PropsFridge{
        fridgeId: number,
        descriptions: string,
        accepted: boolean
        }