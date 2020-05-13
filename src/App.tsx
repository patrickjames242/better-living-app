
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { registerRootComponent, AppLoading } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { loadFonts } from './helpers/fonts/fonts';
import TabBarController from './TabBarController/TabBarController';

registerRootComponent(App);

export default function App() {

	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		loadFonts().then(() => setAppIsReady(true));
	}, [])

	if (appIsReady === false) {
		return <AppLoading />
	} else {
		return <SafeAreaProvider>
			<StatusBar barStyle="dark-content" />
			<TabBarController />
		</SafeAreaProvider>
	}
}

