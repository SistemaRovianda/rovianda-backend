import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { File } from "./Files";
import { User } from "./Users";



@Entity({name:"entrances_meat"})
export class Entrances_Meat{

    @PrimaryGeneratedColumn({name:"id"})
    id:number;

    @Column()
    proveedor:string;

    @Column()
    lote_proveedor:string;
    
    @Column()
    created_at:string;

    @Column()
    raw_material:string;

    @Column()
    lote_interno:string;
    
    @Column("simple-json")
    weight:{
        value: string,
        descriptions: string,
        accepted: boolean
        }

    @Column("simple-json")
    temperature:{
        value: string,
        descriptions: string,
        accepted: boolean
        }

    @Column("simple-json")
    strageMaterial:{
        value: string,
        descriptions: string,
        accepted: boolean
        }

    @Column("simple-json")
    expiration:{
        value: string,
        descriptions: string,
        accepted: boolean
        }
    
    @Column("simple-json")
    packing:{
        value: string,
        descriptions: string,
        accepted: boolean
        }

    @Column("simple-json")
    odor:{
        value: string,
        descriptions: string,
        accepted: boolean
        }
    
    @Column("simple-json")
    transport:{
        value: string,
        descriptions: string,
        accepted: boolean
        }
    
    @Column("simple-json")
    texture:{
        value: string,
        descriptions: string,
        accepted: boolean
        }

    @Column("simple-json")
    fridge:{
        fridgeld: string,
        descriptions: string,
        accepted: boolean
        }
    
    @Column("simple-json")
    slaughterDate:{
        value: string,
        descriptions: string,
        accepted: boolean
        }
        
    @Column()
    job: string;
    
    @ManyToMany(type => File, file => file.entrancesMeat)
    photo:File[]; 

    @OneToMany(type => User, user => user.entrancesMeat)
    qualityInspector:User[];

}

