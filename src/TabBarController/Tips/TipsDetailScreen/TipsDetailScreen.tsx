
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import LayoutConstants from '../../../LayoutConstants';
import Spacer from '../../../helpers/Spacers/Spacer';
// import TipsDetailAudioPlayerView from './TipsDetailAudioPlayerView';
// import TipsDetailYTVideoView from './TipsDetailYTVideoView';
import { useSelector } from '../../../redux/store';
import TipsDetailTitleView from './TipsDetailTitleView';
import TipsDetailDescriptionView from './TipsDetailDescriptionView';
import TipsDetailBottomButtonsView from './TipsDetailBottomButtonsView';
import ResourceNotFoundView from '../../../helpers/Views/ResourceNotFoundView';
import { useUpdateEffect } from '../../../helpers/general';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';


interface TipsDetailScreenProps {
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
        const healthTipId = healthTip?.id;

        const navigationScreenContext = useNavigationScreenContext();

        useUpdateEffect(() => {
            if (healthTipId == null){
                navigationScreenContext.dismiss();
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [healthTipId])

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title={healthTip?.title ?? ''} />
            {(() => {
                if (healthTip == null) {
                    return <ResourceNotFoundView />
                } else {
                    return <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollViewContentContainer}
                    >
                        <Spacer space={spacing}>
                            <TipsDetailTitleView dateString={healthTip.getFormattedDateString()} titleString={healthTip.title} />
                            {/* <TipsDetailAudioPlayerView/>
                            <TipsDetailYTVideoView/> */}
                            {(typeof healthTip.articleText === 'string') &&
                                <TipsDetailDescriptionView articleText={healthTip.articleText} />
                            }
                            <TipsDetailBottomButtonsView healthTipId={props.healthTipId} />
                        </Spacer>
                    </ScrollView>
                }
            })()}
        </View>
    }
    return TipsDetailScreen;
})();

export default TipsDetailScreen;







