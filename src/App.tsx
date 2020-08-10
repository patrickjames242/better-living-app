import React, { useState, useEffect } from 'react';
import { StatusBar, YellowBox, Platform } from 'react-native';
import { registerRootComponent, AppLoading } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { loadFonts } from './helpers/fonts/fonts';
import TabBarController from './TabBarController/TabBarController';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/store';
import { tryConnectingWebsocketListener } from './api/realtimeUpdates';


YellowBox.ignoreWarnings(["Animated: `useNativeDriver`"]);

store.subscribe(() => {
	if (Platform.OS === 'web'){
		console.log(store.getState().realtimeUpdates.connectionState);
		
	}
});

registerRootComponent(App);


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



