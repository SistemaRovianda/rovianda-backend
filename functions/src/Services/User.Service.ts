import { UserRepository } from "../Repositories/User.Repository";
import { RolesRepository } from "../Repositories/Roles.Repository";
import { User } from '../Models/Entity/User';
import { UserDTO } from '../Models/DTO/UserDTO';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { userGeneric } from '../Models/UserGeneric';
import { Request } from 'express';
import { Roles } from "../Models/Entity/Roles";
import { UserStatus } from "../Models/Enum/UserStatus";

export class UserService{
    private userRepository:UserRepository;
    private rolesRepository:RolesRepository
    constructor(private firebaseHelper:FirebaseHelper){
        this.userRepository = new UserRepository();
        this.rolesRepository = new RolesRepository();
        
    }

    async createUserF(userDTO:UserDTO, userGeneric:userGeneric){
        if(!userDTO.rolId) throw new Error("[400], rolId is required");
        let roles:Roles = await this.rolesRepository.getRoleById(userDTO.rolId);
        console.log(roles)
        //if(!roles[0])  throw new Error("[404],roles not found");
        if(!roles) throw new Error("[404], roles not found");
        if(!userDTO.name) throw new Error("[400], name is required");
        if(!userDTO.firstName) throw new Error("[400],firstName is required");
        if(!userDTO.lastName) throw new Error("[400], lastName is required");
        if(!userDTO.email) throw new Error("[400], email is required");
        if(!userDTO.password) throw new Error("[400], password is required");
        let us:User = await this.userRepository.getUserByEmail(userDTO.email);
        if(us) throw new Error("[409], email exist");
        let users:User= new User();
        users.name = userDTO.name+" "+userDTO.firstName+" "+userDTO.lastName;
        users.email = userDTO.email;
        users.job = userDTO.job;
        users.roles = roles;
        users.status= UserStatus.ACTIVE;
        return this.firebaseHelper.createUser(userGeneric).then(async(userRecord)=>{
            users.id = userRecord.uid;
            return await this.userRepository.saveUser(users);
        });
    }

    async createToken(uid){
        if(!uid) throw new Error("[400], uid is required");
        let user:User = await this.userRepository.getUserById(uid);
        if(!user) throw new Error("[404], user not found");
        return this.firebaseHelper.createToken(uid);
    }

    async createUser(user:User){
        return await this.userRepository.saveUser(user);
    }

    async getUserByName(name:string){
        return await this.userRepository.getUserByName(name);
    }

    async getUserById(req:Request){
        if(!req.params.uuid) throw new Error("[400], uuid is required");
        let user:User = await this.userRepository.getUserbyIdWithRol(req.params.uuid);
        if(!user || user.status!="ACTIVE")  throw new Error("[404],user not found");
        let response = {};
        response ={
            uuid: `${user.id}`,
            name: `${user.name}`,
            email: `${user.email}`,
            rol: `${user.roles.description}`,
            job: `${user.job}`,
            status: user.status
        };
        return response;
    }

    async getByEmail(email:string){
        return await this.userRepository.getUserByEmail(email);
    }

    async getAllUsers(){
        let users:User[] = await this.userRepository.getAllUsers();
        let response:any = []
        users.forEach(i =>{
            response.push({
                userId: `${i.id}`,
                fullName: `${i.name}`,
                email: i.email,
                rol: `${i.roles.description}`,
                job: `${i.job}`,
                status: i.status,
                rolId: i.roles.roleId
            })
        })
        return response;
    }

    async getUserByRol(rol:string){
        if(!rol) throw new Error("[400], rol is required");
        let roles:Roles = await this.rolesRepository.getRolByDescription(rol.toUpperCase());
        if(!roles) throw new Error("[404], rol not found");
        let response:any = [];
        roles.users.forEach(i =>{
            response.push({
                userId: `${i.id}`,
                fullName: `${i.name} `,
                rol: `${rol}`,
                job: `${i.job}`,
                status: i.status
            })
        });
        return response;
    }

    async getUserByUid(uid:string){
        if(!uid) throw new Error("[400], uid is required");
        let user:User = await this.userRepository.getUserById(uid);
        if(!user || user.status!="ACTIVE") throw new Error("[404], User not found");
        return user;
    }

    async getUserByFullName(name:string){
        let fullname= name.split(" ");
        let user:User = await this.userRepository.getUserByFullName(fullname[0],fullname[1],fullname[2]);
        if(!user) throw new Error("[404], User not found");
        return user;   
    }        

    async getByWarehouseId(warehouseId:string){
        let seller:User = await this.userRepository.getByWarehouseId(warehouseId);
        return seller;
    }

    async updateUserStatus(userId:string,status:string,name:string){
        let user = await this.userRepository.getUserById(userId);
        if(status != UserStatus.ACTIVE && status!=UserStatus.DELETED && status!=UserStatus.INACTIVE && status!=UserStatus.UPDATING) throw new Error("[400], status no valido");
        if(status==UserStatus.ACTIVE || status==UserStatus.INACTIVE){
            user.status=status;
        }else if(status==UserStatus.DELETED){
            user.status=status;
            await this.firebaseHelper.deleteUser(user.id);
        }else if(status==UserStatus.UPDATING){
            user.name=name;
        }
        await this.userRepository.saveUser(user);
    }
}