
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import CustomizedText from '../../../helpers/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { CustomColors, Color } from '../../../helpers/colors';
import Spacer from '../../../helpers/Spacers/Spacer';
import TipsDetailAudioPlayerView from './TipsDetailAudioPlayerView';
import TipsDetailYTVideoView from './TipsDetailYTVideoView';


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

    const TipsDetailScreen = () => {
        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Improving Rationality through culture rather than education" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContentContainer}
            >
                <Spacer space={spacing}>
                    <TipsDetailTitleView/>
                    <TipsDetailAudioPlayerView/>
                    <TipsDetailYTVideoView/>
                    <TipsDetailDescriptionView/>
                </Spacer>
            </ScrollView>
        </View>
    }
    return TipsDetailScreen;
})();

export default TipsDetailScreen;





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
    
    const TipsDetailTitleView = () => {
        return <SpacerView style={styles.root} space={15}>
            <CustomizedText style={styles.dateLabel}>Sept 27, 2020</CustomizedText>
                <CustomizedText style={styles.titleLabel}>
                    Improving Rationality through culture rather than education
                </CustomizedText>
                <CustomizedText style={styles.authorLabel}>
                    ― by Dr. Idamae Hanna
                </CustomizedText>
        </SpacerView>
    }
    return TipsDetailTitleView;
})();






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
    
    const TipsDetailDescriptionView = () => {
        return <View style={styles.root}>
            <CustomizedText style={styles.textLabel}>{"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, nemo officia quibusdam distinctio expedita sequi, veniam hic illo, perferendis quia corporis incidunt. Excepturi, nesciunt? Vero adipisci nam non harum itaque sapiente quos expedita dolor error. Quia sint beatae deserunt quis nesciunt iure natus, quibusdam unde saepe aliquid placeat possimus rerum tenetur quam numquam qui fugiat, animi ipsum corporis, similique consectetur.\n\nEligendi aliquam facere nihil quibusdam debitis excepturi quo explicabo voluptates minus, odit labore dolore! Sit saepe ex labore adipisci, corporis praesentium earum consequuntur quis harum suscipit, quo ad repudiandae numquam nihil modi minima voluptatem itaque delectus asperiores quam! Quasi, eos.\n\nLorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, nemo officia quibusdam distinctio expedita sequi, veniam hic illo, perferendis quia corporis incidunt. Excepturi, nesciunt? Vero adipisci nam non harum itaque sapiente quos expedita dolor error. Quia sint beatae deserunt quis nesciunt iure natus, quibusdam unde saepe aliquid placeat possimus rerum tenetur quam numquam qui fugiat, animi ipsum corporis, similique consectetur."}</CustomizedText>
        </View>
    }
    return TipsDetailDescriptionView;
})();



