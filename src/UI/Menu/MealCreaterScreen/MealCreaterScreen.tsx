
import React, { useState, useMemo, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import { MealConfig} from './helpers';
import MealCreatorConstants from './MealCreatorConstants';
import MealCreatorScreenAddToCartButton from './ChildComponents/MealCreatorScreenAddToCartButton';
import MealCreatorListViewItem from './ChildComponents/MealCreatorListViewItem';
import { Map, List } from 'immutable';
import FloatingCellStyleList from '../../../helpers/Views/FloatingCellStyleList';
import ValueBox from '../../../helpers/ValueBox';
import { Optional, compactMap, caseInsensitiveStringSort } from '../../../helpers/general';
import BottomScreenGradientHolder, { BottomScreenGradientHolderRef } from '../../../helpers/Views/BottomScreenGradientHolder';
import LayoutConstants from '../../../LayoutConstants';
import { useSelector } from '../../../redux/store';
import MealCategory from '../../../api/orderingSystem/mealCategories/MealCategory';
import Product from '../../../api/orderingSystem/products/Product';
import ResourceNotFoundView from '../../../helpers/Views/ResourceNotFoundView';
import { StackScreenProps } from '@react-navigation/stack';
import { MenuNavStackParams } from '../navigationHelpers';
import { useCurrentMenuProductIds } from '../../../api/orderingSystem/menus/helpers';
import Meal from '../../../api/orderingSystem/meals/Meal';




const MealCreatorScreen = (() => {

    const bottomButtonTopAndBottomInsets = 15;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        sectionList: {

        },
        bottomButtonHolder: {
            paddingLeft: LayoutConstants.pageSideInsets,
            paddingRight: LayoutConstants.pageSideInsets,
            paddingBottom: bottomButtonTopAndBottomInsets,
        }
    });

    interface MealCreatorSection{
        id: number;
        title: number;
        data: Product[];
    }



    function useListViewSections(meal?: Meal){

        const allReduxMealCategories = useSelector(state => state.orderingSystem.mealCategories);

        const mealCategories = useMemo(() => {
            return List<MealCategory>().withMutations(list => {
                meal?.productCategories.sortBy(x => x.orderNumber).forEach(({id: categoryId}) => {
                    const category = allReduxMealCategories.get(categoryId);
                    category && list.push(category);
                });
            });
        }, [allReduxMealCategories, meal]);

        const currentMenuProductIds = useCurrentMenuProductIds();

        const allReduxProducts = useSelector(state => state.orderingSystem.products);

        const productsMap = useMemo(() => {
            return Map<number, Product>().withMutations(map => {
                mealCategories.forEach(mealCategory => {
                    mealCategory.productIds.forEach(productId => {
                        if (currentMenuProductIds.contains(productId) === false){return;}
                        const product = allReduxProducts.get(productId);
                        product && map.set(product.id, product);
                    });
                });
            });
        }, [allReduxProducts, currentMenuProductIds, mealCategories]);

        const listViewSections = useMemo(() => {
            return mealCategories.map(category => ({
                id: category.id,
                title: category.displayName ?? category.uniqueName,
                data: compactMap(category.productIds.toArray(), id => productsMap.get(id)).sort(caseInsensitiveStringSort(p => p.title)), 
            })).toArray();
        }, [mealCategories, productsMap]);

        return listViewSections;
    }

    


    const MealCreatorScreen = (props: StackScreenProps<MenuNavStackParams, 'MealCreator'>) => {

        const meal = useSelector(state => state.orderingSystem.meals.get(props.route.params.defaultMealConfig.mealId));
        
        const listViewSections = useListViewSections(meal);

        const [bottomButtonViewHeight, setBottomButtonViewHeight] = useState(0);

        function onAddToCartButtonPressed() {
            props.navigation.popToTop();
        }

        // key is the section id. value is the item id.
        const selectedItemsForEachSection = useRef(Map<number, ValueBox<Optional<number>>>());
        
        useMemo(() => {
            const selectedItems = selectedItemsForEachSection;
            selectedItems.current = selectedItems.current.withMutations(map => {
                listViewSections.forEach(section => {
                    map.set(section.id, map.get(section.id) ?? new ValueBox(null));
                });
            });
        }, [listViewSections]);


        const initialNumToRender = useMemo(() => {
            return Math.ceil(Dimensions.get('window').height / MealCreatorConstants.foodSections.rowHeight);
        }, []);

        const bottomButtonHolderRef = useRef<BottomScreenGradientHolderRef>(null);

        const sectionList = useMemo(() => {
            
            return <FloatingCellStyleList<Product, {id: number, title: string; data: Product[];}>
                style={styles.sectionList}
                contentContainerStyle={{paddingBottom: bottomButtonViewHeight + bottomButtonTopAndBottomInsets}}
                sections={listViewSections}
                titleForSection={section => section.title}                
                onScroll={event => bottomButtonHolderRef.current?.notifyThatScrollViewScrolled(event)}
                keyExtractor={item => String(item.id)}
                renderItem={({ item, section }) => {
                    const _section = section as MealCreatorSection;
                    return <MealCreatorListViewItem
                        item={item}
                        sectionSelectionValue={selectedItemsForEachSection.current.get(_section.id)!}
                    />
                }}
                initialNumToRender={initialNumToRender}
                windowSize={10}
            />

        }, [bottomButtonViewHeight, initialNumToRender, listViewSections, selectedItemsForEachSection]);


        return <View style={styles.root}>
            <NavigationControllerNavigationBar title={meal?.title ?? ""} />
            {(() => {
                if (meal == null){
                    return <ResourceNotFoundView/>
                } else {
                    return <>
                        {sectionList}
                        <BottomScreenGradientHolder style={styles.bottomButtonHolder} ref={bottomButtonHolderRef} onLayout={layout => {
                            setBottomButtonViewHeight(layout.nativeEvent.layout.height);
                        }}>
                            <MealCreatorScreenAddToCartButton price={meal.price} onPress={onAddToCartButtonPressed}/>
                        </BottomScreenGradientHolder>
                    </>
                }
            })()}
        </View>
    }

    return MealCreatorScreen;

})();

export default React.memo(MealCreatorScreen);

