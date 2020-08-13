import React, { useMemo } from 'react';
import {StyleSheet, View} from 'react-native';
import NavigationControllerNavigationBar from '../../../../helpers/NavigationController/NavigationControllerNavigationBar';
import FloatingCellStyleList from '../../../../helpers/Views/FloatingCellStyleList';
import MealCategory from '../../../../api/orderingSystem/mealCategories/MealCategory';
import { useSelector } from '../../../../redux/store';
import PlainTextListItem from '../PlainTextListItem';


const MealCategoriesListScreen = (() => {
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
    });

    interface SectionType{
        data: MealCategory[];
    }
    
    const MealCategoriesListScreen = () => {

        const mealCategories = useSelector(state => state.orderingSystem.mealCategories);
        const sections: SectionType[] = useMemo(() => {
            const categories = mealCategories.toSet().sortBy(x => x.uniqueName).toArray();
            return [{data: categories}];
        }, [mealCategories]);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Meal Categories"/>
            <FloatingCellStyleList<MealCategory, SectionType>
                sections={sections}
                keyExtractor={x => String(x.id)}
                renderItem={x => {
                    return <PlainTextListItem title={x.item.uniqueName}/>
                }}
            />
        </View>
    }
    return MealCategoriesListScreen;
})();

export default MealCategoriesListScreen;
