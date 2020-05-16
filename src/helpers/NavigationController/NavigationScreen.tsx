// import React, { useContext, useRef, useEffect } from 'react';
// import { Optional } from '../general';
// import { Animated, StyleProp, ViewStyle, StyleSheet } from 'react-native';


// export const NavigationScreenContext = React.createContext<Optional<NavigationScreenContextValue>>(null);

// export interface NavigationScreenActions {
//     dismiss: () => void,
//     present: (component: React.ReactElement) => void
// }

// export interface NavigationScreenContextValue extends NavigationScreenActions {

// }

// export function useNavigationScreenContext(): NavigationScreenContextValue {
//     const contextValue = useContext(NavigationScreenContext);
//     if (contextValue == null) {
//         throw new Error("you cannot call useNavigationScreenContext() outside of a the screen of a navigation controller.");
//     }
//     return contextValue;
// }

// export interface NavigationScreenProps {
//     component: React.ReactElement,
//     style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>,
//     actions: NavigationScreenActions,
// }

// const NavigationScreen = (() => {

//     const styles = StyleSheet.create({
//         root: {
            
//         }
//     });

//     return function (props: NavigationScreenProps) {

//         const dismissAction = useRef<Optional<() => void>>(null);
//         const presentAction = useRef<Optional<(component: React.ReactElement) => void>>(null);

//         const contextValue = useRef<NavigationScreenContextValue>({
//             dismiss: () => dismissAction.current?.(),
//             present: (component: React.ReactElement) => presentAction.current?.(component),
//         }).current;

//         useEffect(() => {
//             dismissAction.current = props.actions.dismiss;
//             presentAction.current = props.actions.present;
//         });

//         return <NavigationScreenContext.Provider value={contextValue}>
//             <Animated.View style={[styles.root, props.style]} children={props.component} />
//         </NavigationScreenContext.Provider>
//     }

// })();

// export default NavigationScreen;

