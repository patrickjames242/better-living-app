
import 'intl';

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { registerRootComponent, AppLoading } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { loadFonts } from './helpers/fonts/fonts';
import TabBarController from './TabBarController/TabBarController';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/store';
import { startListeningForUpdates } from './api/realtimeUpdates';




// store.subscribe(() => {
// 	if (Platform.OS === 'web'){
// 		console.log(store.getState().orderingSystem.menus.toJS());
		
// 	}
// });

registerRootComponent(App);


export default function App() {

	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		loadFonts().then(() => {
			setAppIsReady(true)
			startListeningForUpdates()
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


