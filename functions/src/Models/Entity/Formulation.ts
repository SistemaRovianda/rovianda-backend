import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, JoinTable, OneToMany, ManyToOne } from "typeorm";
import { ProductRovianda } from "./Product.Rovianda";
import { Product } from "./Product";
import { OutputsDrief } from "./Outputs.Drief";


@Entity({ name: "formulation" })
export class Formulation {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => ProductRovianda,productR=>productR.formulations)
    productRoviandaId: ProductRovianda;

    @Column({ name: "lote_interno" })
    loteInterno: string;

    @Column()
    temp: string;

    @Column({ name: "water_temp" })
    waterTemp: string;

    @Column({ name: "new_lote" })
    newLote: string;

}