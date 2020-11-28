
import NetInfo from '@react-native-community/netinfo';
import { handleHealthTipsRealtimeUpdate } from './healthTips/realtimeUpdates';
import { Platform } from 'react-native';
import AppSettings from '../settings';
import { handleOrderingSystemRealtimeUpdate } from './orderingSystem/realtimeUpdates';
import store, { addSelectedStateListener, AppState } from '../redux/store';
import { updateRealtimeUpdatesConnectionStateAction, RealtimeUpdatesConnectionState, updateRealtimeUpdatesGotInitialUpdatesAction } from '../redux/realtimeUpdates';
import { handleUserAuthRealtimeUpdate } from './authentication/realtimeUpdates';
import { Optional, mapOptional } from '../helpers/general';
import Notification from '../helpers/Notification';
import { handleCartRealtimeUpdate } from './cart/realtimeUpdates';
import { batch } from 'react-redux';
import { handleTodaysOrdersRealtimeUpdate } from './orders/realtimeUpdates';
import { handleGlobalSettingsRealtimeUpdate } from './globalSettings/realtimeUpdates';

const isInternetReachableNotification = Notification<boolean>();

(() => {
    switch (Platform.OS) {
        case 'web': {

            const offlineListener = () => isInternetReachableNotification.post(false);
            const onlineListener = () => isInternetReachableNotification.post(true);

            window.addEventListener('offline', offlineListener);
            window.addEventListener('online', onlineListener);
            break;
        }
        default:
            NetInfo.addEventListener(info => {
                if (typeof info.isInternetReachable === 'boolean'){
                    isInternetReachableNotification.post(info.isInternetReachable);
                }
            });
    }
})();



let starterWasCalled = false;

export function tryConnectingWebsocketListener(){
    if (starterWasCalled === false){
        _tryConnectingWebsocketListener();
        starterWasCalled = true;
    }
}

function _tryConnectingWebsocketListener() {
    
    function onCloseAfterSuccessfulOpen() {
        _tryConnectingWebsocketListener();
    }

    const getCurrentAuthToken = (state: AppState) => state.authentication?.authToken ?? null;
    const authTokenToUseInWebsocket = getCurrentAuthToken(store.getState());

    function onSuccessfulOpen(ws: WebSocket){
        if (authTokenToUseInWebsocket === getCurrentAuthToken(store.getState())){
            const removeReduxListener = addSelectedStateListener(getCurrentAuthToken, () => {    
                removeReduxListener?.()
                ws.close();
            });
        } else {
            ws.close();
        }
    }

    startWebsocketConnection(authTokenToUseInWebsocket, onCloseAfterSuccessfulOpen).then(onSuccessfulOpen).catch(() => {
        startWebsocketConnection(authTokenToUseInWebsocket, onCloseAfterSuccessfulOpen).then(onSuccessfulOpen).catch(() => {
            let timeoutId: Optional<number> = null;
            let unlisten: Optional<() => void> = null;

            const tryAction = () => {
                unlisten?.();
                mapOptional(timeoutId, x => clearTimeout(x));
                _tryConnectingWebsocketListener();
            }
            
            unlisten = isInternetReachableNotification.addListener(isInternetReachable => {
                if (isInternetReachable) {
                    tryAction();
                }
            });

            timeoutId = setTimeout(() => {
                tryAction();
            }, 5000);
        });
    });
}


function startWebsocketConnection(authToken: Optional<string>, onCloseAfterSuccessfulOpen: () => void): Promise<WebSocket> {

    let websocketHasAlreadyClosed = false;
    let callbackCalled = false;

    return new Promise((resolve, reject) => {
        const websocketUrl = (() => {
            const protocolString = AppSettings.useLocalHostDevServer ? 'ws' : 'wss';
            let url = `${protocolString}://${AppSettings.apiHostUrl()}/realtime-updates/`
            authToken && (url += '?auth_token=' + authToken);
            return url;
        })();

        store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.connecting));

        const socket = new WebSocket(websocketUrl);
        socket.onopen = function () {
            if (callbackCalled === false) {
                resolve(socket);
                callbackCalled = true;
            }
            // console.log('websocket opened');
            store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.connected));
        }
        socket.onmessage = function (event) {
            const data = JSON.parse(event.data);

            if (Platform.OS === 'web') {
                console.log('socket on message', data);
            }


            store.dispatch(updateRealtimeUpdatesGotInitialUpdatesAction(true));

            if (typeof data !== 'object') { return; }

            const Keys = {
                health_tips: 'health_tips',
                ordering_system: 'ordering_system',
                user_info: 'user_info',
                cart: 'cart',
                todays_orders: 'todays_orders',
                global_settings: 'global_settings',
            }

            batch(() => {
                for (const propertyName of Object.getOwnPropertyNames(data)) {
                    const value = data[propertyName];
                    if (value === undefined) { continue; }
                    try {
                        switch (propertyName) {
                            case Keys.health_tips:
                                handleHealthTipsRealtimeUpdate(value);
                                break;
                            case Keys.ordering_system:
                                handleOrderingSystemRealtimeUpdate(value);
                                break;
                            case Keys.user_info:
                                handleUserAuthRealtimeUpdate(value);
                                break;
                            case Keys.cart:
                                handleCartRealtimeUpdate(value);
                                break;
                            case Keys.todays_orders:
                                handleTodaysOrdersRealtimeUpdate(value);
                                break;
                            case Keys.global_settings:
                                handleGlobalSettingsRealtimeUpdate(value);
                                break;
                        }
                    } catch (error){
                        console.log(error);
                    }
                }
            });
        };
        socket.onclose = function () {
            if (callbackCalled === false) {
                reject();
                callbackCalled = true;
            } else if (websocketHasAlreadyClosed === false){
                onCloseAfterSuccessfulOpen();
            }
            websocketHasAlreadyClosed = true;
            // console.log('websocket closed');
            store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.disconnected));
        };
    });

}

