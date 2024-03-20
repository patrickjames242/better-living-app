
import React, { useState, useEffect, useMemo } from 'react';
import { Platform, StatusBar, LogBox } from 'react-native';
import { registerRootComponent, AppLoading } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { loadFonts } from './helpers/fonts/fonts';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/store';
import { tryConnectingWebsocketListener } from './api/realtimeUpdates';
import RootNavigationView from './UI/RootNavigationView/RootNavigationView';
import * as Notifications from 'expo-notifications';
import AppSettings from './settings';
import { CustomColors } from './helpers/colors';
import { AppContext, AppContextValue, InitialAppScreenType } from './UI/helpers';
import { isNumber } from './helpers/general';

registerRootComponent(App);

// YellowBox.ignoreWarnings([
// 	"Animated: `useNativeDriver`", 
// 	"Non-serializable values were found in the navigation state.",
// 	"[SECURITY] node-uuid: crypto not usable, falling back to insecure Math.random()"
// ]);

if (Platform.OS !== 'web') {
	LogBox.ignoreLogs([
		"Animated: `useNativeDriver`",
		"Non-serializable values were found in the navigation state.",
		"[SECURITY] node-uuid: crypto not usable, falling back to insecure Math.random()"
	]);
}


Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});
if (Platform.OS === 'web') {
	window.document.body.style.backgroundColor = CustomColors.mainBackgroundColor.stringValue;
}


export default function App() {

	const [appIsReady, setAppIsReady] = useState(false);

	const appContextValue: AppContextValue = useMemo(() => ({
		initialAppScreen: (() => {
			if (Platform.OS !== 'web') return null;

			const params = new URLSearchParams(location.search);

			const initialHealthTipId = params.get('initialHealthTipId');
			if (initialHealthTipId && isNumber(initialHealthTipId)) {
				const x: { type: InitialAppScreenType.healthTips, healthTipId: number } = {
					type: InitialAppScreenType.healthTips,
					healthTipId: Number(initialHealthTipId),
				}
				return x;
			}

			switch (params.get('initialTabSelection')) {
				case 'todaysMenu': {
					const x: { type: InitialAppScreenType.todaysMenu } = { type: InitialAppScreenType.todaysMenu };
					return x;
				}
				case 'healthTips': {
					const x: { type: InitialAppScreenType.healthTips } = { type: InitialAppScreenType.healthTips };
					return x;
				}
				default: return null;
			}
		})(),
	}), []);

	useEffect(() => {
		loadFonts().then(() => {
			setAppIsReady(true);
			tryConnectingWebsocketListener();
			if (Platform.OS === 'ios' || Platform.OS === 'android') {
				Notifications.requestPermissionsAsync();
			}
		});
	}, []);

	if (appIsReady === false) {
		return <AppLoading />
	} else {
		return <AppContext.Provider value={appContextValue}>
			<ReduxProvider store={store}>
				<SafeAreaProvider>
					<StatusBar barStyle={AppSettings.defaultStatusBarStyle} />
					<RootNavigationView />
				</SafeAreaProvider>
			</ReduxProvider>
		</AppContext.Provider>
	}

}














const something: 'none' | 32 = 33;



