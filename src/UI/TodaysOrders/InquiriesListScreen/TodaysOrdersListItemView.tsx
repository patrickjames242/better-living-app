
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { Color, CustomColors } from '../../../helpers/colors';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodaysOrdersNavStackParams } from '../navigationHelpers';


export enum TodaysOrdersUnreadStatus {
    unread,
    unreadReplies,
    none,
}


export interface InquiriesListItemViewProps {
    unreadStatus: TodaysOrdersUnreadStatus;
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

        const navigation = useNavigation<StackNavigationProp<TodaysOrdersNavStackParams, 'TodaysOrdersList'>>();

        function respondToButtonPressed(){
            // navigation.push('InquiryDetail');
        }

        return <BouncyButton bounceScaleValue={0.9} contentViewProps={{style: styles.root}} onPress={respondToButtonPressed}>
            {
                (props.unreadStatus !== TodaysOrdersUnreadStatus.none) &&
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
                    (props.unreadStatus === TodaysOrdersUnreadStatus.unreadReplies) &&
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


