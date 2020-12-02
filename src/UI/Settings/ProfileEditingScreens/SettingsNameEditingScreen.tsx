import React, { useMemo } from 'react';
import GenericEditingFormScreen from '../../../helpers/Views/GenericEditingFormScreen';
import { DefaultLongButtonsProps } from '../../../helpers/Buttons/LongTextAndIconButton';
import { Formik } from '../../../helpers/formik';
import { StackScreenProps } from '@react-navigation/stack';
import { FormikTextFieldView } from '../../../helpers/Views/FormikTextFieldView';
import * as yup from 'yup';
import { updateUserInfo } from '../../../api/authentication/userRequests';
import { useSelector } from '../../../redux/store';
import { SettingsNavStackParams } from '../navigationHelpers';
import { displayErrorMessage } from '../../../helpers/Alerts';
import { DefaultKeyboardConfigs } from '../../../helpers/general';



interface NameEditingValues {
    firstName: string;
    lastName: string;
}

const SettingsNameEditingScreen = (props: StackScreenProps<SettingsNavStackParams, 'NameEditing'>) => {

    const userObject = useSelector(state => state.authentication?.userObject);
    
    const initialValues: NameEditingValues = useMemo(() => ({
        firstName: userObject?.firstName ?? '',
        lastName: userObject?.lastName ?? '',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    return <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
            firstName: yup.string().trim().required('First name is a required field.'),
            lastName: yup.string().trim().required('Last name is a required field.'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            if (userObject == null){return;}
            updateUserInfo(userObject.id, {
                first_name: values.firstName.trim(), 
                last_name: values.lastName.trim(),
            }).finally(() => {
                setSubmitting(false);
            }).then(() => {
                props.navigation.goBack();
            }).catch(error => {
                displayErrorMessage(error.message);
            });
        }}
    >{formik => {
        return <GenericEditingFormScreen
            navBarTitle="Edit Name"
            longButtons={[{
                ...DefaultLongButtonsProps.saveChanges,
                isLoading: formik.isSubmitting,
                onPress: formik.submitForm,
                isEnabled: formik.isValid && formik.dirty && (
                    formik.initialValues.firstName.trim() !== formik.values.firstName.trim() || 
                    formik.initialValues.lastName.trim() !== formik.values.lastName.trim()
                )
            }]}
        >
            <FormikTextFieldView<NameEditingValues> topTitleText="First Name" formikFieldName="firstName" textInputProps={DefaultKeyboardConfigs.name}/>
            <FormikTextFieldView<NameEditingValues> topTitleText="Last Name" formikFieldName="lastName" textInputProps={DefaultKeyboardConfigs.name}/>
        </GenericEditingFormScreen>
    }}</Formik>


}

export default SettingsNameEditingScreen;


