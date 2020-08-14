
import React from 'react';
import { StyleSheet, Switch, Platform } from 'react-native';
import { TextFieldViewContainer, TextFieldTextInput } from '../../../../helpers/Views/TextFieldView';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import { CustomColors } from '../../../../helpers/colors';
import { useField } from '../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';

export interface ProductEditOrCreationIndividualPriceSelectorProps {

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

        const [,{value: priceStringValue}, {setValue: setPriceStringValue}] = useField<ProductEditOrCreateValues, 'priceString'>('priceString');
        const [,{value: shouldBeSoldIndividuallyValue}, {setValue: setShouldBeSoldIndividuallyValue}] = useField<ProductEditOrCreateValues, 'shouldBeSoldIndividually'>('shouldBeSoldIndividually');

        return <TextFieldViewContainer topTitleText="Individual Price">
            <SpacerView space={10} style={styles.contentHolder}>
                <TextFieldTextInput
                    value={priceStringValue}
                    onValueChange={setPriceStringValue}
                    textInputProps={{
                        editable: shouldBeSoldIndividuallyValue,
                        pointerEvents: shouldBeSoldIndividuallyValue ? undefined : 'none',
                        placeholder: 'e.g. 11.95',
                        style: [styles.textField, {opacity: shouldBeSoldIndividuallyValue ? 1 : 0.4}],
                    }}
                />
                <Switch
                    value={shouldBeSoldIndividuallyValue}
                    {...(Platform.select({
                        web: {onTintColor: CustomColors.themeGreen.stringValue}, 
                        default: {trackColor: {true: CustomColors.themeGreen.stringValue, false: 'gray'}},
                    }))}
                    onValueChange={isOn => setShouldBeSoldIndividuallyValue(isOn)}
                />
            </SpacerView>
        </TextFieldViewContainer>
    }
    return ProductEditOrCreationIndividualPriceSelector;
})();

export default ProductEditOrCreationIndividualPriceSelector;
