
import React, {useRef, useCallback } from 'react';
import { ViewProps, View, StyleSheet, Animated } from "react-native";
import { Color } from "../colors";
import CustomDelayedTouchable from './CustomDelayedTouchable';



const touchDownAnimationLength = 125;
const touchUpAnimationLength = 400;



interface HighlightButtonProps extends ViewProps{
	onPress?: () => void,
	highlightColor?: Color,
}

const HighlightButton = (() => {

	const styles = StyleSheet.create({
		highlightCoverView: {
			zIndex: 1000,
			position: 'absolute',
			left: 0, right: 0, top: 0, bottom: 0,
		}
	});
	
	const HighlightButton: React.FC<HighlightButtonProps> = (props) => {
	
		const coverViewOpacityAnimation = useRef(new Animated.Value(0)).current;
	
		const animateCoverView = useCallback((show: boolean) => {
			Animated.timing(coverViewOpacityAnimation, {
				toValue: show ? 1 : 0,
				duration: show ? touchDownAnimationLength : touchUpAnimationLength,
			}).start();
		}, [coverViewOpacityAnimation]);

		const touchDown = useCallback(() => {
			animateCoverView(true);
		}, [animateCoverView]);
		
		const touchUp = useCallback(() => {
			animateCoverView(false);
		}, [animateCoverView]);


		return <CustomDelayedTouchable
			onPressIn={touchDown}
			onPressOut={touchUp}
			onPress={props.onPress}
		>
			<View {...props}>
				{props.children}
				{(() => {
					return <Animated.View pointerEvents="none" style={[styles.highlightCoverView, {
						opacity: coverViewOpacityAnimation,
						backgroundColor: (props.highlightColor ?? Color.gray(0).withAdjustedOpacity(0.05)).stringValue,
					}]} />
				})()}
			</View>
		</CustomDelayedTouchable>
	}

	return HighlightButton;

})();



export default HighlightButton;
