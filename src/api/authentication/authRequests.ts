

import { fetchFromAPI, HttpMethod } from "../api";
import { LogInSignUpJsonResponseObj, logInSignUpResponseObjValidator } from "./validation";
import { assertValidObjFromApi } from "../helpers";
import { User } from "./User";
import store from "../../redux/store";
import { logInOrSignUpAction } from "../../redux/authentication";

const baseUrl = 'auth/users/'

export interface SignUpInfo {
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
    password: string,
}

export async function signUpUser(info: SignUpInfo) {
    const response = await fetchFromAPI<LogInSignUpJsonResponseObj>({
        path: baseUrl + 'sign-up/',
        method: HttpMethod.post,
        jsonBody: info,
    });
    assertValidObjFromApi(logInSignUpResponseObjValidator, 'LoginSignUp', response);
    const user = new User(response.user_object);
    store.dispatch(logInOrSignUpAction(response.access_token, user));
    return {
        accessToken: response.access_token,
        userObject: user,
    }
}

interface LogInInfo{
    email: string;
    password: string;
}

export async function logInUser(info: LogInInfo) {
    const response = await fetchFromAPI<LogInSignUpJsonResponseObj>({
        path: baseUrl + "log-in/",
        method: HttpMethod.post,
        jsonBody: { email: info.email, password: info.password, },
    });
    assertValidObjFromApi(logInSignUpResponseObjValidator, 'LogInSignUp', response);
    const user = new User(response.user_object);
    store.dispatch(logInOrSignUpAction(response.access_token, user));
    return {
        accessToken: response.access_token,
        userObject: user,
    }
}




