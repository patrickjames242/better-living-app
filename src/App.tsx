

import React, { useState, useEffect } from 'react';
import { StatusBar, YellowBox } from 'react-native';
import { registerRootComponent, AppLoading } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { loadFonts } from './helpers/fonts/fonts';
import TabBarController from './TabBarController/TabBarController';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/store';
import { tryConnectingWebsocketListener } from './api/realtimeUpdates';


registerRootComponent(App);


YellowBox.ignoreWarnings([
	"Animated: `useNativeDriver`", 
	"Non-serializable values were found in the navigation state.",
]);



export default function App() {

	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		loadFonts().then(() => {
			setAppIsReady(true)
			tryConnectingWebsocketListener()
		});
	}, []);

	if (appIsReady === false) {
		return <AppLoading />
	} else {
		return <ReduxProvider store={store}>
			<SafeAreaProvider>
				<StatusBar barStyle="dark-content" />
				<TabBarController />
			</SafeAreaProvider>
		</ReduxProvider>
	}
	
}



