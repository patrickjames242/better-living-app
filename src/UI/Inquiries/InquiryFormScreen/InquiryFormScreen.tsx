
import React, { useMemo } from 'react';
import { DefaultLongButtonsProps } from '../../../helpers/Buttons/LongTextAndIconButton';
import { Formik } from '../../../helpers/formik';
import { mapOptional } from '../../../helpers/general';
import { FormikMultilineTextFieldView, FormikTextFieldView } from '../../../helpers/Views/FormikTextFieldView';
import GenericEditingFormScreen from '../../../helpers/Views/GenericEditingFormScreen';
import store from '../../../redux/store';
import * as Yup from 'yup';



const InquiryFormScreen = (() => {

    interface Values {
        email: string;
        name: string;
        subject: string;
        description: string;
    }

    const fieldIsRequired = (fieldName: string) => fieldName + ' is a required field.';

    const InquiryFormScreen = () => {

        const initialValues: Values = useMemo(() => {
            const currentUser = store.getState().authentication?.userObject;
            return {
                email: currentUser?.email ?? '',
                name: mapOptional(currentUser, x => x.firstName + " " + x.lastName) ?? '',
                subject: '',
                description: '',
            }
        }, []);

        return <Formik<Values>
            initialValues={initialValues}
            validationSchema={Yup.object({
                email: Yup.string().trim().required(fieldIsRequired('Contact Email')),
                name: Yup.string().trim().required(fieldIsRequired('Full Name')),
                subject: Yup.string().trim().required(fieldIsRequired('Subject')),
                description: Yup.string().trim().required(fieldIsRequired('Description')),
            })}
            onSubmit={(values, { setSubmitting }) => {

            }}
        >{formik => {
            return <GenericEditingFormScreen
                navBarTitle="Ask a Question"
                longButtons={[
                    {
                        ...DefaultLongButtonsProps.saveChanges,
                    }
                ]}
            >
                <FormikTextFieldView<Values> formikFieldName="email" topTitleText="Contact Email" />
                <FormikTextFieldView<Values> formikFieldName="name" topTitleText="Full Name" />
                <FormikTextFieldView<Values> formikFieldName="subject" topTitleText="Subject" />
                <FormikMultilineTextFieldView<Values> formikFieldName="description" topTitleText="Description" />
            </GenericEditingFormScreen>
        }}</Formik>
    }

    return InquiryFormScreen;
})();

export default InquiryFormScreen;
