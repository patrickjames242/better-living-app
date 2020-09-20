
import React, { useState, useMemo, useRef, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import MealCreatorConstants from './MealCreatorConstants';
import MealCreatorListViewItem from './ChildComponents/MealCreatorListViewItem';
import { Map, Set } from 'immutable';
import FloatingCellStyleList from '../../../helpers/Views/FloatingCellStyleList';
import ValueBox from '../../../helpers/ValueBox';
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
        const getCategoryTitle = (category: MealCategory) => category.displayName ?? category.uniqueName;

        const mealCategories = useMemo(() => {
            return Set<MealCategory>().withMutations(set => {
                meal?.productCategories.forEach(({ id: categoryId }) => {
                    const category = allReduxMealCategories.get(categoryId);
                    category && set.add(category);
                });
            }).toList().sort(caseInsensitiveStringSort(getCategoryTitle));
        }, [allReduxMealCategories, meal]);

        const currentMenuProductIds = useCurrentMenuProductIds();

        const allReduxProducts = useSelector(state => state.orderingSystem.products);

        const productsMap = useMemo(() => {
            return Map<number, Product>().withMutations(map => {
                mealCategories.forEach(mealCategory => {
                    mealCategory.productIds.forEach(productId => {
                        if (currentMenuProductIds.contains(productId) === false) { return; }
                        const product = allReduxProducts.get(productId);
                        product && map.set(product.id, product);
                    });
                });
            });
        }, [allReduxProducts, currentMenuProductIds, mealCategories]);

        const listViewSections: MealCreatorSection[] = useMemo(() => {
            return mealCategories.map(category => ({
                categoryId: category.id,
                title: getCategoryTitle(category),
                data: compactMap(category.productIds.toArray(), id => productsMap.get(id)).sort(caseInsensitiveStringSort(p => p.title)),
            })).toArray();
        }, [mealCategories, productsMap]);

        return {
            listViewSections,
            allReduxMealCategories,
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
        const { listViewSections, allReduxMealCategories } = useListViewSections(meal);
        const [bottomButtonViewHeight, setBottomButtonViewHeight] = useState(0);
        const [isSubmitLoading, setIsSubmitLoading] = useState(false);




        const initialMealEntryToEdit_CategoryIdToChosenProductIdMap = useMemo(() => {
            return Map<number, number>().withMutations(map => {
                if ('mealEntryToEdit' in props.route.params) {
                    props.route.params.mealEntryToEdit.choices.forEach(x => {
                        map.set(x.mealProductCategoryId, x.chosenProductId);
                    });
                }
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const initialSelectedItemsForEachSection: Map<number, ValueBox<Optional<number>>> = useMemo(() => {
            return Map<number, ValueBox<Optional<number>>>().withMutations(map => {
                listViewSections.forEach(x => {
                    const selectedProduct = initialMealEntryToEdit_CategoryIdToChosenProductIdMap.get(x.categoryId);
                    const selectedProductToUse = mapOptional(selectedProduct, y => allReduxMealCategories.get(x.categoryId)?.productIds.has(y) ?? false ? y : null);
                    map.set(x.categoryId, new ValueBox(selectedProductToUse));
                });
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // key is the section id. value is the item id.
        const selectedItemsForEachSection = useRef(initialSelectedItemsForEachSection);

        useMemo(() => {
            const selectedItems = selectedItemsForEachSection;
            selectedItems.current = selectedItems.current.withMutations(map => {
                listViewSections.forEach(section => {
                    map.set(section.categoryId, map.get(section.categoryId) ?? new ValueBox(null));
                });
            });
        }, [listViewSections]);

        const calculateShouldSubmitButtonBeEnabled = useCallback(() => {
            const areSelectionsInvalid = selectedItemsForEachSection.current.some((value, key) => {
                if (value.value == null) { return true; }
                return (allReduxMealCategories.get(key)?.productIds.contains(value.value) ?? false) === false;
            });
            return areSelectionsInvalid === false;
        }, [allReduxMealCategories, selectedItemsForEachSection.current]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        const initialShouldSubmitButtonBeEnabled = useMemo(() => calculateShouldSubmitButtonBeEnabled(), []);

        const [shouldSubmitButtonBeEnabled, setShouldSubmitButtonsBeEnabled] = useState(initialShouldSubmitButtonBeEnabled);



        useLayoutEffect(() => {
            const unlistens: (() => void)[] = [];
            const listener = () => {
                setShouldSubmitButtonsBeEnabled(calculateShouldSubmitButtonBeEnabled());
            }
            selectedItemsForEachSection.current.forEach(x => {
                unlistens.push(x.observer.addListener(listener));
            })
            return () => unlistens.forEach(x => x());
        }, [allReduxMealCategories, calculateShouldSubmitButtonBeEnabled, selectedItemsForEachSection.current])



        function onSubmitButtonPressed() {
            const choices = (() => {
                let x: MealEntryRequestChoice[] = [];
                selectedItemsForEachSection.current.forEach((value, key) => {
                    if (!value.value) { return; }
                    x.push({
                        meal_product_category_id: key,
                        chosen_product_id: value.value,
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
                        sectionSelectionValue={selectedItemsForEachSection.current.get(_section.categoryId)!}
                    />
                }}
                initialNumToRender={initialNumToRender}
                windowSize={10}
            />
        }, [bottomButtonViewHeight, initialNumToRender, listViewSections, selectedItemsForEachSection]);


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
                                            iconSource: require('../../TabBarController/TabBar/icons/shopping-cart.png'),
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

    return MealCreatorScreen;

})();

export default React.memo(MealCreatorScreen);

