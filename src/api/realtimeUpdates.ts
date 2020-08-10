
import NetInfo from '@react-native-community/netinfo';
import { handleHealthTipsRealtimeUpdate } from './healthTips/realtimeUpdates';
import { Platform } from 'react-native';
import AppSettings from '../settings';
import { handleOrderingSystemRealtimeUpdate } from './orderingSystem/realtimeUpdates';
import store from '../redux/store';
import { updateRealtimeUpdatesConnectionStateAction, RealtimeUpdatesConnectionState } from '../redux/realtimeUpdates';


export function tryConnectingWebsocketListener() {
    setUpWebsocket();
}

async function getInternetReachability() {
    switch (Platform.OS) {
        case 'web':
            return Promise.resolve(window.navigator.onLine);
        default: {
            const info = await NetInfo.fetch();
            return info.isInternetReachable;
        }
    }
}

function addInternetReachabilityListener(listener: (isInternetReachable: boolean) => void){
    switch (Platform.OS){
        case 'web': {

            const offlineListener = () => listener(false);
            const onlineListener = () => listener(true);

            window.addEventListener('offline', offlineListener);
            window.addEventListener('online', onlineListener);

            return () => {
                window.removeEventListener('offline', offlineListener);
                window.removeEventListener('online', onlineListener);
            }

        }
        default: 
            return NetInfo.addEventListener(info => info.isInternetReachable);
    }
}


function setUpWebsocket() {
    const websocketUrl = (() => {
        const protocolString = AppSettings.debugMode ? 'ws' : 'wss';
        return `${protocolString}://${AppSettings.apiHostUrl()}/realtime-updates`;
    })();

    store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.connecting));

    const socket = new WebSocket(websocketUrl);
    socket.onopen = function (event) {
        console.log(event);
        store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.connected))
    }
    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log('socket on message', data);

        store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.connectedAndGotInitialUpdates));

        if (typeof data !== 'object') { return; }

        const Keys = {
            health_tips: 'health_tips',
            ordering_system: 'ordering_system',
        }

        for (const propertyName of Object.getOwnPropertyNames(data)){
            const value = data[propertyName];
            if (value === undefined){continue;}
            switch (propertyName){
                case Keys.health_tips: 
                    handleHealthTipsRealtimeUpdate(value);
                    break;
                case Keys.ordering_system: 
                    handleOrderingSystemRealtimeUpdate(value);
                    break;
            }
        }
    };
    socket.onclose = function (event) {
        console.log(event);
        store.dispatch(updateRealtimeUpdatesConnectionStateAction(RealtimeUpdatesConnectionState.disconnected));
        // getInternetReachability().then(isInternetReachable => {
        //     if (isInternetReachable) {
        //         setTimeout(() => {
        //             setUpWebsocket();
        //         }, 1000);
        //     } else {
        //         let unlisten = addInternetReachabilityListener((isInternetReachable) => {
        //             if (isInternetReachable) {
        //                 setUpWebsocket()
        //                 unlisten?.()
        //             }
        //         })
        //     }
        // })
    };
}

