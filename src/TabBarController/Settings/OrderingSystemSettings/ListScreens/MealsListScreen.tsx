import React, { useMemo } from 'react';
import {StyleSheet, View} from 'react-native';
import Meal from '../../../../api/orderingSystem/meals/Meal';
import NavigationControllerNavigationBar from '../../../../helpers/NavigationController/NavigationControllerNavigationBar';
import FloatingCellStyleList from '../../../../helpers/Views/FloatingCellStyleList';
import { useSelector } from '../../../../redux/store';
import PlainTextListItem from '../PlainTextListItem';



const MealsListScreen = (() => {
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
    });

    interface SectionType{
        data: Meal[];
    }
    
    const MealsListScreen = () => {
        
        const meals = useSelector(state => state.orderingSystem.meals);
        const sections = useMemo(() => {
            const sortedMeals = meals.toSet().sortBy(x => x.title).toArray();
            return [{data: sortedMeals}];
        }, [meals]);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Meals"/>
            <FloatingCellStyleList<Meal, SectionType>
                sections={sections}
                keyExtractor={x => String(x.id)}
                renderItem={item => {
                    return <PlainTextListItem title={item.item.title}/>
                }}
            />
        </View>
    }
    return MealsListScreen;
})();

export default MealsListScreen;
