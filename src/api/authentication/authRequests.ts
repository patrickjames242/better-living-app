

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

const baseUrl = 'auth/users/';

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
        try {
            return await Notifications.getExpoPushTokenAsync();
        } catch {
            return undefined;
        }
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
            await AsyncStorage.setItem(deviceTokenNeedsToBePushedKey, _false); // because if the user is logged in, their device id has already been sent to the server
        }
    }

    // observing the connection state because this tells us that the device has just connected to the internet
    const connectionStateObserver = async (state: AppState['realtimeUpdates']['connectionState']) => {
        if (
            state === RealtimeUpdatesConnectionState.connected &&
            store.getState().authentication == null && // because if the user is logged in, their device id has already been sent to the server
            await AsyncStorage.getItem(deviceTokenNeedsToBePushedKey) !== _false // so that if the value hasn't been set, the block will still be executed
        ) {
            await sendCurrentDeviceIdToServerAsAnonymousUser();
            await AsyncStorage.setItem(deviceTokenNeedsToBePushedKey, _false);
        }
    }

    // we execute the connection state observer immediately and not the auth observer because if we did this, the authentication object might not be set from async storage yet, and the null value would result in the current device id being sent as an anonymous user.

    connectionStateObserver(store.getState().realtimeUpdates.connectionState);

    addSelectedStateListener(state => state.authentication, authObserver);
    addSelectedStateListener(state => state.realtimeUpdates.connectionState, connectionStateObserver)

})();

