
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import LayoutConstants from '../LayoutConstants';
import { CustomFont } from './fonts/fonts';
import CustomizedText from './CustomizedText';




export const CenteredTitleNavigationBar = (() => {

    const styles = StyleSheet.create({
        contentView: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
        },
        title: {
            fontFamily: CustomFont.bold,
            fontSize: 18,
        }
    }); 

    return function CenterTitleNavigationBar(props: {
        title: string,
        leftAlignedView?: React.ReactElement,
        rightAlignedView?: React.ReactElement,
    }){

        const sideElements = [props.leftAlignedView, props.rightAlignedView]
        .filter(x => x != undefined);

        const fakeLeftOrRightAlignedView = (() => {
            if (sideElements.length === 1){
                return <View style={{opacity: 0}}>{sideElements[0]}</View>
            } else {return null;}
        })();

        return <BaseNavigationBar>
            <View style={[styles.contentView, {
                justifyContent: (sideElements.length > 0) ? undefined : 'center',
            }]}>
                {props.leftAlignedView ?? fakeLeftOrRightAlignedView}
                <CustomizedText style={styles.title}>
                    {props.title}
                </CustomizedText>
                {props.rightAlignedView ?? fakeLeftOrRightAlignedView}
            </View>
        </BaseNavigationBar>
    };
})();





export const LargeHeadingNavigationBar = (() => {

    const styles = StyleSheet.create({
        contentView: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
        },

        titleText: {
            fontFamily: CustomFont.bold,
            fontSize: 22,
            marginLeft: 6,
        }

    });

    return function LargeHeadingNavigationBar(props: {
        rightAlignedView: React.ReactElement,
        title: string,
    }) {
        return <BaseNavigationBar>
            <View style={styles.contentView}>
                <CustomizedText style={styles.titleText}>
                    {props.title}
                </CustomizedText>
                {props.rightAlignedView}
            </View>
        </BaseNavigationBar>
    };

})();







export interface BaseNavigationBarProps extends ViewProps { }

export const BaseNavigationBar = (() => {

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

    const Component: React.FC<BaseNavigationBarProps> = props => {

        const safeAreaInsets = useSafeArea();

        return <View {...props} style={[styles.root, {
            paddingTop: safeAreaInsets.top,
        }, props.style]}>
            <View style={styles.contentView}>{props.children}</View>
        </View>;
    };

    return Component;

})();





