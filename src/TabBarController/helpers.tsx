import React, { useContext } from 'react';
import { Optional } from '../helpers/general';
import { TabBarSelection } from './TabBar/helpers';
import Notification from '../helpers/Notification';

export const TabBarControllerContext = React.createContext<Optional<TabBarControllerContextValue>>(null);

export interface TabBarControllerContextValue{
    currentTabBarPosition: TabBarPosition,
    currentSelection: TabBarSelection,
    setCurrentSelection: (newSelection: TabBarSelection) => void,
}

export enum TabBarPosition{
    side,
    bottom
}



export function useTabBarControllerContext(){
    const context = useContext(TabBarControllerContext);
    if (context == null){
        throw new Error("You cannot access the TabBarControllerContext outside of a TabBarControllerContext.Provider");
    }
    return {...context};
}


export function useCurrentTabBarPosition(): TabBarPosition{
    return useTabBarControllerContext().currentTabBarPosition;
}


export interface WindowDimensions{
    width: number,
    height: number,
}

export const windowDimensionsDidChangeNotification = Notification<WindowDimensions>();


