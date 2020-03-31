import "reflect-metadata";
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../Models/Entity/User';
import { Category } from "../Models/Entity/Category";
import { Condiment } from "../Models/Entity/Condiment";
import { Extra } from "../Models/Entity/Extra";
import { Order } from "../Models/Entity/Order";
import { ProductSale } from "../Models/Entity/Product.Sale";
import { Product } from "../Models/Entity/Product";
import { QualifyBussiness } from "../Models/Entity/QualifyBussiness";
import { Question } from "../Models/Entity/Question";
import { QuestionUser } from "../Models/Entity/QuestionUser";
import { Address } from "../Models/Entity/Address";
import { Payment } from "../Models/Entity/Payment";


const config: ConnectionOptions = {

    type: "mysql",
    host: "akatsuki-dev.cvhdnlqgutrq.us-west-2.rds.amazonaws.com",
    port: 3306,
    username: "admin",
    password: "Holamundo1250",
    database: "rovianda",
    synchronize: true,
    logging: false,
    entities: [
        User,
        Category,
        Condiment,
        Extra,
        Order,
        ProductSale,
        Product,
        QualifyBussiness,
        Question,
        QuestionUser,
        Address,
        Payment
    ]

}
let connection: Connection;
export const connect = async () => {
    if (!connection) {

        try {
            connection = await createConnection(config);
            console.log("Conexión exitosa");
        } catch (err) {
            console.log("Ocurrio un error con la conexión a base de datos", err);
        }
        return connection;
    } else {
        return connection;
    }

}