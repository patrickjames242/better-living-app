
import React, { useState, useMemo, useRef } from 'react';
import { View, StyleSheet, Animated, Easing} from 'react-native';
import { TabBarSelection, tabBarItemsData } from './TabBar/helpers';
import MenuScreen from './Menu/Menu';
import { useSelector } from '../redux/store';
import Cart from './Cart/Cart';
import Tips from './Tips/Tips';
import Inquiries from './Inquiries/Inquiries';
import Settings from './Settings/Settings';
import { useUpdateEffect } from '../helpers/reactHooks';



const TabBarControllerContentView = (() => {

	const styles = StyleSheet.create({
		root: {
			flex: 1,
		},
		childContainer: {
			...StyleSheet.absoluteFillObject,
			overflow: 'hidden',
		}
	});

	const selectionComponents = {
		[TabBarSelection.menu]: MenuScreen,
		[TabBarSelection.cart]: Cart,
		[TabBarSelection.tips]: Tips,
		[TabBarSelection.contactRequests]: Inquiries,
		[TabBarSelection.settings]: Settings,
	}

	const TabBarControllerContentView = function () {

		const currentSelection = useSelector(state => state.tabBarController.currentSelection);

		// eslint-disable-next-line react-hooks/exhaustive-deps
		const initialScreensSelectionsValue = useMemo(() => [currentSelection], []);
		const [currentScreensSelections, setCurrentScreensSelections] = useState<TabBarSelection[]>(initialScreensSelectionsValue);
		const [animationIsInProgress, setAnimationIsInProgress] = useState(false);

		interface AnimatedValues {
			[selection: number]: { translateX: Animated.Value, opacity: Animated.Value }
		}

		const animatedValues = useRef(tabBarItemsData.reduce<AnimatedValues>((previousValue, currentValue) => {
			const isCurrentSelection = currentValue.selection === currentSelection;
			previousValue[currentValue.selection] = { translateX: new Animated.Value(0), opacity: new Animated.Value(isCurrentSelection ? 1 : 0) }
			return previousValue;
		}, {})).current;

		useUpdateEffect(() => {
			setCurrentScreensSelections(oldState => {
				const newState = oldState.filter(x => {
					return x !== currentSelection;
				});
				newState.push(currentSelection);
				return newState;
			});
		}, [currentSelection]);

		const previousTimeouts = useRef<number[]>([]);

		useUpdateEffect(() => {

			const oldSelection = currentScreensSelections[currentScreensSelections.length - 1] as TabBarSelection;
			const newSelection = currentSelection;
			const fromRight = newSelection > oldSelection;

			const duration = 250;
			const easing = Easing.elastic(0.7);
			const maxTranslationX = 50;

			if (animationIsInProgress) {
				previousTimeouts.current.forEach(x => clearTimeout(x));
				previousTimeouts.current = [];
			}

			setAnimationIsInProgress(true);
			const timeoutID = setTimeout(() => {
				previousTimeouts.current = previousTimeouts.current.filter(x => x != timeoutID);
				setAnimationIsInProgress(false);
			}, duration);
			previousTimeouts.current.push(timeoutID);

			const oldViewTranslateX = animatedValues[oldSelection].translateX;
			const newViewTranslateX = animatedValues[newSelection].translateX;

			const oldViewOpacity = animatedValues[oldSelection].opacity;
			const newViewOpacity = animatedValues[newSelection].opacity;

			Animated.timing(newViewOpacity, {
				toValue: 1,
				easing: easing,
				duration: duration,
				useNativeDriver: true,
			}).start();

			Animated.timing(oldViewOpacity, {
				toValue: 0,
				easing: easing,
				duration: duration,
				useNativeDriver: true,
			}).start();

			Animated.timing(oldViewTranslateX, {
				toValue: fromRight ? -maxTranslationX : maxTranslationX,
				easing: easing,
				duration: duration,
				useNativeDriver: true,
			}).start(() => {
				oldViewTranslateX.setValue(0);
			});

			newViewTranslateX.setValue(fromRight ? maxTranslationX : -maxTranslationX);
			Animated.timing(newViewTranslateX, {
				toValue: 0,
				easing: easing,
				duration: duration,
				useNativeDriver: true,
			}).start();

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [currentSelection]);

		Animated.event([], {useNativeDriver: true});

		return <View style={[styles.root, {
			overflow: animationIsInProgress ? 'hidden' : undefined,
		}]}>
			{(() => {
				return currentScreensSelections.map(selection => {

					const Component = selectionComponents[selection];
					const opacity = animatedValues[selection].opacity;
					const translateX = animatedValues[selection].translateX;

					return <Animated.View key={selection} style={[styles.childContainer, {
						opacity, transform: [{ translateX }]
					}]}>
						<Component />
					</Animated.View>
				})
			})()}
		</View>
	};

	return React.memo(TabBarControllerContentView);

})();

export default TabBarControllerContentView;





