import "reflect-metadata";
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { Pin } from '../Models/Entity/Pin';
import { Fridges } from '../Models/Entity/Fridges'
import { Cooling } from '../Models/Entity/Cooling';


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
        Pin,
        Fridges,
        Cooling
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