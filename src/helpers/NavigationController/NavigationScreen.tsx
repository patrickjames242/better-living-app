
import React, { useContext, useRef, useEffect, useState, useMemo, Ref } from 'react';
import { Optional } from '../general';
import { Animated, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { PanGestureHandler, PanGestureHandlerProperties } from 'react-native-gesture-handler';
import { CustomColors, Color } from '../colors';
import { Set } from 'immutable';


export const NavigationScreenContext = React.createContext<Optional<NavigationScreenContextValue>>(null);

export interface NavigationScreenActions {
    dismiss: () => void,
    dismissToRoot: () => void,
    present: (component: React.ReactElement) => void,
    
}

export interface NavigationScreenContextValue extends NavigationScreenActions { 
    addGestureToWaitOn: (ref: React.Ref<any>) => void,
    removeGestureToWaitOn: (ref: React.Ref<any>) => void,
}

export function useNavigationScreenContext(): NavigationScreenContextValue {
    const contextValue = useContext(NavigationScreenContext);
    if (contextValue == null) {
        throw new Error("you cannot call useNavigationScreenContext() outside of a the screen of a navigation controller.");
    }
    return contextValue;
}

export interface NavigationScreenProps {
    component: React.ReactElement,
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>,
    actions: NavigationScreenActions,
    panGestureProps: PanGestureHandlerProperties,
    dimmerViewStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>,
    shouldShowDimmerView?: boolean,
}

const NavigationScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            backgroundColor: CustomColors.mainBackgroundColor.stringValue,
        },
        dimmerView: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: Color.gray(0).withAdjustedOpacity(0.7).stringValue,
            elevation: 1000,
        }
    });

    return function NavigationScreen(props: NavigationScreenProps) {

        const dismissAction = useRef<Optional<() => void>>(null);
        const dismissToRootAction = useRef<Optional<() => void>>(null);
        const presentAction = useRef<Optional<(component: React.ReactElement) => void>>(null);

        const [gesturesToWaitFor, setGesturesToWaitFor] = useState(Set<React.Ref<any>>());
        const gesturesToWaitForArray = useMemo(() => gesturesToWaitFor.toJS(), [gesturesToWaitFor]);

        const contextValue = useRef<NavigationScreenContextValue>({
            dismiss: () => dismissAction.current?.(),
            dismissToRoot: () => dismissToRootAction.current?.(),
            present: (component: React.ReactElement) => presentAction.current?.(component),
            addGestureToWaitOn: (ref) => setGesturesToWaitFor(x => x.add(ref)),
            removeGestureToWaitOn: (ref) => setGesturesToWaitFor(x => x.remove(ref)),
        }).current;

        useEffect(() => {
            dismissAction.current = props.actions.dismiss;
            dismissToRootAction.current = props.actions.dismissToRoot;
            presentAction.current = props.actions.present;
        });

        return <NavigationScreenContext.Provider value={contextValue}>
            <PanGestureHandler
                waitFor={gesturesToWaitForArray}
                {...props.panGestureProps}
            >
                <Animated.View style={[styles.root, props.style]}>
                    {props.component}
                    {props.shouldShowDimmerView &&
                        <Animated.View style={[styles.dimmerView, props.dimmerViewStyle]} />
                    }
                </Animated.View>
            </PanGestureHandler>
        </NavigationScreenContext.Provider>
    };

})();

export default NavigationScreen;

