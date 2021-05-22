import {connect} from '../Config/Db';
import { Equal, IsNull, Not, Repository } from 'typeorm';
import { User } from '../Models/Entity/User';
import { Roles } from '../Models/Entity/Roles';
export class UserRepository{
    private userRepository:Repository<User>;

    async getConnection(){
        if(!this.userRepository){
            this.userRepository = (await connect()).getRepository(User);
        }
    }

    async saveUser(user:User){
        await this.getConnection();
        return await this.userRepository.save(user);
    }

    async getUserById(userId:string){
        await this.getConnection();
        return await this.userRepository.findOne({id:userId});
    }


    async getUserbyIdWithRol(id:string){
        await this.getConnection();
        return await this.userRepository.findOne({id},{relations:["roles"]});
    }

    async getUserByName(name:string){
        await this.getConnection();
        return await this.userRepository.findOne({
            where: {name: `${name}`},
        });
    }

    async getUserByEmail(email:string){
        await this.getConnection();
        return await this.userRepository.findOne({
            email
        });
    }

    async getAllUsers(){
        await this.getConnection();
        return await this.userRepository.find({relations:["roles"]});
    }

    //87.- Servicio [GET] /report/formulation/{iniDate}/{finDate}
    async getByFullName(name:string){
        await this.getConnection();
        return await this.userRepository.query(`
        SELECT * FROM users WHERE name = "${name}"`);
    }

    async getByFullNameJob(name:string,firstSurname:string,lastSurname:string,job:string){
        await this.getConnection();
        return await this.userRepository.query(`
        SELECT * FROM users WHERE name = "${name}" 
        AND first_surname = "${firstSurname}" 
        AND last_surname = "${lastSurname}" 
        AND job = "${job}"`);
    }

    async getByRol(roles:Roles){
        await this.getConnection();
        return await this.userRepository.find({roles});
    }

    async getUserByFullName(name:string,firstSurname:string,lastSurname:string){
        await this.getConnection();
        return await this.userRepository.findOne({
            where: {name: `${name}`, firstSurname:`${firstSurname}`, lastSurname:`${lastSurname}`},
        });
    }

    async getByWarehouseId(warehouseKeySae:string){
        await this.getConnection();
        return await this.userRepository.findOne({warehouseKeySae});
    }

    async getAllSellers(rol:Roles){
        await this.getConnection();
        return await this.userRepository.find({where:{roles:rol,cve:Not(IsNull())}}); 
    }  

    async getAllSellersWithCVE(){
        await this.getConnection();
        return await this.userRepository.query(`select * from users where rol_id=10 and cve is not null and cve <>"";`) as any[];
    }  
}