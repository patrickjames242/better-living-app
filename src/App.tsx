
import React, { useState, useEffect } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';

import { registerRootComponent, AppLoading } from 'expo';
import TabBar from './TabBar/TabBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CustomColors } from './helpers/colors';
import { loadFonts } from './helpers/fonts/fonts';
import TopBar from './TopBar/TopBar';
import MenuListView from './MenuListView/MenuListView';

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
			<Screen />
		</SafeAreaProvider>
	}
}

const Screen = (() => {

	const styles = StyleSheet.create({
		root: {
			flex: 1,
			backgroundColor: CustomColors.mainBackgroundColor.stringValue,
			// flexDirection: 'row',
		},
		// sideBarHolder: {

		// },
		// mainInterface: {
		// 	flex: 1,
		// },
		mainInterfaceContentView: {
			zIndex: -1,
			flex: 1,
			height: 1,
		},
	});

	return function () {
		return <View style={styles.root}>
			
			{/* <View style={styles.sideBarHolder}>
				<SideBar/>
			</View> */}

			{/* <View style={styles.mainInterface}> */}
				<TopBar />
				<View style={styles.mainInterfaceContentView}>
					<MenuListView />
				</View>
				<TabBar />
			{/* </View> */}

		</View>
	}

})();


// const SideBar = (() => {

// 	const styles = StyleSheet.create({
// 		root: {
// 			width: 100,
// 			flex: 1,
// 		},
// 	});

// 	return function () {
// 		return <View style={styles.root}>

// 		</View>
// 	}
// })();



