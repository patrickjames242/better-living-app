

import { useRef, useEffect } from 'react';
import { Optional } from '../helpers/general';
import Notification from '../helpers/Notification';
import { ScaledSize, Dimensions, LayoutChangeEvent } from 'react-native';
import LayoutConstants from '../LayoutConstants';


export enum TabBarPosition{
    side,
    bottom
}


export interface WindowDimensions{
    width: number,
    height: number,
}

export const windowDimensionsDidChangeNotification = Notification<WindowDimensions>();





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


