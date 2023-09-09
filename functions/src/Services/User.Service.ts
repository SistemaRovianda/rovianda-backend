import { UserRepository } from "../Repositories/User.Repository";
import { RolesRepository } from "../Repositories/Roles.Repository";
import { User } from '../Models/Entity/User';
import { SimpleUserUpdateRequest, UpdatePassword, UserDTO, UserPreSaleRegisterRequest, UserPreSaleRegisterResponse, UserPreSaleUpdateRequest, UserRegisterRequest, UserRegisterResponse, UserSellerRegisterRequest, UserSellerRegisterResponse, UserSellerUpdateRequest } from '../Models/DTO/UserDTO';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { userGeneric } from '../Models/UserGeneric';
import { Request } from 'express';
import { Roles } from "../Models/Entity/Roles";
import { UserStatus } from "../Models/Enum/UserStatus";
import { PreSalesVinculationSellerRepository } from "../Repositories/PreSalesVinculationSeller.Repository";
import { PreSalesVinculationSeller } from "../Models/Entity/PreSalesVinculationSeller";
import { SqlSRepository } from "../Repositories/SqlS.Repositoy";

export class UserService{
    private userRepository:UserRepository;
    private rolesRepository:RolesRepository;
    private preSaleVinculationSellerRepository:PreSalesVinculationSellerRepository;
    private sqlRepository:SqlSRepository;
    constructor(private firebaseHelper:FirebaseHelper){
        this.userRepository = new UserRepository();
        this.rolesRepository = new RolesRepository();
        this.preSaleVinculationSellerRepository = new PreSalesVinculationSellerRepository();
        this.sqlRepository = new SqlSRepository();
    }

    async updateUserPassword(userPassword:UpdatePassword){
        let user  = await this.userRepository.getUserById(userPassword.uid);
        if(user){
            this.firebaseHelper.updateUserFirebasePassword(userPassword.uid,userPassword.password);
        }
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

    async createSimpleUser(request:UserRegisterRequest){
        let userAlreadyExist = await this.userRepository.getUserByEmail(request.email);
        if(userAlreadyExist) throw new Error("[409], El correo ya existe");
        let user:User = new User();
        let userFirebase = await this.firebaseHelper.createUser({name: request.name,email: request.email,password: request.password,firstName:'',lastName:''});
        user.id = userFirebase.uid;
        user.createdAt=new Date().toISOString();
        user.name=request.name;
        user.saeKey=0;
        user.email=request.email;
        user.job=request.jobDescription;
        user.warehouseKeySae=null;
        let rol = await this.rolesRepository.getRolByDescription(request.rol);
        if(!rol) throw new Error("[404],No existe el rol");
        user.roles=rol;
        user.status="ACTIVE";
        user.cve=null;
        await this.userRepository.saveUser(user);
    }

    async getSimpleUserDetails(uid:string){
        let user:User = await this.userRepository.getUserbyIdWithRol(uid);
        if(!user) throw new Error("[404], No existe el usuario");
        let response:UserRegisterResponse = {
            email: user.email,
            jobDescription: user.job,
            name: user.name,
            rol: user.roles.description,
            password:""
        };
        return response;
    }
    async updateSimpleUser(uid:string,request:SimpleUserUpdateRequest){
        let user:User = await this.userRepository.getUserById(uid);
        if(!user) throw new Error("[404],El usuario no existo");
        user.name=request.name;
        user.job=request.jobDescription;
        if(request.password!=""){
            await this.firebaseHelper.updateUserFirebasePassword(uid,request.password);
        }
        await this.userRepository.saveUser(user);
    }

    async createSellerUser(request:UserSellerRegisterRequest){
        let userAlreadyExist = await this.userRepository.getUserByEmail(request.email);
        if(userAlreadyExist) throw new Error("[409], El correo ya existe");
        userAlreadyExist = await this.userRepository.getByCve(request.folio);
        if(userAlreadyExist) throw new Error("[409], El folio ya esta siendo utilizado por otro vendedor/repartidor folio:"+request.folio);
        let user:User = new User();
        let userFirebase = await this.firebaseHelper.createUser({name: request.name,email: request.email,password: request.password,firstName:'',lastName:''});
        user.id = userFirebase.uid;
        user.createdAt=new Date().toISOString();
        user.name=request.name;
        user.saeKey=request.keySae;
        user.email=request.email;
        user.job=request.jobDescription;
        user.warehouseKeySae=request.warehouseId;
        let rol = await this.rolesRepository.getRolByDescription(request.rol);
        if(!rol) throw new Error("[404],No existe el rol");
        user.roles=rol;
        user.status="ACTIVE";
        user.cve=request.folio;
        await this.sqlRepository.updateWarehouse(request.warehouseId,request.name);
        await this.userRepository.saveUser(user);
    }

    async getSellerUserDetails(uid:string){
        let user:User = await this.userRepository.getUserbyIdWithRol(uid);
        if(!user) throw new Error("[404], No existe el usuario");
        let response:UserSellerRegisterResponse={
            email: user.email,
            folio:user.cve,
            keySae: user.saeKey,
            jobDescription: user.job,
            name: user.name,
            password: "",
            rol: user.roles.description,
            warehouseId: user.warehouseKeySae
        };
        return response;
    }

    async updateSellerUser(uid:string,request:UserSellerUpdateRequest){
        let user:User = await this.userRepository.getUserbyIdWithRol(uid);
        if(!user) throw new Error("[404], No existe el usuario");
        user.name=request.name;
        if(user.warehouseKeySae!=request.warehouseId){
            await this.sqlRepository.desassignedWarehouse(user.warehouseKeySae);
            user.warehouseKeySae=request.warehouseId;
            await this.sqlRepository.updateWarehouse(request.warehouseId,request.name);
        }
        user.saeKey=request.keySae;
        user.cve=request.folio;
        user.job=request.jobDescription;
        if(request.password!=""){
            await this.firebaseHelper.updateUserFirebasePassword(uid,request.password);
        }
        await this.userRepository.saveUser(user);
    }

    async createPreSaleUser(request:UserPreSaleRegisterRequest){
        let userAlreadyExist = await this.userRepository.getUserByEmail(request.email);
        if(userAlreadyExist) throw new Error("[409], El correo ya existe");
        userAlreadyExist = await this.userRepository.getByCve(request.folio);
        if(userAlreadyExist) throw new Error("[409], El folio ya esta siendo utilizado por otro vendedor/repartidor folio: "+request.folio);
        let user:User = new User();
        let userFirebase = await this.firebaseHelper.createUser({name: request.name,email: request.email,password: request.password,firstName:'',lastName:''});
        user.id = userFirebase.uid;
        user.createdAt=new Date().toISOString();
        user.name=request.name;
        user.saeKey=0;
        user.email=request.email;
        user.job=request.jobDescription;
        user.warehouseKeySae=null;
        let rol = await this.rolesRepository.getRolByDescription(request.rol);
        if(!rol) throw new Error("[404],No existe el rol");
        user.roles=rol;
        user.status="ACTIVE";
        user.cve=request.folio;
        await this.userRepository.saveUser(user);
        for(let sellerId of request.sellers){
            let preSaleVinculationSeller:PreSalesVinculationSeller = new PreSalesVinculationSeller();
            preSaleVinculationSeller.preSaleSellerId=user.id;
            preSaleVinculationSeller.deliverUserId=sellerId;
            await this.preSaleVinculationSellerRepository.savePreSaleVinculationSeller(preSaleVinculationSeller);
        }
    }

    async getPreSaleUserDetails(uid:string){
        let user:User = await this.userRepository.getUserbyIdWithRol(uid);
        if(!user) throw new Error("[404], El usuario no existe");
        let preSalesSellersVinculated = await this.preSaleVinculationSellerRepository.getAllPreSalesVinculationSellerByPreSaleSellerId(uid);
        let response:UserPreSaleRegisterResponse={
            email: user.email,
            folio: user.cve,
            keySae: user.saeKey,
            jobDescription: user.job,
            name: user.name,
            password: "",
            rol: user.roles.description,
            sellers: preSalesSellersVinculated.map(x=>x.deliverUserId),
            warehouseId: user.warehouseKeySae
        };
        return response;   
    }

    async updatePreSaleUser(uid:string,request:UserPreSaleUpdateRequest){
        let user:User = await this.userRepository.getUserbyIdWithRol(uid);
        if(!user) throw new Error("[404], El usuario no existe");
        let preSalesSellersVinculated = await this.preSaleVinculationSellerRepository.getAllPreSalesVinculationSellerByPreSaleSellerId(uid);
        let toDelete:PreSalesVinculationSeller[] = preSalesSellersVinculated.filter(x=>!request.sellers.includes(x.deliverUserId));
        let deleteIds = toDelete.map(x=>x.deliverUserId);
        let ids = preSalesSellersVinculated.filter(x=>!deleteIds.includes(x.deliverUserId)).map(x=>x.deliverUserId);
        let toAdd:string[]= request.sellers.filter(x=>!ids.includes(x))
        for(let item of toDelete){
            await this.preSaleVinculationSellerRepository.deletePreSaleVinculation(item);
        }
        for(let uid of toAdd){
            let preSaleVinculationSeller:PreSalesVinculationSeller = new PreSalesVinculationSeller();
            preSaleVinculationSeller.deliverUserId=uid;
            preSaleVinculationSeller.preSaleSellerId=user.id;
            await this.preSaleVinculationSellerRepository.savePreSaleVinculationSeller(preSaleVinculationSeller);
        }
        
        user.name=request.name;
        user.cve=request.folio;
        user.job=request.jobDescription;
        if(request.password!=null){
            await this.firebaseHelper.updateUserFirebasePassword(uid,request.password);
        }
        await this.userRepository.saveUser(user);
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
                rolId: i.roles.roleId,
                createAt: i.createdAt
            })
        })
        return response;
    }

    async getUserByRol(rol:string){
        if(!rol) throw new Error("[400], rol is required");
        let roles:Roles = await this.rolesRepository.getRolByDescription(rol.toUpperCase());
        if(!roles) throw new Error("[404], rol not found");
        let response:any = [];
        roles.users=roles.users.filter(x=>x.status=="ACTIVE");
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