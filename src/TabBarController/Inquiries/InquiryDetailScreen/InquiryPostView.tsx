
import React from 'react';
import { StyleSheet, View } from 'react-native';
import InquiryPostAuthorView from './InquiryPostAuthorView';
import LayoutConstants from '../../../LayoutConstants';
import CustomizedText from '../../../helpers/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { Color } from '../../../helpers/colors';
import Space from '../../../helpers/Spacers/Space';

export interface InquiryPostViewProps {
    showsSubjectText: boolean;
}

const InquiryPostView = (() => {

    const styles = StyleSheet.create({
        root: {
            backgroundColor: 'white',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            padding: LayoutConstants.floatingCellStyles.padding,
        },
        subjectLine: {
            fontFamily: CustomFont.bold,
            fontSize: 20,
        },
        description: {
            lineHeight: 22,
            color: Color.gray(0.5).stringValue,
            fontSize: 15,
        },
    });

    const InquiryPostView = (props: InquiryPostViewProps) => {
        return <View style={styles.root}>
            <InquiryPostAuthorView />
            {(props.showsSubjectText ?? false) && <>
                <Space space={15} />
                <CustomizedText style={styles.subjectLine}>
                    The effectiveness of Neem soap
                </CustomizedText>
            </>}
            <Space space={10} />
            <CustomizedText style={styles.description}>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem rerum mollitia officia harum, facilis commodi sequi aperiam, sit fugit.
            </CustomizedText>
        </View>
    }
    return InquiryPostView;
})();

export default InquiryPostView;
