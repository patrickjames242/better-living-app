import React from 'react';
import {StyleSheet} from 'react-native';
import LayoutConstants from "../../src/LayoutConstants";
import { CustomFont } from "../../src/helpers/fonts/fonts";
import { CustomColors } from "../../src/helpers/colors";
import SpacerView from "../../src/helpers/Spacers/SpacerView";
import CustomizedText from "../../src/helpers/Views/CustomizedText";

export interface TipsDetailTitleViewProps{
    dateString?: string;
    titleString?: string;
}

const TipsDetailTitleView = (() => {
    
    const styles = StyleSheet.create({
        root: {
            backgroundColor: 'white',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            padding: LayoutConstants.floatingCellStyles.padding,
        },
        dateLabel: {
            fontFamily: CustomFont.bold,
            color: CustomColors.themeGreen.stringValue,
            fontSize: 14,
            textTransform: 'uppercase',
        },
        titleLabel: {
            fontFamily: CustomFont.bold,
            fontSize: 24,
        },
        authorLabel: {
            color: CustomColors.offBlackSubtitle.stringValue,
            fontSize: 15,
        },
    });
    
    const TipsDetailTitleView = (props: TipsDetailTitleViewProps) => {
        return <SpacerView style={styles.root} space={10}>
            <CustomizedText style={styles.dateLabel}>{props.dateString}</CustomizedText>
                <CustomizedText style={styles.titleLabel}>
                    {props.titleString}
                </CustomizedText>
                <CustomizedText style={styles.authorLabel}>
                    ― by Dr. Idamae Hanna
                </CustomizedText>
        </SpacerView>
    }
    return TipsDetailTitleView;
})();

export default TipsDetailTitleView;