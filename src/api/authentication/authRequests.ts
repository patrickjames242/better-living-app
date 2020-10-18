

import { fetchFromAPI, HttpMethod } from "../api";
import { LogInSignUpJsonResponseObj, logInSignUpResponseObjValidator } from "./validation";
import { assertValidObjFromApi } from "../helpers";
import { User } from "./User";
import store, { addSelectedStateListener, AppState } from "../../redux/store";
import { logInOrSignUpAction } from "../../redux/authentication";
import { Notifications } from "expo";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { RealtimeUpdatesConnectionState } from "../../redux/realtimeUpdates";

const baseUrl = 'auth/users/'

export interface SignUpInfo {
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
    password: string,
}

export async function signUpUser(info: SignUpInfo) {
    const token = await getExpoNotificationDeviceTokenIfPossible();
    const response = await fetchFromAPI<LogInSignUpJsonResponseObj>({
        path: baseUrl + 'sign-up/',
        method: HttpMethod.post,
        jsonBody: {
            device_notification_id: token,
            ...info
        },
    });
    assertValidObjFromApi(logInSignUpResponseObjValidator, 'LoginSignUp', response);
    const user = new User(response.user_object);
    store.dispatch(logInOrSignUpAction(response.access_token, user));
    return {
        accessToken: response.access_token,
        userObject: user,
    }
}

interface LogInInfo {
    email: string;
    password: string;
}

export async function logInUser(info: LogInInfo, updateReduxState: boolean = true) {
    const token = await getExpoNotificationDeviceTokenIfPossible();
    const response = await fetchFromAPI<LogInSignUpJsonResponseObj>({
        path: baseUrl + 'log-in/',
        method: HttpMethod.post,
        jsonBody: {
            ...info,
            device_notification_id: token,
        },
    });
    assertValidObjFromApi(logInSignUpResponseObjValidator, 'LogInSignUp', response);
    const user = new User(response.user_object);
    if (updateReduxState) {
        store.dispatch(logInOrSignUpAction(response.access_token, user));
    }
    return {
        accessToken: response.access_token,
        userObject: user,
    }
}

export function testPasswordValidity(password: string) {
    return fetchFromAPI({
        path: baseUrl + 'test-password-validity/?password=' + password,
        method: HttpMethod.get,
    });
}


async function sendCurrentDeviceIdToServerAsAnonymousUser() {
    const token = await Notifications.getExpoPushTokenAsync()
    await fetchFromAPI({
        path: 'auth/add-anonymous-user-device-id/',
        method: HttpMethod.put,
        jsonBody: {
            device_notification_id: token,
        },
    });
}


export async function getExpoNotificationDeviceTokenIfPossible() {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        return await Notifications.getExpoPushTokenAsync()
    }
}




(() => {
    
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;

    const deviceTokenNeedsToBePushedKey = 'deviceTokenNeedsToBePushed';
    const _true = 'true';
    const _false = 'false';

    const authObserver = async (authentication: AppState['authentication']) => {
        if (authentication == null) {
            await AsyncStorage.setItem(deviceTokenNeedsToBePushedKey, _true);
            await sendCurrentDeviceIdToServerAsAnonymousUser();
            await AsyncStorage.setItem(deviceTokenNeedsToBePushedKey, _false);
        } else {
            await AsyncStorage.setItem(deviceTokenNeedsToBePushedKey, _false);
        }
    }

    // observing the connection state because this tells us that the device has just connected to the internet
    const connectionStateObserver = async (state: AppState['realtimeUpdates']['connectionState']) => {
        if (
            state === RealtimeUpdatesConnectionState.connected &&
            await AsyncStorage.getItem(deviceTokenNeedsToBePushedKey) !== _false // so that if the value hasn't been set, the block will still be executed
        ) {
            await sendCurrentDeviceIdToServerAsAnonymousUser();
            await AsyncStorage.setItem(deviceTokenNeedsToBePushedKey, _false);
        }
    }

    const state = store.getState();
    authObserver(state.authentication);
    connectionStateObserver(state.realtimeUpdates.connectionState);

    addSelectedStateListener(state => state.authentication, authObserver);
    addSelectedStateListener(state => state.realtimeUpdates.connectionState, connectionStateObserver)

})();

