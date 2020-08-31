import { Address } from "../Models/Entity/Address";
import { Repository } from "typeorm";
import { connect } from "../Config/Db";

export class AddressRepository {
    private addressRepository: Repository<Address>;

    async getConnection() {
        if (!this.addressRepository)
            this.addressRepository =  (await (connect())).getRepository(Address);
    }

    async saveAddress(address: Address) {
        await this.getConnection();
        return await this.addressRepository.save(address);
    }

    async getAddressById(id: number) {
        await this.getConnection();
        return await this.addressRepository.find({
            where: {id}
        });
    }

    async getLastAddress(){
        await this.getConnection();
        console.log("consulta")
        return await this.addressRepository.findOne({ 
            order : {  
                id:"DESC" 
                } 
        });
    }

}
