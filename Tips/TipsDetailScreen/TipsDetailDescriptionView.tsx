import React from 'react';
import {StyleSheet, View} from 'react-native';
import LayoutConstants from '../../src/LayoutConstants';
import { Color } from '../../src/helpers/colors';
import CustomizedText from '../../src/helpers/Views/CustomizedText';

export interface TipsDetailDescriptionViewProps{
    articleText: string
}

const TipsDetailDescriptionView = (() => {
    
    const styles = StyleSheet.create({
        root: {
            backgroundColor: 'white',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            padding: LayoutConstants.floatingCellStyles.padding,
        },
        textLabel: {
            color: Color.gray(0.3).stringValue,
            fontSize: 16,
            lineHeight: 25,
        },
    });
    
    const TipsDetailDescriptionView = (props: TipsDetailDescriptionViewProps) => {
        return <View style={styles.root}>
            <CustomizedText style={styles.textLabel}>{props.articleText}</CustomizedText>
        </View>
    }
    return TipsDetailDescriptionView;
})();

export default TipsDetailDescriptionView;
