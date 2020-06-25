
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import CustomizedText from '../../../helpers/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { CustomColors, Color } from '../../../helpers/colors';
import Spacer from '../../../helpers/Spacers/Spacer';
// import TipsDetailAudioPlayerView from './TipsDetailAudioPlayerView';
// import TipsDetailYTVideoView from './TipsDetailYTVideoView';
import { useSelector } from '../../../redux/store';

interface TipsDetailScreenProps{
    healthTipId: number;
}

const TipsDetailScreen = (() => {

    const spacing = LayoutConstants.pageSideInsets;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        scrollView: {
            overflow: 'visible',
            zIndex: -1,
        },
        scrollViewContentContainer: {
            padding: spacing,
            width: '100%',
            maxWidth: LayoutConstants.floatingCellStyles.maxWidth + (spacing * 2),
            alignSelf: 'center',
        }
    });

    const TipsDetailScreen = (props: TipsDetailScreenProps) => {

        const healthTip = useSelector(state => state.healthTips.get(props.healthTipId));

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Improving Rationality through culture rather than education" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContentContainer}
            >
                <Spacer space={spacing}>
                    <TipsDetailTitleView dateString={healthTip?.getFormattedDateString()} titleString={healthTip?.title}/>
                    {/* <TipsDetailAudioPlayerView/>
                    <TipsDetailYTVideoView/> */}
                    {(() => {
                        return (typeof healthTip?.articleText === 'string') && 
                        <TipsDetailDescriptionView articleText={healthTip.articleText}/>
                    })()}
                    
                </Spacer>
            </ScrollView>
        </View>
    }
    return TipsDetailScreen;
})();

export default TipsDetailScreen;



interface TipsDetailTitleViewProps{
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
        return <SpacerView style={styles.root} space={15}>
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




interface TipsDetailDescriptionViewProps{
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



