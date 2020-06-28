
import NetInfo from '@react-native-community/netinfo';
import { handleHealthTipsRealtimeUpdate } from './healthTips/realtimeUpdates';
import { Platform } from 'react-native';
import AppSettings from '../settings';


export function startListeningForUpdates() {
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
    const socket = new WebSocket(websocketUrl);
    socket.onopen = function (event) {
        console.log(event);
    }
    socket.onmessage = function (event) {
        console.log(event);
        const data = JSON.parse(event.data);
        if (typeof data !== 'object') { return; }
        const healthTips = data.health_tips;
        if (healthTips !== undefined) {
            handleHealthTipsRealtimeUpdate(healthTips);
        }
    };
    socket.onclose = function (event) {
        console.log(event);
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

