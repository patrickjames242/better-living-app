import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import { TextFieldViewConstants } from '../../../helpers/Views/TextFieldView';
import { Color } from '../../../helpers/colors';

export interface CreateOrEditTipAttachmentContainerProps extends ViewProps{
    
}

const CreateOrEditTipAttachmentContainer = (() => {
    
    const styles = StyleSheet.create({
        root: {
            borderRadius: TextFieldViewConstants.borderRadius,
            backgroundColor: Color.gray(0.96).stringValue,
            overflow: 'hidden',
            padding: 8,
        },
    });
    
    const CreateOrEditTipAttachmentContainer = (props: React.PropsWithChildren<CreateOrEditTipAttachmentContainerProps>) => {
        return <View style={[styles.root, props.style]}>
            {props.children}
        </View>
    }
    return CreateOrEditTipAttachmentContainer;
})();

export default CreateOrEditTipAttachmentContainer;
