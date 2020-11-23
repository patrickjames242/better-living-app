
import React, { useRef } from 'react';
import { ViewProps, TouchableWithoutFeedback, View } from 'react-native';
import { Optional } from '../general';

export interface CustomDelayedTouchableProps {
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    minDelayTillPressOut?: number;
    contentViewProps?: ViewProps;
}

// this is a custom wrapper around the TouchableWithoutFeedback component that delays the onPressOut callback, such that it is not called until a maximum of 100 milliseconds has passed since the onPressIn message was received. This ensures that at least some of the touch down animation is executed before the animated property is reversed back to its unpressed state. The delay can be configured with the minDelayTillPressOut prop. 

const CustomDelayedTouchable: React.FC<ViewProps & CustomDelayedTouchableProps> = (props) => {

    const lastTouchDownDate = useRef<Optional<number>>(null);
    const currentTouchUpTimeout = useRef<Optional<number>>(null);

    function onPressIn() {
        if (currentTouchUpTimeout.current != null) {
            clearTimeout(currentTouchUpTimeout.current);
        }
        lastTouchDownDate.current = Date.now();
        props.onPressIn?.();
    }

    function onPressOut() {
        const action = () => props.onPressOut?.();

        if (lastTouchDownDate.current == null) {
            action();
            return;
        }

        const timeTillButtonShouldTouchUp = Math.min(Math.max((props.minDelayTillPressOut ?? 100) - (Date.now() - lastTouchDownDate.current), 0), 100);

        currentTouchUpTimeout.current = setTimeout(action, timeTillButtonShouldTouchUp);
    }

    return <TouchableWithoutFeedback
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={props.onPress}
    >
        <View
            {...props.contentViewProps}
            style={[{ cursor: 'pointer' } as any, props.contentViewProps?.style]}
        >{props.children}</View>
    </TouchableWithoutFeedback>
}


export default CustomDelayedTouchable;
