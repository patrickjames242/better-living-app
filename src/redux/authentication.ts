import { CustomReduxAction } from "./helpers";
import { User } from "../api/authentication/User";
import ActionStrings from "./actionStrings";
import { Optional } from "../helpers/general";
import AsyncStorage from '@react-native-community/async-storage';
import { UserType } from "../api/authentication/validation";



export type SetAuthStateAction = CustomReduxAction<{state: AuthenticationState}>;

export function setAuthStateAction(state: AuthenticationState): SetAuthStateAction{
    return {
        type: ActionStrings.authentication.SET_AUTH_STATE,
        state,
    }
}

export type LogInOrSignUpAction = CustomReduxAction<{ authToken: string, userObject: User }>;

export function logInOrSignUpAction(authToken: string, userObject: User): LogInOrSignUpAction {
    return {
        type: ActionStrings.authentication.LOG_IN_OR_SIGN_UP,
        authToken: authToken,
        userObject,
    }
}


export type UpdateUserObjectAction = CustomReduxAction<{ user: User }>;

export function updateUserObjectAction(user: User): UpdateUserObjectAction {
    return {
        type: ActionStrings.authentication.UPDATE_USER_OBJECT,
        user,
    }
}


export type LogOutAction = CustomReduxAction<{}>;

export function logOutAction(): LogOutAction {
    return {
        type: ActionStrings.authentication.LOG_OUT,
    }
}

export type AuthenticationActions = LogInOrSignUpAction | UpdateUserObjectAction | LogOutAction;

export type AuthenticationState = Optional<{
    userObject: User,
    authToken: string,
}>;

export function authenticationReducer(state: AuthenticationState = null, action: AuthenticationActions): AuthenticationState {
    const strings = ActionStrings.authentication;
    switch (action.type) {
        case strings.SET_AUTH_STATE: {
            const newState = (action as SetAuthStateAction).state;
            return newState;
        }
        case strings.LOG_IN_OR_SIGN_UP: {
            const { authToken, userObject } = (action as LogInOrSignUpAction);
            return { authToken, userObject };
        }
        case strings.UPDATE_USER_OBJECT: {
            if (state == null) { return null }
            const user = (action as UpdateUserObjectAction).user;
            return {
                ...state,
                userObject: user,
            }
        }
        case strings.LOG_OUT: {
            return null;
        }
        default: return null;
    }
}





// because importing store normally would lead to cyclic dependencies
import('./store').then(async module => {

    const storageAuthKey = 'authentication_state';

    module.addSelectedStateListener(state => state.authentication, authState => {
        const json = JSON.stringify(authState);
        AsyncStorage.setItem(storageAuthKey, json);
    });
    const initialState: AuthenticationState = await (async () => {
        const storedJsonString = await AsyncStorage.getItem(storageAuthKey);
        if (storedJsonString == null) { return null; }
        let json: AuthenticationState = JSON.parse(storedJsonString);
        return json && {
            ...json,
            userObject: new User({
                id: json.userObject.id,
                first_name: json.userObject.firstName,
                last_name: json.userObject.lastName,
                user_type: json.userObject.userType as UserType,
                email: json.userObject.email,
                phone_number: json.userObject.phoneNumber,
            }),
        }
    })();
    module.default.dispatch(setAuthStateAction(initialState));
});





