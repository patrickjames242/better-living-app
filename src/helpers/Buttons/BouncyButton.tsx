
import React, { useState, useRef } from 'react';
import { ViewProps, Animated, Easing, View } from 'react-native';
import { useUpdateEffect } from '../general';
import CustomDelayedTouchable from './CustomDelayedTouchable';


export interface BouncyButtonProps extends ViewProps {
    onPress?: () => void;
    bounceScaleValue?: number;
    contentViewProps?: ViewProps,
}

const BouncyButton: React.FC<BouncyButtonProps> = (props) => {

    const [isPressed, setIsPressed] = useState(false);

    const transformAnimation = useRef(new Animated.Value(1)).current;

    useUpdateEffect(() => {

        Animated.timing(transformAnimation, {
            toValue: isPressed ? (props.bounceScaleValue ?? 0.7) : 1,
            duration: 250,
            easing: Easing.elastic(1),
            useNativeDriver: true,
        }).start();
        
        //eslint-disable-next-line
    }, [isPressed]);

    function touchDown() {
        setIsPressed(true);
    }

    function touchUp() {
        setIsPressed(false);
    }

    return <CustomDelayedTouchable
        onPressIn={touchDown}
        onPressOut={touchUp}
        onPress={props.onPress}
    >
        <View {...props}>
            <Animated.View {...props.contentViewProps} style={[props.contentViewProps?.style, {
                transform: [{scale: transformAnimation}]
            }]}>{props.children}</Animated.View>
        </View>
    </CustomDelayedTouchable>
}

export default BouncyButton;

