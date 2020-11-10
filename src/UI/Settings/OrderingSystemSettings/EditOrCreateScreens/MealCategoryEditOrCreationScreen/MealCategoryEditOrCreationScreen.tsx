
import React, { useMemo, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import OrderingSystemEditingFormScreen from '../OrderingSystemEditingFormScreen';
import { Formik } from '../../../../../helpers/formik';
import store, { useSelector } from '../../../../../redux/store';
import { DefaultKeyboardConfigs, mapOptional, Optional } from '../../../../../helpers/general';
import { Set } from 'immutable';
import { MealCategoryEditOrCreateValues } from './helpers';
import { FormikTextFieldView } from '../../../../../helpers/Views/FormikTextFieldView';
import * as Yup from 'yup';
import { deleteMealCategory, MealCategoriesRequestObj, createNewMealCategory, updateMealCategory } from '../../../../../api/orderingSystem/mealCategories/requests';
import OrderingSystemFormChildrenProductsSelector from '../OrderingSystemFormChildrenProductsSelector';
import { displayErrorMessage } from '../../../../../helpers/Alerts';



const MealCategoryEditOrCreationScreen = (() => {

    function submitForm(mealCategoryId: Optional<number>, values: MealCategoryEditOrCreateValues) {
        const displayName = (() => {
            const x = values.displayName.trim();
            return x.length >= 1 ? x : null;
        })();
        const requestObj: MealCategoriesRequestObj = {
            unique_name: values.uniqueName.trim(),
            display_name: displayName,
            product_ids: values.productIds.toArray(),
        };

        if (mealCategoryId == null) {
            return createNewMealCategory(requestObj);
        } else {
            return updateMealCategory(mealCategoryId, requestObj);
        }

    }

    const MealCategoryEditOrCreationScreen = (props: StackScreenProps<SettingsNavStackParams, 'MealCategoryEditOrCreate'>) => {

        const navBarTitle = props.route.params.mealCategoryId == null ? 'Create Meal Category' : 'Edit Meal Category';

        const mealCategoryId = props.route.params.mealCategoryId;

        const mealCategory = useSelector(state => {
            return mapOptional(mealCategoryId, id => {
                return state.orderingSystem.mealCategories.get(id);
            });
        });

        const [isDeleting, setIsDeleting] = useState(false);

        const initialValues: MealCategoryEditOrCreateValues = useMemo(() => {
            
            const reduxProducts = store.getState().orderingSystem.products;

            return {
                displayName: mealCategory?.displayName ?? '',
                uniqueName: mealCategory?.uniqueName ?? '',
                productIds: Set<number>().withMutations(set => {
                    const productIds = mealCategory?.productIds;
                    if (productIds == null) return;
                    productIds.forEach(x => {
                        if (reduxProducts.has(x)) set.add(x);
                    });
                }),
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                displayName: Yup.string(),
                uniqueName: Yup.string().trim().required('unique name is a required field'),
            })}
            onSubmit={(values, { setSubmitting }) => {

                submitForm(mealCategoryId, values).finally(() => {
                    setSubmitting(false);
                }).then(() => {
                    props.navigation.goBack();
                }).catch(error => {
                    displayErrorMessage(error.message);
                });

            }}
        >{formik => {

            const shouldButtonsBeEnabled = formik.isSubmitting === false && isDeleting === false;

            return <OrderingSystemEditingFormScreen
                navBarTitle={navBarTitle}
                saveButtonProps={{
                    onPress: formik.submitForm,
                    isLoading: formik.isSubmitting,
                    isEnabled: shouldButtonsBeEnabled,
                }}
                shouldShowDeleteButton={typeof mealCategoryId === 'number'}
                deleteButtonProps={{
                    text: 'Delete Meal Category',
                    isLoading: isDeleting,
                    isEnabled: shouldButtonsBeEnabled,
                    onPress: () => {
                        if (typeof mealCategoryId !== 'number') { return; }
                        setIsDeleting(true);
                        deleteMealCategory(mealCategoryId).finally(() => {
                            setIsDeleting(false);
                        }).then(() => {
                            props.navigation.goBack();
                        }).catch(error => {
                            displayErrorMessage(error.message);
                        });
                    },
                }}
            >
                <FormikTextFieldView<MealCategoryEditOrCreateValues> formikFieldName="uniqueName" topTitleText="Unique Name" textInputProps={DefaultKeyboardConfigs.name} />
                <FormikTextFieldView<MealCategoryEditOrCreateValues> formikFieldName="displayName" topTitleText="Display Name" textInputProps={DefaultKeyboardConfigs.name} />
                <OrderingSystemFormChildrenProductsSelector value={formik.values.productIds} onValueChanged={v => formik.setFieldValue('productIds', v)} />
            </OrderingSystemEditingFormScreen>
        }}</Formik>
    }
    return MealCategoryEditOrCreationScreen;
})();

export default MealCategoryEditOrCreationScreen;

