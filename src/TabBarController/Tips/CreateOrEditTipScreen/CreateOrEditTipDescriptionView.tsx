import React from 'react';
import CreateOrEditTipConstants from './CreateOrEditTipConstants';
import TextFieldView from '../../../helpers/Views/TextFieldView';
import { Platform } from 'react-native';



interface CreateOrEditTipDescriptionViewProps {
    value: string;
    onValueChange: (value: string) => void;
}

const CreateOrEditTipDescriptionView = (() => {

    const CreateOrEditTipDescriptionView = (props: CreateOrEditTipDescriptionViewProps) => {

        return <TextFieldView
            {...props}
            topTitleText="Description"
            textInputProps={{
                returnKeyType: Platform.select({web: 'enter', default: 'default'}) as any,
                scrollEnabled: false,
                placeholder: CreateOrEditTipConstants.textFieldPlaceholder,
                multiline: true,
                style: {
                    minHeight: 175,
                }
            }}
        />
    }
    return CreateOrEditTipDescriptionView;
})();

export default CreateOrEditTipDescriptionView;