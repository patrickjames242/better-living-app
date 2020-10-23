

import React, { useRef, useEffect, useContext } from 'react';
import { Optional } from '../../helpers/general';
import Notification, { useNotificationListener } from '../../helpers/Notification';
import { ScaledSize, Dimensions, LayoutChangeEvent } from 'react-native';
import LayoutConstants from '../../LayoutConstants';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootNavigationViewParams } from '../RootNavigationView/helpers';
import { TabBarSelection } from './tabBarSelectionsHelpers';


export enum TabBarPosition{
    side,
    bottom
}

export interface WindowDimensions{
    width: number,
    height: number,
}

export const windowDimensionsDidChangeNotification = Notification<WindowDimensions>();

export function useWindowDimensionsNotificationListener(listener: (dimensions: WindowDimensions) => void, dependencies?: React.DependencyList){
    useNotificationListener(windowDimensionsDidChangeNotification, dimensions => {
        listener(dimensions);
    }, dependencies ?? []);
}





export function useSetUpWindowDimensionsObserver(){

    const latestWindowDimensions = useRef<Optional<WindowDimensions>>(null);

    const updateWindowDimensionsIfNeeded = (dimensions: WindowDimensions) => {
        const current = latestWindowDimensions.current
        if (current?.height !== dimensions.height || current?.width !== dimensions.width){
            latestWindowDimensions.current = dimensions;
            windowDimensionsDidChangeNotification.post(dimensions);
        }
    }

    useEffect(() => {
        const listenerType = 'change';
        const listener = (props: {window: ScaledSize}) => {
            updateWindowDimensionsIfNeeded(props.window);	
        }
        Dimensions.addEventListener(listenerType, listener);
        return () => Dimensions.removeEventListener(listenerType, listener);
    }, []);

    function rootViewOnLayoutCallback(event: LayoutChangeEvent){
        updateWindowDimensionsIfNeeded(event.nativeEvent.layout);
    }

    return {rootViewOnLayoutCallback};
}





export function calculateCurrentDesiredTabBarPosition(screenWidth?: number): TabBarPosition {
    const windowWidth = screenWidth ?? Dimensions.get('window').width;
    if (windowWidth >= LayoutConstants.sideMenuBar.minWidthToShowSideBar) {
        return TabBarPosition.side;
    } else {
        return TabBarPosition.bottom;
    }
}





export interface TabBarControllerContextValue{
    navigation: StackNavigationProp<RootNavigationViewParams, 'MainInterface'>;
    presentLogInSignUpPopUp: () => void;
 
    currentTabBarSelection: TabBarSelection;
    changeTabBarSelection: (newSelection: TabBarSelection) => void;
}


export const TabBarControllerContext = React.createContext<Optional<TabBarControllerContextValue>>(null);


export function useTabBarControllerContext(){
    const context = useContext(TabBarControllerContext);
    if (context == null){
        throw new Error("you cannot call useTabBarControllerNavigation outside of a TabBarControllerContext provider");
    }
    return context;
}


export function useTabBarControllerNavigation(){
    const context = useTabBarControllerContext();
    return context.navigation;
}




export const shouldPopTabBarControllerChildToTop = Notification<TabBarSelection>();

// this is placed on the root screen to dismiss to the root screen when button is pressed
export function useTabBarControllerChildRootScreenPopToTopFunctionality<ScreenParams extends Record<string | number | symbol, any>, Screen extends keyof ScreenParams>(selection: TabBarSelection, screenProps: StackScreenProps<ScreenParams, Screen>){
    useEffect(() => {
        return shouldPopTabBarControllerChildToTop.addListener(_selection => {
            const state = screenProps.navigation.dangerouslyGetState();
            selection === _selection && 
            state.routes[state.index].name !== screenProps.route.name && 
            screenProps.navigation.popToTop();
        });
    }, [screenProps.navigation, screenProps.route.key, screenProps.route.name, selection]);
}
