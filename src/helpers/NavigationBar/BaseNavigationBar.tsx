
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import LayoutConstants from '../../LayoutConstants';


export interface BaseNavigationBarProps extends ViewProps { }

const BaseNavigationBar = (() => {

    const styles = StyleSheet.create({
        root: {
            backgroundColor: 'white',
            borderBottomLeftRadius: LayoutConstants.navBar.cornerRadius,
            borderBottomRightRadius: LayoutConstants.navBar.cornerRadius,
            ...LayoutConstants.navBar.shadowConfig,
        },
        contentView: {
            padding: 13,
        }
    });

    const BaseNavigationBar: React.FC<BaseNavigationBarProps> = props => {

        const safeAreaInsets = useSafeArea();

        return <View {...props} style={[styles.root, {
            paddingTop: safeAreaInsets.top
        }, props.style]}>
            <View style={styles.contentView}>{props.children}</View>
        </View>;
    };

    return BaseNavigationBar;

})();





export default BaseNavigationBar;