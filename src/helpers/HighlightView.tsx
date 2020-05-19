
import React, {useState, useRef } from 'react';
import { ViewProps, View, StyleSheet, Animated } from "react-native";

import { CustomColors } from "./colors";
import { useUpdateEffect } from './general';
import CustomDelayedTouchable from './CustomDelayedTouchable';

const touchDownAnimationLength = 125;
const touchUpAnimationLength = 400;


const HighlightView: React.FC<ViewProps & {onPress?: () => {}}> = (props) => {

	const [shouldShowCoverView, setShouldShowCoverView] = useState(false);

	const coverViewOpacityAnimation = useRef(new Animated.Value(0)).current;

	useUpdateEffect(() => {

		Animated.timing(coverViewOpacityAnimation, {
			toValue: shouldShowCoverView ? 1 : 0,
			duration: shouldShowCoverView ? touchDownAnimationLength : touchUpAnimationLength,
		}).start();

	}, [coverViewOpacityAnimation, shouldShowCoverView]);

	function touchDown() {
		setShouldShowCoverView(true);
	}

	function touchUp() {
		setShouldShowCoverView(false);
	}

	const children = props.children;
	const newProps = { ...props };
	delete newProps.children;
	
	return <CustomDelayedTouchable
		onPressIn={touchDown}
		onPressOut={touchUp}
		onPress={props.onPress}
	>
		<View {...newProps}>
			{children}
			<Animated.View style={[highlightViewStyles.highlightCoverView, { opacity: coverViewOpacityAnimation}]} />	
		</View>
	</CustomDelayedTouchable>
}

const highlightViewStyles = StyleSheet.create({
	highlightCoverView: {
		zIndex: 1000,
		position: 'absolute',
		left: 0, right: 0, top: 0, bottom: 0,
		backgroundColor: CustomColors.mainBackgroundColor.withAdjustedOpacity(0.5).stringValue,
	}
});

export default HighlightView;
