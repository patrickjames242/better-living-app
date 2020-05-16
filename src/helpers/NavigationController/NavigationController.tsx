
// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { View, Animated, StyleSheet, Easing, LayoutChangeEvent, Dimensions } from 'react-native';
// import { Optional } from '../general';
// import { batch } from 'react-redux';
// import NavigationScreen from './NavigationScreen';



// class NavigationScreenInfo {

//     private static nextAvailableKey = 0;
//     readonly key = NavigationScreenInfo.nextAvailableKey++;

//     readonly dimmerViewOpacity = new Animated.Value(0);
//     readonly translateX: Animated.Value;

//     constructor(
//         readonly component: React.ReactElement,
//         defaultTranslateXValue: number = 0,
//     ) {
//         this.translateX = new Animated.Value(defaultTranslateXValue);
//     }
// }



// const NavigationController = (() => {

//     const styles = StyleSheet.create({
//         root: {
//             flex: 1,
//             backgroundColor: 'black',
//         },
//         childScreen: {
//             ...StyleSheet.absoluteFillObject,
//         },
//     });

//     function lastIndexOfInfo(info: NavigationScreenInfo, stack: NavigationScreenInfo[]): Optional<number> {

//         // moving backwards through the screen stack
//         for (let i = stack.length - 1; i >= 0; i--) {
//             const item = stack[i];
//             if (item === info) {
//                 return i;
//             }
//         }

//         return null;
//     }

//     return function (props: { initialComponent: React.ReactElement }) {

//         const initialScreenStackState = useMemo(() => {
//             return [new NavigationScreenInfo(props.initialComponent)]
//         }, []);

//         const latestControllerWidth = useRef<Optional<number>>(null);

//         const [screenStack, setScreenStack] = useState(initialScreenStackState);

//         // can represent either a new screen to present, or a screen underneath the current screen, where all screens on top of it must be dismissed.
//         const [screenToShow, setScreenToShow] = useState<Optional<NavigationScreenInfo>>(null);

//         const screenActions = useMemo(() => ({
//             dismiss(sender: NavigationScreenInfo) {
//                 batch(() => {
//                     setScreenStack(oldState => {
//                         if (
//                             screenToShow != null ||
//                             oldState.length <= 1 ||
//                             oldState[oldState.length - 1] !== sender
//                         ) { return oldState; }
//                         setScreenToShow(oldState[oldState.length - 2]);
//                         return oldState;
//                     });
//                 });
//             },
//             present(sender: NavigationScreenInfo, newComponent: React.ReactElement) {
//                 batch(() => {
//                     setScreenStack(oldState => {
//                         if (
//                             screenToShow != null ||
//                             oldState[oldState.length - 1] !== sender
//                         ) { return oldState; }
//                         const newItem = new NavigationScreenInfo(newComponent, latestControllerWidth.current ?? 10000000);
//                         setScreenToShow(newItem);
//                         return [...oldState, newItem];
//                     });
//                 });

//             }
//         }), [screenToShow]);



//         useEffect(() => {
//             if (screenToShow == null) { return; }

//             const currentIndexOfScreenToShow = lastIndexOfInfo(screenToShow, screenStack);
//             if (currentIndexOfScreenToShow == null){
//                 throw new Error("THIS SHOULD NOT BE NULL!! CHECK LOGIC");
//             }

//             const isPresenting = currentIndexOfScreenToShow === screenStack.length - 1;
//             const frontItem = screenStack[screenStack.length - 1];
//             const behindItem = isPresenting ? screenStack[screenStack.length - 2] : screenStack[currentIndexOfScreenToShow];

//             if (isPresenting === false) {
//                 (function filterOutScreensToSkip(){
//                     setScreenStack(oldState => {
//                         let foundAnItemToRemove = false;
//                         const newState = oldState.filter((_, index) => {
//                             const shouldkeep = index <= currentIndexOfScreenToShow || index === oldState.length - 1;
//                             if (shouldkeep === false) { foundAnItemToRemove = true; }
//                             return shouldkeep;
//                         });
//                         if (foundAnItemToRemove) {
//                             return newState;
//                         } else { return oldState; }
//                     });
//                 })();
//             }

//             const duration = 500;
//             const easing = Easing.elastic(0.7);
//             const minBehindViewTranslateX = -100;

//             const behindItemAnimationPromise = new Promise(resolve => {
//                 behindItem.translateX.setValue(isPresenting ? 0 : minBehindViewTranslateX);
//                 Animated.timing(behindItem.translateX, {
//                     duration,
//                     easing,
//                     toValue: isPresenting ? minBehindViewTranslateX : 0,
//                 }).start(() => {
//                     behindItem.translateX.setValue(0);
//                     resolve();
//                 });
//             });

//             const frontItemAnimationPromise = new Promise(resolve => {
//                 const controllerWidth = latestControllerWidth.current ?? Dimensions.get("window").width;

//                 frontItem.translateX.setValue(isPresenting ? controllerWidth : 0);
//                 Animated.timing(frontItem.translateX, {
//                     duration,
//                     easing,
//                     toValue: isPresenting ? 0 : controllerWidth,
//                 }).start(() => {
//                     frontItem.translateX.setValue(0);
//                     resolve();
//                 });
//             });

//             Promise.all([behindItemAnimationPromise, frontItemAnimationPromise]).then(() => {
//                 batch(() => {
//                     if (isPresenting === false) {
//                         setScreenStack(oldState => {
//                             const newState = [...oldState];
//                             newState.pop();
//                             return newState;
//                         });
//                     }
//                     setScreenToShow(null);
//                 });
//             });
//         }, [screenToShow]);

//         function onLayout(event: LayoutChangeEvent) {
//             latestControllerWidth.current = event.nativeEvent.layout.width;
//         }

//         return <View style={[styles.root, {
//             overflow: screenToShow == null ? undefined : 'hidden',
//         }]} onLayout={onLayout}>
//             {screenStack.map(item => {
//                 return <NavigationScreen key={item.key} style={[styles.childScreen, {
//                     transform: [{ translateX: item.translateX }]
//                 }]} component={item.component} actions={{
//                     dismiss: () => screenActions.dismiss(item),
//                     present: component => screenActions.present(item, component),
//                 }} />
//             })}
//         </View>
//     }

// })();

// export default NavigationController;



