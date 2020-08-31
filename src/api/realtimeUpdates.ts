
import NetInfo from '@react-native-community/netinfo';
import { handleHealthTipsRealtimeUpdate } from './healthTips/realtimeUpdates';
import { Platform } from 'react-native';
import AppSettings from '../settings';
import { handleOrderingSystemRealtimeUpdate } from './orderingSystem/realtimeUpdates';
import store from '../redux/store';
import { updateRealtimeUpdatesConnectionStateAction, RealtimeUpdatesConnectionState } from '../redux/realtimeUpdates';
import { handleUserAuthRealtimeUpdate } from './authentication/realtimeUpdates';
import { Optional, mapOptional } from '../helpers/general';
import Notification from '../helpers/Notification';

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
        console.log('on close after successful open');
        _tryConnectingWebsocketListener();
    }

    startWebsocketConnection(onCloseAfterSuccessfulOpen).catch(() => {
        startWebsocketConnection(onCloseAfterSuccessfulOpen).catch(() => {
            let timeoutId: Optional<number> = null;
            let unlisten: Optional<() => void> = null;

            const tryAction = () => {
                unlisten?.();
                mapOptional(timeoutId, x => clearTimeout(x));
                _tryConnectingWebsocketListener();
            }
            
            unlisten = isInternetReachableNotification.addListener(isInternetReachable => {
                if (isInternetReachable) {
                    console.log('internet reacheable');
                    tryAction();
                }
            });

            timeoutId = setTimeout(() => {
                tryAction();
            }, 5000);
        });
    });
}

// async function getInternetReachability() {
//     switch (Platform.OS) {
//         case 'web':
//             return Promise.resolve(window.navigator.onLine);
//         default: {
//             const info = await NetInfo.fetch();
//             return info.isInternetReachable;
//         }
//     }
// }

function startWebsocketConnection(onCloseAfterSuccessfulOpen: () => void) {

    let onCloseAfterSuccessfulOpenCalled = false;

    let callbackCalled = false;

    return new Promise((resolve, reject) => {
        const websocketUrl = (() => {
            const protocolString = AppSettings.useLocalHostDevServer ? 'ws' : 'wss';
            return `${protocolString}://${AppSettings.apiHostUrl()}/realtime-updates/?auth_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MzksInVzZXJfdHlwZSI6ImN1c3RvbWVyIn0.N2cDeY-lFgd1UCWjc3tuqtBNp8vwAzpFtxr1drpun7g`;
        })();

        store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.connecting));

        const socket = new WebSocket(websocketUrl);
        socket.onopen = function () {
            if (callbackCalled === false) {
                resolve();
                callbackCalled = true;
            }
            console.log('websocket opened');
            store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.connected));
        }
        socket.onmessage = function (event) {
            const data = JSON.parse(event.data);

            if (Platform.OS === 'web') {
                console.log('socket on message', data);
            }

            store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.connectedAndGotInitialUpdates));

            if (typeof data !== 'object') { return; }

            const Keys = {
                health_tips: 'health_tips',
                ordering_system: 'ordering_system',
                user_info: 'user_info',
            }

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
                    }
                    // eslint-disable-next-line no-empty
                } catch { }
            }
        };
        socket.onclose = function () {
            if (callbackCalled === false) {
                reject();
                callbackCalled = true;
            } else if (onCloseAfterSuccessfulOpenCalled === false){
                onCloseAfterSuccessfulOpen();
            }
            console.log('websocket closed');
            store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.disconnected));
        };
    });

}

