
import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { tabBarItemsData } from './helpers';
import BouncyButton from '../../helpers/BouncyButton';
import { CustomColors } from '../../helpers/colors';
import LayoutConstants from '../../LayoutConstants';
import { windowDimensionsDidChangeNotification, WindowDimensions } from '../helpers';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNotificationListener } from '../../helpers/Notification';
import { useSelector, useDispatch } from '../../redux/store';
import { changeCurrentSelection } from '../../redux/tabBarController';


const SideTabBar = (() => {

	const styles = StyleSheet.create({
		root: {
			flex: 1,
		},
		scrollView: {
			height: 1,
		},

		scrollViewContentView: {
			padding: LayoutConstants.sideMenuBar.padding,
		}
	});

	const marginSizes = {
		tallScreen: 30,
		shortScreen: 20,
	}

	function useItemMarginSize() {

		const getMarginSize = useCallback((dimensions: WindowDimensions) => {
			return dimensions.height > 500 ? marginSizes.tallScreen : marginSizes.shortScreen
		}, []);

		const initialItemMarginSize = useMemo(() => getMarginSize(Dimensions.get('window')), [])

		const [itemMarginSize, setItemMarginSize] = useState(initialItemMarginSize);

		useNotificationListener(windowDimensionsDidChangeNotification, dimensions => {
			setItemMarginSize(getMarginSize(dimensions));
		});

		return itemMarginSize;
	}


	return function () {
		const safeAreaInsets = useSafeArea();
		const currentSelection = useSelector(state => state.tabBarController.currentSelection);
		const dispatch = useDispatch();

		const itemMarginSize = useItemMarginSize();

		return <View style={styles.root}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[styles.scrollViewContentView, {
					paddingTop: safeAreaInsets.top + LayoutConstants.sideMenuBar.padding
				}]}>
				{(() => {
					return tabBarItemsData.map((item, index) => {
						return <SideBarItem
							marginSize={itemMarginSize}
							isSelected={currentSelection === item.selection}
							onPress={() => dispatch(changeCurrentSelection(item.selection))}
							key={index}
							imageSource={item.url}
							isFirstInList={index === 0} />
					})
				})()}
			</ScrollView>
		</View>

	}

})();


export default SideTabBar;


interface SideTabBarItemProps {
	imageSource: any,
	isSelected: boolean,
	onPress: () => void,
	isFirstInList?: boolean,
	marginSize: number,
}

const SideBarItem = (() => {

	const styles = StyleSheet.create({
		root: {
			padding: LayoutConstants.sideMenuBar.barItem.padding,
			borderRadius: 15,
			shadowRadius: 25,
			elevation: 1,
		},
		image: {
			width: LayoutConstants.sideMenuBar.barItem.imageSize,
			height: LayoutConstants.sideMenuBar.barItem.imageSize,
		}
	});

	return function (props: SideTabBarItemProps) {
		return <BouncyButton
			onPress={props.onPress}
			bounceScaleValue={0.8}
			style={[styles.root, {
				marginTop: (props.isFirstInList ?? false) ? undefined : props.marginSize,
				backgroundColor: props.isSelected ? CustomColors.themeGreen.stringValue : 'white',
				shadowColor: props.isSelected ? CustomColors.themeGreen.stringValue : 'black',
				shadowOpacity: props.isSelected ? 0.5 : 0.05,
			}]}>
			<Image source={props.imageSource} style={[styles.image, {
				tintColor: props.isSelected ? 'white' : CustomColors.themeGreen.stringValue,
			}]} />
		</BouncyButton>
	}

})();

