import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import {
  useNavigationBuilder,
  TabRouter,
  DefaultNavigatorOptions,
  createNavigatorFactory,
} from '@react-navigation/native';
import { useUpdateEffect } from '../../helpers/reactHooks';
import { List } from 'immutable';

const CustomTabNavigator = (() => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    childContainer: {
      ...StyleSheet.absoluteFillObject,
      overflow: 'hidden',
    },
  });

  const CustomTabNavigator = function (props: DefaultNavigatorOptions<{}>) {
    const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
      children: props.children,
      screenOptions: props.screenOptions,
      initialRouteName: props.initialRouteName,
    });

    // return <NavigationHelpersContext.Provider value={navigation}>
    //     <View style={styles.root}>
    //         {descriptors[state.routes[state.index].key].render()}
    //     </View>
    // </NavigationHelpersContext.Provider>

    const [currentScreenIndices, setCurrentScreenIndices] = useState<
      List<number>
    >(List([state.index]));
    const [animationIsInProgress, setAnimationIsInProgress] = useState(false);

    interface AnimatedValues {
      [screenIndex: number]: {
        translateX: Animated.Value;
        opacity: Animated.Value;
      };
    }

    const animatedValues = useRef<AnimatedValues>({});

    useMemo(() => {
      currentScreenIndices.push(state.index).forEach(index => {
        if (animatedValues.current[index] != undefined) return;
        animatedValues.current[index] = {
          translateX: new Animated.Value(0),
          opacity: new Animated.Value(1),
        };
      });
    }, [currentScreenIndices, state.index]);

    useUpdateEffect(() => {
      setCurrentScreenIndices(oldState => {
        return oldState
          .filter(x => {
            return x !== state.index;
          })
          .push(state.index);
      });
    }, [state.index]);

    const previousTimeouts = useRef<number[]>([]);

    useUpdateEffect(() => {
      // grabbing the last index instead of second to last becuase this is capturing the currentScreenIndices before it is updated with the new current index
      const oldScreenIndex = currentScreenIndices.get(
        currentScreenIndices.size - 1,
      )!;
      const newScreenIndex = state.index;
      const fromRight = newScreenIndex > oldScreenIndex;

      const duration = 250;
      const easing = Easing.elastic(0.7);
      const maxTranslationX = 50;

      if (animationIsInProgress) {
        previousTimeouts.current.forEach(x => clearTimeout(x));
        previousTimeouts.current = [];
      }

      setAnimationIsInProgress(true);
      const timeoutID = setTimeout(() => {
        previousTimeouts.current = previousTimeouts.current.filter(
          x => x != timeoutID,
        );
        setAnimationIsInProgress(false);
      }, duration);
      previousTimeouts.current.push(timeoutID);

      const oldViewTranslateX =
        animatedValues.current[oldScreenIndex].translateX;
      const newViewTranslateX =
        animatedValues.current[newScreenIndex].translateX;

      const oldViewOpacity = animatedValues.current[oldScreenIndex].opacity;
      const newViewOpacity = animatedValues.current[newScreenIndex].opacity;

      newViewOpacity.setValue(0);
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

      newViewTranslateX.setValue(
        fromRight ? maxTranslationX : -maxTranslationX,
      );
      Animated.timing(newViewTranslateX, {
        toValue: 0,
        easing: easing,
        duration: duration,
        useNativeDriver: true,
      }).start();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.index]);

    return (
      <View
        style={[
          styles.root,
          {
            overflow: animationIsInProgress ? 'hidden' : undefined,
          },
        ]}
      >
        {(() => {
          return currentScreenIndices.map(index => {
            const opacity = animatedValues.current[index].opacity;
            const translateX = animatedValues.current[index].translateX;

            return (
              <Animated.View
                key={index}
                style={[
                  styles.childContainer,
                  {
                    opacity,
                    transform: [{ translateX }],
                  },
                ]}
              >
                {descriptors[state.routes[index].key].render()}
              </Animated.View>
            );
          });
        })()}
      </View>
    );
  };
  return CustomTabNavigator;
})();

const createCustomTabBarNavigator = createNavigatorFactory(CustomTabNavigator);
export default createCustomTabBarNavigator;
