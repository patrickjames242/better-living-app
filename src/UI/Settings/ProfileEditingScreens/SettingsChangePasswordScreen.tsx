import React, { useMemo } from 'react';
import GenericEditingFormScreen from '../../../helpers/Views/GenericEditingFormScreen';
import { DefaultLongButtonsProps } from '../../../helpers/Buttons/LongTextAndIconButton';
import { Formik } from '../../../helpers/formik';
import { StackScreenProps } from '@react-navigation/stack';
import { FormikTextFieldView } from '../../../helpers/Views/FormikTextFieldView';
import * as yup from 'yup';
import { changePassword } from '../../../api/authentication/userRequests';
import { useSelector } from '../../../redux/store';
import { SettingsNavStackParams } from '../navigationHelpers';
import { displayErrorMessage } from '../../../helpers/Alerts';
import { DefaultKeyboardConfigs, YUP_PASSWORD_VALIDATOR } from '../../../helpers/general';



interface ChangePasswordValues {
    newPassword: string;
}

const SettingsChangePasswordScreen = (props: StackScreenProps<SettingsNavStackParams, 'ChangePassword'>) => {

    const userObject = useSelector(state => state.authentication?.userObject);
    
    const initialValues: ChangePasswordValues = useMemo(() => ({
        newPassword: '',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    return <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
            newPassword: YUP_PASSWORD_VALIDATOR('new password'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            if (userObject == null){return;}
            changePassword({
                current_password: props.route.params.currentPassword,
                new_password: values.newPassword,
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
            navBarTitle="Change Password"
            longButtons={[{
                ...DefaultLongButtonsProps.saveChanges,
                isLoading: formik.isSubmitting,
                onPress: formik.submitForm,
            }]}
        >
            <FormikTextFieldView<ChangePasswordValues> topTitleText="New Password" formikFieldName="newPassword" textInputProps={DefaultKeyboardConfigs.password}/>
        </GenericEditingFormScreen>
    }}</Formik>


}

export default SettingsChangePasswordScreen;

