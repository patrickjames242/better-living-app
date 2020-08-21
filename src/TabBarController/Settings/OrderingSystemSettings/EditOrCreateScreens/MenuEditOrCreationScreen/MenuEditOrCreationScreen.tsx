
import React, { useState, useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import { useSelector } from '../../../../../redux/store';
import { mapOptional, displayErrorMessage, NASSAU_TIME_ZONE } from '../../../../../helpers/general';
import { MenuEditOrCreationValues } from './helpers';
import { Set, List } from 'immutable';
import { Formik } from '../../../../../helpers/formik';
import * as yup from 'yup';
import OrderingSystemEditingFormScreen from '../OrderingSystemEditingFormScreen';
import { deleteMenu } from '../../../../../api/orderingSystem/menus/requests';
import { FormikTextFieldView } from '../../../../../helpers/Views/FormikTextFieldView';
import MenuEditOrCreationDayOfTheWeekSelector from './MenuEditOrCreationDayOfTheWeekSelector';
import { StyleSheet } from 'react-native';
import SpacerView from '../../../../../helpers/Spacers/SpacerView';
import moment from 'moment';


const MenuEditOrCreationScreen = (() => {

    const styles = StyleSheet.create({
        startAndEndTimeContainer: {
            flexDirection: 'row',
            flex: 1,
        },
        startOrEndItemField: {
            flex: 1,
        }
    });


    const timeStringTextFieldMomentFormat = 'h:mm a';
    const timeStringApiFormat = 'hh:mm:ss'

    function parseTextFieldTimeString(timeString: string) {
        return moment.tz(timeString, timeStringTextFieldMomentFormat, NASSAU_TIME_ZONE);
    }

    function textFieldTextFromAPITimeString(timeString: string) {
        return moment.tz(timeString, timeStringApiFormat, NASSAU_TIME_ZONE).format(timeStringTextFieldMomentFormat);
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


    const MenuEditOrCreationScreen = (props: StackScreenProps<SettingsNavStackParams, 'MenuEditOrCreate'>) => {

        const [isDeleteLoading, setIsDeleteLoading] = useState(false);

        const menuId = props.route.params.menuId;

        const menu = useSelector(state => {
            return mapOptional(menuId, id => {
                return state.orderingSystem.menus.get(id);
            });
        });

        const navBarTitle = menuId == null ? 'Create New Menu' : 'Update Menu';

        const initialValues: MenuEditOrCreationValues = useMemo(() => ({
            title: menu?.title ?? '',
            isActive: menu?.isActive ?? true,
            daysOfTheWeek: menu?.daysOfTheWeek ?? Set(),
            startTime: mapOptional(menu?.startTime, x => textFieldTextFromAPITimeString(x)) ?? '',
            endTime: mapOptional(menu?.endTime, x => textFieldTextFromAPITimeString(x)) ?? '',
            productCategories: menu?.categories ?? List(),
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }), []);



        return <Formik<MenuEditOrCreationValues>
            initialValues={initialValues}
            validationSchema={yup.object({
                title: yup.string().trim().required(),
                startTime: timeYupSchema,
                endTime: timeYupSchema
            })}
            validate={async values => {
                const errors: Partial<Record<keyof MenuEditOrCreationValues, string>> = {};

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
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {

            }}
        >{formik => {

            const shouldButtonsBeEnabled = formik.isSubmitting === false && isDeleteLoading === false;

            const startAndEndTimePlaceholder = 'e.g. 3:30 pm';

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
                <FormikTextFieldView<MenuEditOrCreationValues> formikFieldName="title" topTitleText="Title" />
                <MenuEditOrCreationDayOfTheWeekSelector />
                <SpacerView style={styles.startAndEndTimeContainer} space={10}>
                    <FormikTextFieldView<MenuEditOrCreationValues>
                        style={styles.startOrEndItemField}
                        formikFieldName="startTime"
                        topTitleText="Start Time"
                        placeholder={startAndEndTimePlaceholder}
                    />
                    <FormikTextFieldView<MenuEditOrCreationValues>
                        style={styles.startOrEndItemField}
                        formikFieldName="endTime"
                        topTitleText="End Time"
                        placeholder={startAndEndTimePlaceholder}
                    />
                </SpacerView>
            </OrderingSystemEditingFormScreen>
        }}</Formik>
    }
    return MenuEditOrCreationScreen;
})();

export default MenuEditOrCreationScreen;
