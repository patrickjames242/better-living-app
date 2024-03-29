import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Menu from '../../../../api/orderingSystem/menus/Menu';
import NavigationControllerNavigationBar from '../../../../helpers/Views/NavigationControllerNavigationBar';
import FloatingCellStyleList from '../../../../helpers/Views/FloatingCellStyleList';
import { useSelector } from '../../../../redux/store';
import PlainTextListItem from '../PlainTextListItem';
import { caseInsensitiveStringSort } from '../../../../helpers/general';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../navigationHelpers';
import NavigationBarPlusButton from '../../../../helpers/Buttons/PlusButton';
import ListLoadingHolderView from '../../../../helpers/Views/ListLoadingView';
import NoItemsToShowView from '../../../../helpers/Views/NoItemsToShowView';

const MenusListScreen = (() => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
  });

  interface SectionType {
    data: Menu[];
  }

  const MenusListScreen = (
    props: StackScreenProps<SettingsNavStackParams, 'MenusList'>,
  ) => {
    const allMenusReduxState = useSelector(state => state.orderingSystem.menus);
    const sections: SectionType[] = useMemo(() => {
      return [
        {
          data: allMenusReduxState
            .toSet()
            .sort(caseInsensitiveStringSort(x => x.title))
            .toArray(),
        },
      ];
    }, [allMenusReduxState]);

    return (
      <View style={styles.root}>
        <NavigationControllerNavigationBar
          title="Menus"
          rightAlignedView={
            <NavigationBarPlusButton
              onPress={() => {
                props.navigation.push('MenuEditOrCreate', { menuId: null });
              }}
            />
          }
        />
        <ListLoadingHolderView>
          {(() => {
            if (allMenusReduxState.size <= 0) {
              return <NoItemsToShowView />;
            } else {
              return (
                <FloatingCellStyleList<Menu, SectionType>
                  sections={sections}
                  keyExtractor={x => String(x.id)}
                  renderItem={item => {
                    return (
                      <PlainTextListItem
                        title={item.item.title}
                        onPress={() => {
                          props.navigation.push('MenuEditOrCreate', {
                            menuId: item.item.id,
                          });
                        }}
                      />
                    );
                  }}
                />
              );
            }
          })()}
        </ListLoadingHolderView>
      </View>
    );
  };
  return MenusListScreen;
})();

export default MenusListScreen;
