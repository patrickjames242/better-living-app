
import React from 'react';
import { CustomFont } from '../fonts/fonts';
import BaseNavigationBar from './BaseNavigationBar';
import { View, StyleSheet } from 'react-native';
import CustomizedText from '../CustomizedText';


const LargeHeadingNavigationBar = (() => {

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
        rightAlignedView?: React.ReactElement,
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

export default LargeHeadingNavigationBar;
