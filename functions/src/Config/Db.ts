import "reflect-metadata";
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../Models/Entity/Users';
import { Entrances_Meat } from '../Models/Entity/Entrances.Meat';
import { File } from '../Models/Entity/Files';
import { PropsOrder } from '../Models/Entity/Props.Order';
import { ExtrasOrders } from '../Models/Entity/Extra.Orders';
import { Pin } from '../Models/Entity/Pin';
import { Fridges } from '../Models/Entity/Fridges'
import { Cooling } from '../Models/Entity/Cooling';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";
import { Product } from "../Models/Entity/Product";
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";


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
        Entrances_Meat,
        File,
        User,
        PropsOrder,
        ExtrasOrders,
        Pin,
        Fridges,
        Cooling,
        OutputsCooling,
        WarehouseDrief,
        Product,
        OutputsDrief
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