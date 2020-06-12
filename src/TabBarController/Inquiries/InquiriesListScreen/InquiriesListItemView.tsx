
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomizedText from '../../../helpers/CustomizedText';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { Color, CustomColors } from '../../../helpers/colors';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import { mapOptional } from '../../../helpers/general';
import PresentableScreens from '../../../PresentableScreens';


export enum InquiryUnreadStatus {
    unread,
    unreadReplies,
    none,
}


export interface InquiriesListItemViewProps {
    unreadStatus: InquiryUnreadStatus;
}

const InquiriesListItemView = (() => {

    const styles = StyleSheet.create({
        root: {
            backgroundColor: 'white',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            overflow: 'hidden',
            flexDirection: 'row',
        },
        unreadSideBar: {
            width: 10,
            backgroundColor: CustomColors.themeGreen.stringValue,
        },
        content: {
            padding: LayoutConstants.floatingCellStyles.padding,
            flex: 1,
        },
        unreadRepliesLabel: {
            color: CustomColors.themeGreen.stringValue,
            fontFamily: CustomFont.medium,
        },
        subjectTitle: {
            fontSize: 18,
            fontFamily: CustomFont.bold,
        },
        subtitle: {
            color: Color.gray(0.7).stringValue,
            fontSize: 13,
        },
        description: {
            color: Color.gray(0.65).stringValue,
        },
    });

    const InquiriesListItemView = (props: InquiriesListItemViewProps) => {

        const navigationScreenContext = useNavigationScreenContext();

        function respondToButtonPressed(){
            mapOptional(PresentableScreens.InquiryDetailScreen(), Component => (navigationScreenContext.present(<Component/>)));
        }

        return <BouncyButton bounceScaleValue={0.9} contentViewProps={{style: styles.root}} onPress={respondToButtonPressed}>
            {
                (props.unreadStatus !== InquiryUnreadStatus.none) &&
                <View style={styles.unreadSideBar} />
            }
            <SpacerView style={styles.content} space={8}>
                <CustomizedText style={styles.subjectTitle}>
                    The effectiveness of Neem soap
                </CustomizedText>
                <CustomizedText style={styles.subtitle}>
                    5 hours ago • 5 replies
                </CustomizedText>
                <CustomizedText numberOfLines={2} style={styles.description}>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, laborum enim. Illo maiores sapiente sint possimus esse sequi quaerat, optio vel quam voluptatem minima, tempore earum qui? Fuga, libero illum.
                </CustomizedText>
                {
                    (props.unreadStatus === InquiryUnreadStatus.unreadReplies) &&
                    <CustomizedText style={styles.unreadRepliesLabel}>
                        Unread replies
                    </CustomizedText>
                }
            </SpacerView>
        </BouncyButton>
    }
    return InquiriesListItemView;
})();

export default InquiriesListItemView;


