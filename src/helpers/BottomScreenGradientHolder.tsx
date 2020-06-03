

import React, { useImperativeHandle, useState } from 'react';
import { StyleSheet, View, ViewProps, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSelector } from '../redux/store';
import LayoutConstants from '../LayoutConstants';
import { CustomColors } from './colors';
import { TabBarPosition } from '../TabBarController/helpers';
import { LinearGradient } from 'expo-linear-gradient';


export interface BottomScreenGradientHolderProps extends React.PropsWithChildren<ViewProps> {

}

export interface BottomScreenGradientHolderRef {
    notifyThatScrollViewScrolled: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const BottomScreenGradientHolder = (() => {

    const styles = StyleSheet.create({
        root: {
            position: 'absolute',
            bottom: 0,left: 0, right: 0,
        },
        linearGradient: {
            position: 'absolute',
            left: 0, right: 0,
            top: -70,
        },

    });


    const BottomScreenGradientHolder: React.ForwardRefRenderFunction<BottomScreenGradientHolderRef, BottomScreenGradientHolderProps> = (props, ref) => {

        const [isScrollViewAtBottom, setIsScrollViewAtBottom] = useState(false);

        useImperativeHandle(ref, () => ({
            notifyThatScrollViewScrolled: (event) => {
                const isScrollViewAtBottom = (event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height) >= (event.nativeEvent.contentSize.height + (event.nativeEvent.contentInset?.bottom ?? 0) - 10);
                setIsScrollViewAtBottom(isScrollViewAtBottom);
            }
        }), []);

        const tabBarIsOnBottom = useSelector(state => state.tabBarController.tabBarPosition === TabBarPosition.bottom);
        return <View
            pointerEvents="box-none"
            {...props}
            style={[styles.root, props.style]}
        >
            <LinearGradient
                colors={[CustomColors.mainBackgroundColor.withAdjustedOpacity(0).stringValue, CustomColors.mainBackgroundColor.withAdjustedOpacity(1).stringValue]}
                start={[0.5, 0]}
                end={[0.5, 0.9]}
                style={[styles.linearGradient, {
                    opacity: isScrollViewAtBottom ? 0 : 1,
                    bottom: tabBarIsOnBottom ? -LayoutConstants.navBar.cornerRadius : 0,
                }]}
                pointerEvents="none"
            />
            {props.children}
        </View>
    }
    return React.forwardRef(BottomScreenGradientHolder);
})();

export default BottomScreenGradientHolder;


