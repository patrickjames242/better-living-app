import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, LayoutRectangle } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import { computeNumberOfListColumns } from '../../../helpers/general';
import TipsListItemView from './TipsListItemView';
import LayoutConstants from '../../../LayoutConstants';
import Space from '../../../helpers/Spacers/Space';
import MultiColumnFlatList from '../../../helpers/Views/MultipleColumnLists/MultiColumnFlatList';
import NavigationBarPlusButton from '../../../helpers/Buttons/PlusButton';
import { StackScreenProps } from '@react-navigation/stack';
import { TipsNavStackParamList } from '../navigationHelpers';
import NoItemsToShowView from '../../../helpers/Views/NoItemsToShowView';
import PaginationListHolderView, {
  PaginationListChangeType,
  PaginationListHolderViewRef,
} from '../../../helpers/Views/PaginationListHolderView';
import { getAllHealthTips } from '../../../api/healthTips/requests';
import {
  HealthTipChangeType,
  healthTipsUpdatesNotification,
} from '../../../api/healthTips/realtimeUpdates';
import store, {
  addSelectedStateListener,
  useSelector,
} from '../../../redux/store';
import {
  deleteHealthTipAction,
  insertHealthTipsAction,
  updateHealthTipAction,
} from '../../../redux/healthTips';
import { UserType } from '../../../api/authentication/validation';
import { useTabBarControllerChildRootScreenPopToTopFunctionality } from '../../TabBarController/helpers';
import { TabBarSelection } from '../../TabBarController/tabBarSelectionsHelpers';
import { RealtimeUpdatesConnectionState } from '../../../redux/realtimeUpdates';
import { AppContext } from '../../helpers';

const TipsListScreen = (() => {
  const listViewPadding = LayoutConstants.pageSideInsets;
  const itemSpacing = 13;

  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    flatList: {
      overflow: 'visible',
      flex: 1,
    },
    flatListContentContainer: {
      ...LayoutConstants.maxWidthListContentContainerStyles(1100),
    },
  });

  function calculateListColumns(layout: LayoutRectangle) {
    const num = computeNumberOfListColumns({
      listWidth: layout.width,
      sideInsets: listViewPadding,
      horizontalItemSpacing: itemSpacing,
      maxItemWidth: 600,
    });
    return Math.min(num, 2);
  }

  const TipsListScreen = (
    props: StackScreenProps<TipsNavStackParamList, 'TipsList'>,
  ) => {
    const appContext = useContext(AppContext);

    useEffect(() => {
      const initialAppScreen = appContext.initialAppScreen;
      if (
        initialAppScreen &&
        'healthTipId' in initialAppScreen &&
        initialAppScreen.healthTipId
      ) {
        props.navigation.push('TipDetail', {
          healthTipId: initialAppScreen.healthTipId,
        });
      }
    }, []);

    function onPlusButtonPressed() {
      props.navigation.push('CreateOrEditTip', { tipIdToEdit: null });
    }

    const paginationListHolderView =
      useRef<PaginationListHolderViewRef<number, number>>(null);

    useTabBarControllerChildRootScreenPopToTopFunctionality(
      TabBarSelection.tips,
      props,
    );

    const shouldRefreshOnNextConnect = useRef(
      [
        RealtimeUpdatesConnectionState.noConnectionAttemptMade,
        RealtimeUpdatesConnectionState.connecting,
      ].includes(store.getState().realtimeUpdates.connectionState) === false,
    );

    useEffect(() => {
      return addSelectedStateListener(
        x =>
          x.realtimeUpdates.connectionState ===
          RealtimeUpdatesConnectionState.connected,
        isConnected => {
          if (isConnected === false) return;
          if (shouldRefreshOnNextConnect.current === false) {
            shouldRefreshOnNextConnect.current = true;
            return;
          }
          paginationListHolderView.current?.refresh();
          shouldRefreshOnNextConnect.current = true;
        },
      );
    }, []);

    useEffect(() => {
      return healthTipsUpdatesNotification.addListener(info => {
        switch (info.changeType) {
          case HealthTipChangeType.insert:
          case HealthTipChangeType.update: {
            const changeToApply: {
              changeType: PaginationListChangeType.insertOrUpdate;
              changedItem: number;
            } = {
              changeType: PaginationListChangeType.insertOrUpdate,
              changedItem: info.changedObject.id,
            };

            switch (info.changeType) {
              case HealthTipChangeType.insert: {
                store.dispatch(insertHealthTipsAction([info.changedObject]));
                const changeWasApplied =
                  paginationListHolderView.current?.applyChangeIfNeeded(
                    changeToApply,
                  ) ?? false;
                if (changeWasApplied === false) {
                  store.dispatch(deleteHealthTipAction(info.changedObject.id));
                }
                break;
              }
              case HealthTipChangeType.update: {
                const previousHealthTip = store
                  .getState()
                  .healthTips.get(info.changedObject.id);
                store.dispatch(updateHealthTipAction(info.changedObject));
                const changeWasApplied =
                  paginationListHolderView.current?.applyChangeIfNeeded(
                    changeToApply,
                  ) ?? false;
                if (changeWasApplied === false && previousHealthTip != null) {
                  store.dispatch(updateHealthTipAction(previousHealthTip));
                }
                break;
              }
            }
            break;
          }
          case HealthTipChangeType.delete: {
            const changeToApply: {
              changeType: PaginationListChangeType.delete;
              deletedItemId: number;
            } = {
              changeType: PaginationListChangeType.delete,
              deletedItemId: info.deletedObjectId,
            };
            const healthTipToDelete = store
              .getState()
              .healthTips.get(info.deletedObjectId);
            store.dispatch(deleteHealthTipAction(info.deletedObjectId));
            if (
              (paginationListHolderView.current?.applyChangeIfNeeded(
                changeToApply,
              ) ?? false) === false &&
              healthTipToDelete != null
            ) {
              store.dispatch(insertHealthTipsAction([healthTipToDelete]));
            }
            break;
          }
        }
      });
    }, []);

    const fetchMoreItems = useCallback(
      (maxAmount?: number, maxDate?: string) => {
        return getAllHealthTips(maxAmount, maxDate).then(healthTips => {
          store.dispatch(insertHealthTipsAction(healthTips));
          return healthTips.map(x => x.id);
        });
      },
      [],
    );

    const isUserManager = useSelector(state => {
      return state.authentication?.userObject.userType === UserType.manager;
    });

    return (
      <View style={styles.root}>
        <LargeHeadingNavigationBar
          title="Health Tips"
          rightAlignedView={
            isUserManager ? (
              <NavigationBarPlusButton onPress={onPlusButtonPressed} />
            ) : undefined
          }
        />
        <PaginationListHolderView<number, number>
          batchSize={20}
          fetchMoreItems={fetchMoreItems}
          getItemId={x => x}
          getItemDate={x => {
            const date = store.getState().healthTips.get(x)?.date;
            if (date == null) {
              throw new Error('no health tip was found for the provided id');
            }
            return date;
          }}
          ref={paginationListHolderView}
        >
          {({ ListFooterComponent, fetchMoreItems, items }) => {
            if (items.length < 1) {
              return (
                <NoItemsToShowView
                  title="No Tips"
                  subtitle="No health tips are available at this time."
                />
              );
            } else {
              return (
                <MultiColumnFlatList
                  contentContainerStyle={styles.flatListContentContainer}
                  numberOfColumns={calculateListColumns}
                  style={styles.flatList}
                  ItemSeparatorComponent={() => {
                    return <Space space={itemSpacing} />;
                  }}
                  columnSpacing={itemSpacing}
                  data={items}
                  keyExtractor={item => String(item)}
                  renderItem={item => {
                    return <TipsListItemView id={item} />;
                  }}
                  ListFooterComponent={ListFooterComponent}
                  onEndReachedThreshold={0.1}
                  onEndReached={fetchMoreItems}
                />
              );
            }
          }}
        </PaginationListHolderView>
      </View>
    );
  };

  return TipsListScreen;
})();

export default TipsListScreen;
