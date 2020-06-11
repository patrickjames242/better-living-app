
import React, { useState, useMemo, useRef, useCallback, useLayoutEffect } from 'react';
import { View, Animated, StyleSheet, Easing, Dimensions, LayoutChangeEvent, Keyboard } from 'react-native';
import { batch } from 'react-redux';
import NavigationScreen from './NavigationScreen';
import { State as GestureState, PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { Optional, limitNumber } from '../general';
import { CustomColors } from '../colors';




/*

PROBLEMS 

- velocity is represented in different units on the web than on ios, check out how it works on android
- when the views bounce (because of the animation), you can see the views that are beneath them, which looks tacky
- On ios, theres a slight delay between when when the user's finger lifts and when the dismissal animation beings
- when you swipe toward the left and lift you finger, the views flicker 
- sometimes I see this error on the web: Warning: `NaN` is an invalid value for the `opacity` css style property.

*/

class NavigationScreenInfo {

    private static nextAvailableKey = 0;
    readonly key = NavigationScreenInfo.nextAvailableKey++;

    constructor(
        readonly component: React.ReactElement,
    ) { }

}


const NavigationController = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: CustomColors.mainBackgroundColor.stringValue,
        },
        childScreen: {
            ...StyleSheet.absoluteFillObject,
        },
    });

    function lastIndexOfInfo(info: NavigationScreenInfo, stack: NavigationScreenInfo[]): Optional<number> {

        // moving backwards through the screen stack
        for (let i = stack.length - 1; i >= 0; i--) {
            const item = stack[i];
            if (item === info) {
                return i;
            }
        }

        return null;
    }

    function shouldDismissAfterInteraction(velocityX: number, translationX: number, screenWidth: number): boolean {

        const progress = translationX / screenWidth;
        return (() => {
            if (velocityX >= 0 && velocityX <= 300) {
                return progress > 0.5;
            } else if (velocityX > 0) {
                return true;
            } else {
                return false;
            }
        })();

    }

    const fullAnimationDuration = 350;

    return function (props: { initialComponent: React.ReactElement }) {

        const initialScreenStackState = useMemo(() => {
            return [new NavigationScreenInfo(props.initialComponent)]
        }, [props.initialComponent]);

        const latestControllerWidth = useRef(Dimensions.get('window').width);

        const [screenStack, setScreenStack] = useState(initialScreenStackState);

        // can represent either a new screen to present, or a screen underneath the current screen, where all screens on top of it must be dismissed.
        const [screenBeingShown, setScreenBeingShown] = useState<Optional<NavigationScreenInfo>>(null);
        const [isInteractionActive, setIsInteractionActive] = useState(false);


        const translateXValue = useRef(new Animated.Value(0)).current;

        const animateScreenToNewState = useCallback((isPresentation: boolean, duration: number = fullAnimationDuration) => {
            return new Promise(resolve => {
                Animated.timing(translateXValue, {
                    duration: duration,
                    easing: Easing.elastic(0.75),
                    toValue: isPresentation ? 0 : latestControllerWidth.current,
                    useNativeDriver: true,
                }).start(() => {
                    batch(() => {
                        if (isPresentation === false) {
                            setScreenStack(oldState => {
                                const newState = [...oldState];
                                newState.pop();
                                return newState;
                            });
                        }
                        resolve();
                    });
                });
            })
        }, [translateXValue]);


        /* 

        This function will do whatever it needs to do in order to show the screen that you tell it to show (unless you don't give it an appropriate to screen to show, in which case it will do nothing). 
        
        - If the screenToShow is the screen currently being shown (it is currently at the top of the stack), it will do nothing. 
        - If the screenToShow is in the screen stack but not at the top, it will remove the screens in between the top screen and screen to show, and animate the dismissal of the top screen to reveal the screen to show. 
        - If the screenToShow is not already in the screen stack, it will present that screen by sliding it onto the stack.
        
        */

        const showScreen = useCallback((screenToShow: NavigationScreenInfo) => {
            if (screenBeingShown != null || isInteractionActive || screenToShow instanceof NavigationScreenInfo === false) { return; }

            const currentIndexOfScreenToShow = lastIndexOfInfo(screenToShow, screenStack);

            if (
                (currentIndexOfScreenToShow != null && currentIndexOfScreenToShow < 0) ||
                currentIndexOfScreenToShow === screenStack.length - 1
            ) { return; }

            Keyboard.dismiss(); // so that the keyboard would be automatically dismissed when a presentation or dismissal occurs.

            const isPresenting = currentIndexOfScreenToShow == null;

            translateXValue.setValue(isPresenting ? latestControllerWidth.current : 0);

            batch(() => {
                if (currentIndexOfScreenToShow == null) {
                    setScreenStack(oldState => [...oldState, screenToShow]);
                } else {
                    (function filterOutScreensToSkip() {
                        setScreenStack(oldState => {
                            const newState = oldState.filter((_, index) => {
                                const shouldkeep = index <= currentIndexOfScreenToShow || index === oldState.length - 1;
                                return shouldkeep;
                            });
                            const foundItemsToRemove = oldState.length !== newState.length;
                            return foundItemsToRemove ? newState : oldState;
                        });
                    })();
                }

                setScreenBeingShown(screenToShow);
            });

            animateScreenToNewState(isPresenting).then(() => {
                setScreenBeingShown(null);
            });

        }, [screenBeingShown, isInteractionActive, screenStack, translateXValue, animateScreenToNewState])


        const screenActions = useMemo(() => ({
            dismissToRoot() {
                const screenToShow = screenStack[0];
                if (screenToShow instanceof NavigationScreenInfo) {
                    showScreen(screenToShow);
                }
            },
            dismissCurrent(sender: NavigationScreenInfo) {
                if (screenStack[screenStack.length - 1] !== sender) { return; }
                const screenToShow = screenStack[screenStack.length - 2];
                if (screenToShow instanceof NavigationScreenInfo) {
                    showScreen(screenToShow);
                }
            },
            present(sender: NavigationScreenInfo, newComponent: React.ReactElement) {
                if (screenStack[screenStack.length - 1] !== sender) { return; }
                const newItem = new NavigationScreenInfo(newComponent);
                showScreen(newItem);
            }
        }), [screenStack, showScreen]);

        const latestGestureXVelocity = useRef(0);
        const latestGestureXTranslation = useRef(0);


        function updateShouldDismissAfterInteraction(event: PanGestureHandlerGestureEvent) {
            latestGestureXVelocity.current = event.nativeEvent.velocityX;
            latestGestureXTranslation.current = event.nativeEvent.translationX;
        }

        function panGestureStateDidChange(event: PanGestureHandlerStateChangeEvent) {

            batch(() => {
                switch (event.nativeEvent.state) {
                    case GestureState.BEGAN:
                        Keyboard.dismiss(); // so that the keyboard would be automatically dismissed when an interactive dismissal is starting.
                        
                        //falls through
                    case GestureState.ACTIVE:
                        setIsInteractionActive(true);
                        break;
                    case GestureState.END: {

                        const screenWidth = latestControllerWidth.current;
                        const translationX = latestGestureXTranslation.current;
                        const velocity = latestGestureXVelocity.current;
                        const shouldDismiss = shouldDismissAfterInteraction(velocity, translationX, screenWidth);

                        setScreenBeingShown(screenStack[screenStack.length - (shouldDismiss ? 2 : 1)]);

                        const animationDuration = (() => {

                            let remainingDistance = (() => {
                                const x = shouldDismiss ? screenWidth - translationX : translationX;
                                return limitNumber(x, 0, screenWidth);
                            })();

                            const val = (remainingDistance / Math.abs(velocity)) * 1000 * 1.2;
                            const valueToReturn = limitNumber(val, 50, 400);

                            return valueToReturn;
                        })();

                        animateScreenToNewState(shouldDismiss === false, animationDuration).then(() => {
                            setScreenBeingShown(null);
                        });
                    }
                    // falls through
                    case GestureState.CANCELLED:
                    case GestureState.FAILED:
                        setIsInteractionActive(false);
                        break;
                }
            });
        }


        function onLayout(event: LayoutChangeEvent) {
            latestControllerWidth.current = event.nativeEvent.layout.width;
        }


        useLayoutEffect(() => {
            // without this, the translation for all screens are not set to zero after an uninteractive presentation or dismissal 
            if (screenBeingShown == null && isInteractionActive === false) {
                translateXValue.setValue(0);
            }
        });

        return <View style={[styles.root, {
            overflow: (screenBeingShown != null || isInteractionActive) ? 'hidden' : undefined,
        }]} onLayout={onLayout}>

            {screenStack.map((item, index) => {

                const isTopView = index === screenStack.length - 1;
                const isBehindView = index === screenStack.length - 2;

                const screenWidth = latestControllerWidth.current;
                const minBehindViewTranslateX = -(latestControllerWidth.current / 3);

                const zero = translateXValue.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [0, 0, 0],
                });

                const translateX = (() => {
                    if (
                        screenBeingShown == null && isInteractionActive === false ||
                        (isTopView === false && isBehindView === false)
                    ) { return zero; }

                    let input = [0, screenWidth];

                    let output = (() => {
                        if (isTopView) {
                            return [...input];
                        } else if (isBehindView) {
                            return [minBehindViewTranslateX, 0]
                        } else { throw new Error('this point should not be reached!!') }
                    })();

                    if (isInteractionActive) {
                        input = [input[0] - 1, ...input, input[input.length - 1] + 1];
                        output = [output[0], ...output, output[output.length - 1]]
                    }

                    return translateXValue.interpolate({
                        inputRange: input, outputRange: output
                    });
                })();

                const dimmerViewOpacity = (() => {
                    if (
                        isBehindView === false ||
                        (screenBeingShown == null && isInteractionActive === false)
                    ) { return undefined; }

                    return translateXValue.interpolate({
                        inputRange: [0, screenWidth],
                        outputRange: [1, 0],
                    });
                })();

                const screenOpacity = (screenBeingShown == null && isInteractionActive === false && isTopView === false) ? 0 : undefined;

                return <NavigationScreen
                    key={item.key}
                    style={[styles.childScreen, { transform: [{ translateX }], opacity: screenOpacity }]}
                    component={item.component}
                    actions={{
                        dismiss: () => screenActions.dismissCurrent(item),
                        dismissToRoot: () => screenActions.dismissToRoot(),
                        present: component => screenActions.present(item, component),
                    }}
                    shouldShowDimmerView={Boolean(dimmerViewOpacity)}
                    dimmerViewStyle={{ opacity: dimmerViewOpacity }}
                    panGestureProps={{
                        enabled: screenStack.length > 1 && isTopView && screenBeingShown == null,
                        onGestureEvent: Animated.event([{
                            nativeEvent: { translationX: translateXValue, }
                        }], {
                            useNativeDriver: true,
                            listener: updateShouldDismissAfterInteraction,
                        }),
                        onHandlerStateChange: panGestureStateDidChange
                    }}
                />
            })}

        </View>
    }

})();

export default NavigationController;

