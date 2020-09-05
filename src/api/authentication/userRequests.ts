import { fetchFromAPI, HttpMethod } from "../api";
import { User } from "./User";
import { UserJsonResponseObj } from "./validation";
import store from "../../redux/store";
import { updateUserObjectAction } from "../../redux/authentication";


const basePath = 'auth/users/'

export async function updateUserInfo(
    userId: number,
    userInfo: {
        first_name?: string,
        last_name?: string,
        phone_number?: string,
    }
) {
    const result = await fetchFromAPI<UserJsonResponseObj>({
        method: HttpMethod.put,
        path: basePath + userId + '/',
        jsonBody: userInfo,
    });
    const user = new User(result);
    store.dispatch(updateUserObjectAction(user));
    return user;
}


export function changePassword(currentPassword: string, newPassword: string){
    return fetchFromAPI<null>({
        method: HttpMethod.put,
        path: basePath + 'change-password/',
        jsonBody: {
            current_password: currentPassword, 
            new_password: newPassword,
        }
    });
}

export function changePasswordWithVerificationCode(props: {verification_code: string, email: string, new_password: string}){
    return fetchFromAPI<null>({
        method: HttpMethod.put,
        path: basePath + 'forgot-password/',
        jsonBody: props,
    });
}

