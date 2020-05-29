import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, JoinTable, ManyToOne } from "typeorm";
import { ProductRovianda } from "./Product.Rovianda";
import { Product } from "./Product";
import { OutputsDrief } from "./Outputs.Drief";


@Entity({ name: "formulation" })
export class Formulation {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type=>ProductRovianda, productRovianda=>productRovianda.formulation, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({ name: "product_rovianda_id" })
    productRovianda:ProductRovianda;

    @Column({ name: "lote_interno" })
    loteInterno: string;

    @Column()
    temp: string;

    @Column({ name: "water_temp" })
    waterTemp: string;

    @Column({ name: "new_lote" })
    newLote: string;
}