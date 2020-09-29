

import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import NavigationControllerNavigationBar from '../../src/helpers/Views/NavigationControllerNavigationBar';
import LayoutConstants from '../../src/LayoutConstants';
import Spacer from '../../src/helpers/Spacers/Spacer';
import TipsDetailAudioPlayerView from './TipsDetailAudioPlayerView/TipsDetailAudioPlayerView';
import TipsDetailYTVideoView from './TipsDetailYTVideoView';
import { useSelector } from '../../src/redux/store';
import TipsDetailTitleView from './TipsDetailTitleView';
import TipsDetailDescriptionView from './TipsDetailDescriptionView';
import TipsDetailBottomButtonsView from './TipsDetailBottomButtonsView';
import ResourceNotFoundView from '../../src/helpers/Views/ResourceNotFoundView';
import { StackScreenProps } from '@react-navigation/stack';
import { TipsNavStackParamList } from '../navigationHelpers';
import { useUpdateEffect } from '../../src/helpers/reactHooks';





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

    const TipsDetailScreen = (props: StackScreenProps<TipsNavStackParamList, 'TipDetail'>) => {

        const healthTip = useSelector(state => state.healthTips.get(props.route.params.healthTipId));
        const healthTipId = healthTip?.id;

        const healthTipArticleText = healthTip?.articleText?.trim() ?? '';


        useUpdateEffect(() => {
            if (healthTipId == null){
                props.navigation.goBack();
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.route.params.healthTipId]);


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
                        {/*eslint-disable-next-line react/no-children-prop*/}
                        <Spacer space={spacing} children={[
                            <TipsDetailTitleView key="title-view" dateString={healthTip.getFormattedDateString()} titleString={healthTip.title} />,
                            ...healthTip?.audioFiles.toArray().map(x => <TipsDetailAudioPlayerView key={x.id} audioFileUrl={x.url}/>) ?? [],
                            ...healthTip?.youtubeVideoIDs.toArray().map(x => <TipsDetailYTVideoView key={x} ytVideoID={x}/>) ?? [],
                            (healthTipArticleText.length >= 1) &&
                                <TipsDetailDescriptionView key='description-view' articleText={healthTipArticleText} />,
                            <TipsDetailBottomButtonsView key='bottom-buttons' healthTipId={props.route.params.healthTipId} />
                        ]}/>
                    </ScrollView>
                }
            })()}
        </View>
    }
    return TipsDetailScreen;
})();

export default TipsDetailScreen;


