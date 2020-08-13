
import React from 'react';
import { StyleSheet, Switch, Platform } from 'react-native';
import { TextFieldViewContainer, TextFieldTextInput } from '../../../../helpers/Views/TextFieldView';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import { CustomColors } from '../../../../helpers/colors';

export interface ProductEditOrCreationIndividualPriceSelectorProps {
    priceString: string;
    shouldBeSoldIndividually: boolean;
    onShouldBeSoldIndividuallyDidChange: (newValue: boolean) => void;
    onPriceDidChange: (newValue: string) => void;
}

const ProductEditOrCreationIndividualPriceSelector = (() => {

    const styles = StyleSheet.create({
        contentHolder: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        textField: {
            flex: 1,
        }
    });

    const ProductEditOrCreationIndividualPriceSelector = (props: ProductEditOrCreationIndividualPriceSelectorProps) => {
        return <TextFieldViewContainer topTitleText="Individual Price">
            <SpacerView space={10} style={styles.contentHolder}>
                <TextFieldTextInput
                    value={props.priceString}
                    onValueChange={props.onPriceDidChange}
                    textInputProps={{
                        editable: props.shouldBeSoldIndividually,
                        pointerEvents: props.shouldBeSoldIndividually ? undefined : 'none',
                        placeholder: 'e.g. 11.95',
                        style: [styles.textField, {opacity: props.shouldBeSoldIndividually ? 1 : 0.4}],
                    }}
                />
                <Switch
                    value={props.shouldBeSoldIndividually}
                    {...(Platform.select({
                        web: {onTintColor: CustomColors.themeGreen.stringValue}, 
                        default: {trackColor: {true: CustomColors.themeGreen.stringValue, false: 'gray'}},
                    }))}
                    onValueChange={isOn => props.onShouldBeSoldIndividuallyDidChange(isOn)}
                />
            </SpacerView>
        </TextFieldViewContainer>
    }
    return ProductEditOrCreationIndividualPriceSelector;
})();

export default ProductEditOrCreationIndividualPriceSelector;
