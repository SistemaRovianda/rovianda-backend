import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Roles } from '../Models/Entity/Roles';

export class RolesRepository{
    private rolesRepository:Repository<Roles>;

    async getConnection(){
        if(!this.rolesRepository){
            this.rolesRepository = (await connect()).getRepository(Roles);
        }
    }

    async getRole(rol:string){
        await this.getConnection();
        console.log("consulta")
        return await this.rolesRepository.query(`SELECT * FROM roles WHERE description = "${rol}"`)
    }
    
}