import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import LayoutConstants from '../../../LayoutConstants';
import Spacer from '../../../helpers/Spacers/Spacer';
import TipsDetailAudioPlayerView from './TipsDetailAudioPlayerView/TipsDetailAudioPlayerView';
import TipsDetailYTVideoView from './TipsDetailYTVideoView';
import { useSelector } from '../../../redux/store';
import TipsDetailTitleView from './TipsDetailTitleView';
import TipsDetailDescriptionView from './TipsDetailDescriptionView';
import TipsDetailBottomButtonsView from './TipsDetailBottomButtonsView';
import ResourceNotFoundView from '../../../helpers/Views/ResourceNotFoundView';
import { StackScreenProps } from '@react-navigation/stack';
import { TipsNavStackParamList } from '../navigationHelpers';
import { useUpdateEffect } from '../../../helpers/reactHooks';
import { UserType } from '../../../api/authentication/validation';
import HealthTip from '../../../api/healthTips/HealthTip';
import { Optional } from '../../../helpers/general';
import ListLoadingHolderView from '../../../helpers/Views/ListLoadingView';
import { getHealthTip } from '../../../api/healthTips/requests';
import CustomActivityIndicator from '../../../helpers/Views/ActivityIndicator';

const TipsDetailScreen = (() => {
  const spacing = 15;

  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    scrollView: {
      overflow: 'visible',
    },
    scrollViewContentContainer: {
      ...LayoutConstants.maxWidthListContentContainerStyles(),
    },
    loadingIndicatorHolder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const TipsDetailScreen = (
    props: StackScreenProps<TipsNavStackParamList, 'TipDetail'>,
  ) => {
    const reduxHealthTip = useSelector(state =>
      state.healthTips.get(props.route.params.healthTipId),
    );
    const [healthTipFromNetwork, setHealthTipFromNetwork] =
      useState<Optional<HealthTip>>(null);
    const [isLoadingHealthTipFromNetwork, setIsLoadingHealthTipFromNetwork] =
      useState(false);

    useLayoutEffect(() => {
      if (reduxHealthTip == null) {
        setIsLoadingHealthTipFromNetwork(true);
        getHealthTip(props.route.params.healthTipId)
          .then(setHealthTipFromNetwork)
          .finally(() => setIsLoadingHealthTipFromNetwork(false));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const healthTip = (() => {
      if (reduxHealthTip) return reduxHealthTip;
      else return healthTipFromNetwork;
    })();

    const healthTipArticleText = healthTip?.articleText?.trim() ?? '';
    const userIsManager = useSelector(state => {
      return state.authentication?.userObject.userType === UserType.manager;
    });

    return (
      <View style={styles.root}>
        <NavigationControllerNavigationBar title={healthTip?.title ?? ''} />
        {(() => {
          if (isLoadingHealthTipFromNetwork) {
            return (
              <View style={styles.loadingIndicatorHolder}>
                <CustomActivityIndicator size="large" />
              </View>
            );
          } else if (healthTip == null) {
            return <ResourceNotFoundView />;
          } else {
            return (
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContentContainer}
              >
                {/*eslint-disable-next-line react/no-children-prop*/}
                <Spacer
                  space={spacing}
                  children={[
                    <TipsDetailTitleView
                      key="title-view"
                      dateString={healthTip.getFormattedDateString()}
                      titleString={healthTip.title}
                    />,
                    ...(healthTip?.audioFiles
                      .toArray()
                      .map(x => (
                        <TipsDetailAudioPlayerView
                          key={x.id}
                          audioFileUrl={x.url}
                        />
                      )) ?? []),
                    ...(healthTip?.youtubeVideoIDs
                      .toArray()
                      .map(x => (
                        <TipsDetailYTVideoView key={x} ytVideoID={x} />
                      )) ?? []),
                    healthTipArticleText.length >= 1 && (
                      <TipsDetailDescriptionView
                        key="description-view"
                        articleText={healthTipArticleText}
                      />
                    ),
                    ...(userIsManager
                      ? [
                          <TipsDetailBottomButtonsView
                            key="bottom-buttons"
                            healthTipId={props.route.params.healthTipId}
                          />,
                        ]
                      : []),
                  ]}
                />
              </ScrollView>
            );
          }
        })()}
      </View>
    );
  };
  return TipsDetailScreen;
})();

export default TipsDetailScreen;
