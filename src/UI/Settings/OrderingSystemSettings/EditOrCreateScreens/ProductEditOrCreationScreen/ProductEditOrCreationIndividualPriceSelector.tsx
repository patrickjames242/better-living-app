
import React from 'react';
import { StyleSheet } from 'react-native';
import { TextFieldViewContainer, TextFieldTextInput } from '../../../../../helpers/Views/TextFieldView';
import SpacerView from '../../../../../helpers/Spacers/SpacerView';
import { useField } from '../../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';
import { CustomSwitch } from '../../../../../helpers/Views/CustomSwitch';
import { DefaultKeyboardConfigs } from '../../../../../helpers/general';

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

        const [,{value: priceStringValue, error: priceStringError, touched: priceStringTouched}, {setValue: setPriceStringValue, setTouched: setPriceStringTouched}] = useField<ProductEditOrCreateValues, 'priceString'>('priceString');
        const [,{value: shouldBeSoldIndividuallyValue}, {setValue: setShouldBeSoldIndividuallyValue}] = useField<ProductEditOrCreateValues, 'shouldBeSoldIndividually'>('shouldBeSoldIndividually');

        return <TextFieldViewContainer topTitleText="Individual Price" errorMessage={(priceStringError && priceStringTouched) ? priceStringError : undefined}>
            <SpacerView space={10} style={styles.contentHolder}>
                <TextFieldTextInput
                    value={priceStringValue}
                    onChangeText={setPriceStringValue}
                    editable={shouldBeSoldIndividuallyValue}
                    pointerEvents={shouldBeSoldIndividuallyValue ? undefined : 'none'}
                    placeholder="e.g. 11.95"
                    style={[styles.textField, {opacity: shouldBeSoldIndividuallyValue ? 1 : 0.4}]}
                    onBlur={() => setPriceStringTouched(true)}
                    {...DefaultKeyboardConfigs.price}
                />
                <CustomSwitch
                    value={shouldBeSoldIndividuallyValue}
                    onValueChange={isOn => setShouldBeSoldIndividuallyValue(isOn)}
                />
            </SpacerView>
        </TextFieldViewContainer>
    }
    return ProductEditOrCreationIndividualPriceSelector;
})();

export default ProductEditOrCreationIndividualPriceSelector;
