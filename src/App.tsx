
import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, YellowBox } from 'react-native';
import { registerRootComponent, AppLoading } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { loadFonts } from './helpers/fonts/fonts';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/store';
import { tryConnectingWebsocketListener } from './api/realtimeUpdates';
import RootNavigationView from './UI/RootNavigationView/RootNavigationView';
import * as Notifications from 'expo-notifications';

registerRootComponent(App);

YellowBox.ignoreWarnings([
	"Animated: `useNativeDriver`", 
	"Non-serializable values were found in the navigation state.",
	"[SECURITY] node-uuid: crypto not usable, falling back to insecure Math.random()"
]);

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export default function App() {

	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		loadFonts().then(() => {
			setAppIsReady(true)
			tryConnectingWebsocketListener()
			if (Platform.OS === 'ios' || Platform.OS === 'android'){
				Notifications.requestPermissionsAsync().then(async () => {
					console.log(await Notifications.getExpoPushTokenAsync());
				});
			}
		});
	}, []);

	if (appIsReady === false) {
		return <AppLoading />
	} else {
		return <ReduxProvider store={store}>
			<SafeAreaProvider>
				<StatusBar barStyle="dark-content" />
				<RootNavigationView />
			</SafeAreaProvider>
		</ReduxProvider>
	}

}



