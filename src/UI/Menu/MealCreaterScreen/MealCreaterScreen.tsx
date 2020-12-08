
import React, { useState, useMemo, useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import MealCreatorConstants from './MealCreatorConstants';
import MealCreatorListViewItem from './ChildComponents/MealCreatorListViewItem';
import { is, Map, Set } from 'immutable';
import FloatingCellStyleList from '../../../helpers/Views/FloatingCellStyleList';
import { Optional, compactMap, caseInsensitiveStringSort, mapOptional } from '../../../helpers/general';
import LayoutConstants from '../../../LayoutConstants';
import { useSelector } from '../../../redux/store';
import MealCategory from '../../../api/orderingSystem/mealCategories/MealCategory';
import Product from '../../../api/orderingSystem/products/Product';
import ResourceNotFoundView from '../../../helpers/Views/ResourceNotFoundView';
import { StackScreenProps } from '@react-navigation/stack';
import { MealCreatorPropKeys, MenuNavStackParams } from '../navigationHelpers';
import { useCurrentMenuProductIds } from '../../../api/orderingSystem/menus/helpers';
import Meal from '../../../api/orderingSystem/meals/Meal';
import BottomScreenButtonWithGradient, { BottomScreenButtonWithGradientRef } from '../../../helpers/Views/BottomScreenButtonWithGradient';
import { DefaultLongButtonsProps } from '../../../helpers/Buttons/LongTextAndIconButton';
import { addMealEntryToCart, MealEntryRequestChoice, updateMealEntryChoices } from '../../../api/cart/requests';
import { displayErrorMessage } from '../../../helpers/Alerts';




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

    interface MealCreatorSection {
        categoryId: number;
        title: string;
        data: Product[];
    }



    function useListViewSections(meal?: Meal) {

        const allReduxMealCategories = useSelector(state => state.orderingSystem.mealCategories);
        const currentMenuProductIds = useCurrentMenuProductIds();
        const allReduxProducts = useSelector(state => state.orderingSystem.products);

        const currentMealCategoriesMap = useMemo(() => {
            return Map<number, {
                title: string,
                productIds: Set<number>,
            }>().withMutations(map => {
                meal?.productCategories.forEach(({ id: categoryId }) => {
                    const category = allReduxMealCategories.get(categoryId);
                    category && map.set(category.id, {
                        title: category.displayName ?? category.uniqueName,
                        productIds: category.productIds.filter(x =>
                            currentMenuProductIds.has(x) && allReduxProducts.has(x)
                        ),
                    });
                });
            })
        }, [allReduxMealCategories, allReduxProducts, currentMenuProductIds, meal?.productCategories]);


        const listViewSections: MealCreatorSection[] = useMemo(() => {
            let x: MealCreatorSection[] = [];
            currentMealCategoriesMap.forEach((category, id) => {
                x.push({
                    categoryId: id,
                    title: category.title,
                    data: compactMap(category.productIds.toArray(), id => {
                        return allReduxProducts.get(id);
                    }).sort(caseInsensitiveStringSort(p => p.title)),
                })
            });
            return x.sort(caseInsensitiveStringSort(x => x.title));
        }, [currentMealCategoriesMap, allReduxProducts]);

        return {
            listViewSections,
            currentMealCategoriesMap,
        };
    }




    const MealCreatorScreen = (props: StackScreenProps<MenuNavStackParams, 'MealCreator'>) => {

        const mealId = (() => {
            if ("mealIdToCreateEntryFor" in props.route.params) {
                return props.route.params[MealCreatorPropKeys.mealIdToCreateEntryFor];
            } else {
                return props.route.params.mealEntryToEdit.mealId;
            }
        })();

        const meal = useSelector(state => state.orderingSystem.meals.get(mealId));
        const { listViewSections, currentMealCategoriesMap } = useListViewSections(meal);
        const [bottomButtonViewHeight, setBottomButtonViewHeight] = useState(0);
        const [isSubmitLoading, setIsSubmitLoading] = useState(false);

        useLayoutEffect(() => {
            if (meal == null) {
                props.navigation.goBack();
            }
        }, [meal, props.navigation]);

        const initialChosenProductIds = useMemo(() => {
            return Map<number, Optional<number>>().withMutations(map => {
                if (
                    'mealIdToCreateEntryFor' in props.route.params
                ) {
                    currentMealCategoriesMap.forEach((category, categoryId) => {
                        if (category.productIds.size === 1) {
                            map.set(categoryId, category.productIds.first() as number);
                        } else if (
                            'defaultSelectedProductId' in props.route.params &&
                            props.route.params.defaultSelectedProductId != null
                        ) {
                            map.set(categoryId, props.route.params.defaultSelectedProductId);
                        } else {
                            map.set(categoryId, null);
                        }
                    });
                } else if ('mealEntryToEdit' in props.route.params) {
                    props.route.params.mealEntryToEdit.choices.forEach(x => {
                        if (currentMealCategoriesMap.get(x.mealProductCategoryId)?.productIds.has(x.chosenProductId) ?? false) {
                            map.set(x.mealProductCategoryId, x.chosenProductId);
                        }
                    });
                    currentMealCategoriesMap.forEach((_, categoryId) => {
                        map.set(categoryId, map.get(categoryId) ?? null);
                    });
                }
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const [chosenProductIds, setChosenProductIds] = useState(initialChosenProductIds);

        // updates the products in the selectedItemsForEachSectionRef everytime the listViewSections changes
        useEffect(() => {
            setChosenProductIds(oldState => {
                const newState = Map<number, Optional<number>>().withMutations(map => {
                    currentMealCategoriesMap.forEach((category, categoryId) => {
                        const chosenProductId = mapOptional(oldState.get(categoryId), x => {
                            return category.productIds.has(x) ? x : null
                        }) ?? null;
                        map.set(categoryId, chosenProductId);
                    });
                });
                return is(newState, oldState) ? oldState : newState;
            });
        }, [currentMealCategoriesMap, listViewSections]);

        const shouldSubmitButtonBeEnabled = useMemo(() => {

            const areSelectionsValid = (
                chosenProductIds.some((productId, categoryId) => {
                    return productId == null || (
                        (currentMealCategoriesMap.get(categoryId)?.productIds.has(productId) ?? false) === false
                    );
                }) === false
            ) && (currentMealCategoriesMap.size === chosenProductIds.size);

            const areThereChangesToBeSaved = (
                (
                    MealCreatorPropKeys.mealEntryToEdit in props.route.params &&
                    is(initialChosenProductIds, chosenProductIds) === false
                ) ||
                MealCreatorPropKeys.mealIdToCreateEntryFor in props.route.params
            );

            return areSelectionsValid && areThereChangesToBeSaved;
        }, [chosenProductIds, currentMealCategoriesMap, initialChosenProductIds, props.route.params]);


        function onSubmitButtonPressed() {
            const choices = (() => {
                let x: MealEntryRequestChoice[] = [];
                chosenProductIds.forEach((value, key) => {
                    if (!value) { return; }
                    x.push({
                        meal_product_category_id: key,
                        chosen_product_id: value,
                    })
                });
                return x;
            })();

            setIsSubmitLoading(true);

            const promise = (() => {
                if ('mealEntryToEdit' in props.route.params) {
                    return updateMealEntryChoices(props.route.params.mealEntryToEdit.id, choices);
                } else {
                    return addMealEntryToCart({
                        meal_id: props.route.params.mealIdToCreateEntryFor,
                        choices,
                    })
                }
            })();

            promise.finally(() => {
                setIsSubmitLoading(false);
            }).then(() => {
                props.navigation.popToTop();
            }).catch(error => {
                displayErrorMessage(error.message);
            });
        }



        const initialNumToRender = useMemo(() => {
            return Math.ceil(Dimensions.get('window').height / MealCreatorConstants.foodSections.rowHeight);
        }, []);

        const bottomButtonHolderRef = useRef<BottomScreenButtonWithGradientRef>(null);

        const updateSelectedProductIdForCategory = useCallback((categoryId: number, productId: number) => {
            setChosenProductIds(old => old.set(categoryId, productId));
        }, []);

        const sectionList = useMemo(() => {
            return <FloatingCellStyleList<Product, MealCreatorSection>
                style={styles.sectionList}
                contentContainerStyle={{ paddingBottom: bottomButtonViewHeight + bottomButtonTopAndBottomInsets }}
                sections={listViewSections}
                titleForSection={section => section.title}
                onScroll={event => bottomButtonHolderRef.current?.gradientHolder?.notifyThatScrollViewScrolled(event)}
                keyExtractor={item => String(item.id)}
                renderItem={({ item, section }) => {
                    const _section = section as MealCreatorSection;
                    return <MealCreatorListViewItem
                        item={item}
                        updateSelectedProductIdForCategory={updateSelectedProductIdForCategory}
                        categoryId={_section.categoryId}
                        isSelected={chosenProductIds.get(_section.categoryId) === item.id}
                    />
                }}
                initialNumToRender={initialNumToRender}
                windowSize={10}
            />
        }, [bottomButtonViewHeight, chosenProductIds, initialNumToRender, listViewSections, updateSelectedProductIdForCategory]);


        return <View style={styles.root}>
            <NavigationControllerNavigationBar title={meal?.title ?? ""} />
            {(() => {
                if (meal == null) {
                    return <ResourceNotFoundView />
                } else {
                    return <>
                        {sectionList}
                        <BottomScreenButtonWithGradient
                            ref={bottomButtonHolderRef}
                            gradientHolderProps={{
                                style: styles.bottomButtonHolder,
                                onLayout: layout => {
                                    setBottomButtonViewHeight(layout.nativeEvent.layout.height);
                                }
                            }}
                            buttonProps={{
                                ...((() => {
                                    if (MealCreatorPropKeys.mealEntryToEdit in props.route.params) {
                                        return DefaultLongButtonsProps.saveChanges;
                                    } else {
                                        return {
                                            text: 'Add to Cart',
                                            iconSource: require('../../TabBarController/icons/shopping-cart.png'),
                                        }
                                    }
                                })()),
                                onPress: onSubmitButtonPressed,
                                isLoading: isSubmitLoading,
                                isEnabled: shouldSubmitButtonBeEnabled,
                            }}
                        />
                    </>
                }
            })()}
        </View>
    }

    return React.memo(MealCreatorScreen);

})();

export default MealCreatorScreen;

