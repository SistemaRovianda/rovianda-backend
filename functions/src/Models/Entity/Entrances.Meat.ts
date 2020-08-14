import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { File } from "./Files";
import { User } from "./User";



@Entity({name:"entrances_meat"})
export class EntranceMeat{

    @PrimaryGeneratedColumn({name:"id"})
    id:number;

    @Column()
    proveedor:string;

    @Column({name: "lote_proveedor"})
    loteProveedor:string;
    
    @Column({name:"created_at"})
    createdAt:string;

    @Column({name:"raw_material"})
    rawMaterial:string;

    @Column({name:"lote_interno"})
    loteInterno:string;
    
    @Column("simple-json")
    weight:{
        value: string,
        observations: string,
        accepted: boolean
        }

    @Column("simple-json")
    temperature:{
        value: string,
        descriptions: string,
        accepted: boolean
        }

    @Column("simple-json",{name:"strangeMaterial"})
    strangeMaterial:{
        observations: string,
        accepted: boolean
        }

    @Column("simple-json")
    expiration:{
        observations: string,
        accepted: boolean
        }
    
    @Column("simple-json")
    packing:{
        observations: string,
        accepted: boolean
        }

    @Column("simple-json")
    odor:{
        observations: string,
        accepted: boolean
        }
    
    @Column("simple-json")
    color:{
        observations: string,
        accepted: boolean
        }
    
    @Column("simple-json")
    transport:{
        observations: string,
        accepted: boolean
        }
    
    @Column("simple-json")
    texture:{
        observations: string,
        accepted: boolean
        }

    @Column("simple-json")
    fridge:{
        fridgeId: number,
        observations: string,
        accepted: boolean
        }
    
    @Column("simple-json",{name:"slaughter_date"})
    slaughterDate:{
        value: string,
        observations: string,
        accepted: boolean
        }
        
    @Column()
    job: string;
    
    @OneToOne(type => File,{eager:true,cascade:true})
    @JoinColumn()
    photo:File; 

    @ManyToOne(type => User, user => user.entrancesMeat,{eager:true})
    qualityInspector:User;

}

