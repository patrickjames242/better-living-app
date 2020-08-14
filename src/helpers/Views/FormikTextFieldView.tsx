import React from 'react';

import { TextFieldViewProps, MultilineTextFieldView, TextFieldView } from "./TextFieldView";
import { useField } from "../formik";
import { FormikValues } from "formik";

type FormikTextFieldViewProps<Key> = TextFieldViewProps & { formikFieldName: Key };

function _FormikTextFieldView(Component: React.FC<TextFieldViewProps>) {
    return function _FormikTextFieldView<Values extends FormikValues>(props: FormikTextFieldViewProps<keyof Values & string>) {
        const [, { value, error, touched }, { setValue, setTouched }] = useField<Values, string>(props.formikFieldName);
        return <Component
            {...props}
            value={value}
            onChangeText={setValue as any}
            errorMessage={(touched && error) ? error : undefined}
            textInputProps={{ ...props.textInputProps, onBlur: () => setTouched(true) }}
        />
    }
}

export const FormikTextFieldView = _FormikTextFieldView(TextFieldView);

export const FormikMultilineTextFieldView = _FormikTextFieldView(MultilineTextFieldView);




