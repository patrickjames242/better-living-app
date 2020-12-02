
import React, { useState, useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import store, { useSelector } from '../../../../../redux/store';
import { DefaultKeyboardConfigs, mapOptional, NASSAU_TIME_ZONE, Optional } from '../../../../../helpers/general';
import { MenuEditOrCreationValues, MenuEditOrCreateProductCategory, menuEditOrCreateProductCategorySchema } from './helpers';
import { Set, Map } from 'immutable';
import { Formik } from '../../../../../helpers/formik';
import * as yup from 'yup';
import OrderingSystemEditingFormScreen from '../OrderingSystemEditingFormScreen';
import { deleteMenu, MenuRequestObj, createNewMenu, updateMenu } from '../../../../../api/orderingSystem/menus/requests';
import { FormikTextFieldView } from '../../../../../helpers/Views/FormikTextFieldView';
import MenuEditOrCreationDayOfTheWeekSelector from './DayOfTheWeekSelector';
import { StyleSheet } from 'react-native';
import SpacerView from '../../../../../helpers/Spacers/SpacerView';
import moment from 'moment';
import MenuEditOrCreationIsEnabledView from './IsEnabledView';
import MenuEditOrCreationProductCategoriesEditor from './ProductCategoriesEditor/ProductCategoriesEditor';
import Spacer from '../../../../../helpers/Spacers/Spacer';
import { GenericEditingFormScreenConstants } from '../../../../../helpers/Views/GenericEditingFormScreen';
import { displayErrorMessage } from '../../../../../helpers/Alerts';


const MenuEditOrCreationScreen = (() => {

    const timeStringTextFieldMomentFormat = 'h:mm a';
    const timeStringApiFormat = 'HH:mm:ss'

    function parseTextFieldTimeString(timeString: string) {
        return moment.tz(timeString, timeStringTextFieldMomentFormat, NASSAU_TIME_ZONE);
    }

    function textFieldTextFromAPITimeString(timeString: string) {
        return moment.tz(timeString, timeStringApiFormat, NASSAU_TIME_ZONE).format(timeStringTextFieldMomentFormat);
    }

    function apiTimeStringTextFromTextFieldText(textFieldText: string) {
        return parseTextFieldTimeString(textFieldText).format(timeStringApiFormat);
    }

    const timeStringRegex = /^\d{1,2}:\d{2} (am|pm)$/;

    const timeYupSchema = yup.string()
        .trim()
        .lowercase()
        .matches(timeStringRegex, `This time text is formatted incorrectly. e.g. '3:30 pm'`)
        .test('isValidTimeString', `This is not a valid time.`, value => {
            if (typeof value !== 'string') { return true; }
            return parseTextFieldTimeString(value).isValid();
        });



    async function validate(values: MenuEditOrCreationValues): Promise<Partial<Record<keyof MenuEditOrCreationValues, string>>> {
        const errors: Partial<Record<keyof MenuEditOrCreationValues, string>> = {};

        {
            const trimmedStartTime = values.startTime.trim();
            const trimmedEndTime = values.endTime.trim();

            const parsedStartTime = parseTextFieldTimeString(trimmedStartTime);
            const parsedEndTime = parseTextFieldTimeString(trimmedEndTime);

            if (
                [trimmedStartTime, trimmedEndTime].some(x => x.length === 0) === false,
                await timeYupSchema.isValid(trimmedStartTime) &&
                await timeYupSchema.isValid(trimmedEndTime) &&
                parsedEndTime.isSameOrBefore(parsedStartTime)
            ) {
                errors.endTime = 'End time must be later than start time.'
            }
        }

        {
            const productCategoriesError: string | undefined = (() => {
                let titles = Set<string>();
                const iterator = values.productCategories.values();
                let currentNext = iterator.next();
                while (currentNext.done !== true) {
                    try {
                        menuEditOrCreateProductCategorySchema.validateSync(currentNext.value);
                    } catch (error) {
                        return error.message;
                    }
                    titles = titles.add(currentNext.value.title);
                    currentNext = iterator.next();
                }
                return (titles.size < values.productCategories.size) ? 'Two or more of the product categories have duplicate titles.' : undefined;
            })();
            (productCategoriesError != undefined) && (errors.productCategories = productCategoriesError);
        }

        return errors;
    }


    function submit(values: MenuEditOrCreationValues, menuId: Optional<number>) {

        const timeString = (str: string) => {
            str = str.trim();
            if (str.length <= 0) return null;
            return apiTimeStringTextFromTextFieldText(str);
        }

        const menuRequestObj: MenuRequestObj = {
            title: values.title,
            is_active: values.isActive,
            days_of_the_week: values.daysOfTheWeek.toArray(),
            start_time: timeString(values.startTime),
            end_time: timeString(values.endTime),
            categories: (() => {
                const categories: MenuRequestObj['categories'] = {};
                values.productCategories.forEach(value => {
                    categories[value.title] = { product_ids: value.productIds.toArray() }
                });
                return categories;
            })(),
        };
        return menuId == null ? createNewMenu(menuRequestObj) : updateMenu(menuId, menuRequestObj);
    }


    const MenuEditOrCreationScreen = (props: StackScreenProps<SettingsNavStackParams, 'MenuEditOrCreate'>) => {

        const [isDeleteLoading, setIsDeleteLoading] = useState(false);

        const menuId = props.route.params.menuId;

        const menu = useSelector(state => {
            return mapOptional(menuId, id => {
                return state.orderingSystem.menus.get(id);
            }) ?? null;
        });

        const navBarTitle = menuId == null ? 'Create New Menu' : 'Update Menu';



        const initialValues: MenuEditOrCreationValues = useMemo(() => {

            const reduxProductsState = store.getState().orderingSystem.products;
            
            return {
                title: menu?.title ?? '',
                isActive: menu?.isActive ?? true,
                daysOfTheWeek: menu?.daysOfTheWeek ?? Set(),
                startTime: mapOptional(menu?.startTime, x => textFieldTextFromAPITimeString(x)) ?? '',
                endTime: mapOptional(menu?.endTime, x => textFieldTextFromAPITimeString(x)) ?? '',
                productCategories: mapOptional(menu?.categories.toArray(), x => Map(x.map((category, index) => {
                    const tuple: [number, MenuEditOrCreateProductCategory] = [index, { customId: index, title: category.title, productIds: category.productIds.filter(x => reduxProductsState.has(x)) }];
                    return tuple;
                }))) ?? Map(),
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <Formik<MenuEditOrCreationValues>
            initialValues={initialValues}
            validationSchema={yup.object({
                title: yup.string().trim().required(),
                startTime: timeYupSchema,
                endTime: timeYupSchema
            })}
            validate={validate}
            onSubmit={(values, { setSubmitting }) => {
                submit(values, menuId).finally(() => {
                    setSubmitting(false);
                }).then(() => {
                    props.navigation.goBack();
                }).catch(error => {
                    displayErrorMessage(error.message);
                })
            }}
        >{formik => {

            const shouldButtonsBeEnabled = formik.isSubmitting === false && isDeleteLoading === false ;
            
            return <OrderingSystemEditingFormScreen
                navBarTitle={navBarTitle}
                saveButtonProps={{
                    onPress: formik.submitForm,
                    isLoading: formik.isSubmitting,
                    isEnabled: shouldButtonsBeEnabled,
                }}
                shouldShowDeleteButton={typeof menuId === 'number'}
                deleteButtonProps={{
                    text: 'Delete Menu',
                    isLoading: isDeleteLoading,
                    isEnabled: shouldButtonsBeEnabled,
                    onPress: () => {
                        if (typeof menuId !== 'number') { return; }
                        setIsDeleteLoading(true);
                        deleteMenu(menuId).finally(() => {
                            setIsDeleteLoading(false);
                        }).then(() => {
                            props.navigation.goBack();
                        }).catch(error => {
                            displayErrorMessage(error.message);
                        });
                    },
                }}
            >
                <FormChildren />
            </OrderingSystemEditingFormScreen>
        }}</Formik>
    }
    return MenuEditOrCreationScreen;
})();

export default MenuEditOrCreationScreen;




const FormChildren = (() => {

    const styles = StyleSheet.create({
        startAndEndTimeContainer: {
            flexDirection: 'row',
            flex: 1,
        },
        startOrEndItemField: {
            flex: 1,
        }
    });

    const startAndEndTimePlaceholder = 'e.g. 3:30 pm';

    const FormChildren = () => {
        return <Spacer space={GenericEditingFormScreenConstants.childrenSpacing}>
            <FormikTextFieldView<MenuEditOrCreationValues> formikFieldName="title" topTitleText="Title" textInputProps={DefaultKeyboardConfigs.title} />
            <MenuEditOrCreationIsEnabledView />
            <MenuEditOrCreationDayOfTheWeekSelector />
            <SpacerView style={styles.startAndEndTimeContainer} space={10}>
                <FormikTextFieldView<MenuEditOrCreationValues>
                    style={styles.startOrEndItemField}
                    formikFieldName="startTime"
                    topTitleText="Start Time"
                    placeholder={startAndEndTimePlaceholder}
                    textInputProps={{ keyboardType: 'numbers-and-punctuation' }}
                />
                <FormikTextFieldView<MenuEditOrCreationValues>
                    style={styles.startOrEndItemField}
                    formikFieldName="endTime"
                    topTitleText="End Time"
                    placeholder={startAndEndTimePlaceholder}
                    textInputProps={{ keyboardType: 'numbers-and-punctuation' }}
                />
            </SpacerView>
            <MenuEditOrCreationProductCategoriesEditor />
        </Spacer>
    }
    return React.memo(FormChildren);
})();

