import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Meal from '../../../../api/orderingSystem/meals/Meal';
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

const MealsListScreen = (() => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
  });

  interface SectionType {
    data: Meal[];
  }

  const MealsListScreen = (
    props: StackScreenProps<SettingsNavStackParams, 'MealEditOrCreate'>,
  ) => {
    const meals = useSelector(state => state.orderingSystem.meals);
    const sections = useMemo(() => {
      const sortedMeals = meals
        .toSet()
        .sort(caseInsensitiveStringSort(x => x.title))
        .toArray();
      return [{ data: sortedMeals }];
    }, [meals]);

    return (
      <View style={styles.root}>
        <NavigationControllerNavigationBar
          title="Meals"
          rightAlignedView={
            <NavigationBarPlusButton
              onPress={() =>
                props.navigation.push('MealEditOrCreate', { mealId: null })
              }
            />
          }
        />
        <ListLoadingHolderView>
          {(() => {
            if (meals.size <= 0) {
              return <NoItemsToShowView />;
            } else {
              return (
                <FloatingCellStyleList<Meal, SectionType>
                  sections={sections}
                  keyExtractor={x => String(x.id)}
                  renderItem={item => {
                    return (
                      <PlainTextListItem
                        title={item.item.title}
                        onPress={() => {
                          props.navigation.push('MealEditOrCreate', {
                            mealId: item.item.id,
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
  return MealsListScreen;
})();

export default MealsListScreen;
