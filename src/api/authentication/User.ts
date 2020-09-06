import { UserType, UserJsonResponseObj, userResponseObjValidator } from "./validation";
import { assertValidObjFromApi } from "../helpers";



export class User{
    
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly userType: UserType;
    readonly email: string;
    readonly phoneNumber: string;

    constructor(jsonResponse: UserJsonResponseObj){

        assertValidObjFromApi(userResponseObjValidator, 'User', jsonResponse);

        const json = jsonResponse;

        this.id = json.id;
        this.firstName = json.first_name;
        this.lastName = json.last_name;
        this.userType = json.user_type as UserType;
        this.email = json.email;
        this.phoneNumber = json.phone_number;

    }

    getFullName(){
        const capitalizedName = (s: string) => s.substring(0, 1).toUpperCase() + s.substring(1);
        return capitalizedName(this.firstName) + ' ' + capitalizedName(this.lastName);
    }

}


