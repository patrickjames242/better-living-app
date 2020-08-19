
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextFieldViewContainer } from '../../../../../helpers/Views/TextFieldView';
import { useField } from '../../../../../helpers/formik';
import { MealCategoryEditOrCreateValues } from './helpers';
import { Color } from '../../../../../helpers/colors';
import { useSelector } from '../../../../../redux/store';
import { compactMap, caseInsensitiveStringSort } from '../../../../../helpers/general';
import CustomizedText from '../../../../../helpers/Views/CustomizedText';
import { Set } from 'immutable';
import Spacer from '../../../../../helpers/Spacers/Spacer';
import RoundedTextAndIconBouncyButton from '../../../../../helpers/Buttons/RoundedTextAndIconBouncyButton';
import AssetImages from '../../../../../images/AssetImages';
import { useNavigation } from '@react-navigation/native';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import { StackNavigationProp } from '@react-navigation/stack';


const MealCategoryEditOrCreationProductsSelector = (() => {


    const styles = StyleSheet.create({

    });

    const MealCategoryEditOrCreationProductsSelector = () => {

        const [, { value }, { setValue }] = useField<MealCategoryEditOrCreateValues, 'productIds'>('productIds');

        const navigation = useNavigation<StackNavigationProp<SettingsNavStackParams, 'MealCategoryEditOrCreate'>>();

        const productsNotEmpty = value.size >= 1

        return <TextFieldViewContainer topTitleText="Products">
            <Spacer space={13}>
                {productsNotEmpty && <ProductsView productIds={value} /> }
                <RoundedTextAndIconBouncyButton text={productsNotEmpty ? 'Edit Products' : 'Add Products'} onPress={() => {
                    navigation.push('ProductsPicker', {
                        currentSelectedProductIds: value, 
                        onFinishedSelectingProducts: setValue,
                    });
                }} iconSource={productsNotEmpty ? AssetImages.editIcon : AssetImages.plusIcon} />
            </Spacer>
        </TextFieldViewContainer>
    }
    return MealCategoryEditOrCreationProductsSelector;
})();

export default MealCategoryEditOrCreationProductsSelector;



interface ProductsViewProps {
    productIds: Set<number>;
}

const ProductsView = (() => {

    const productLabelsSpacing = 10;

    const styles = StyleSheet.create({

        root: {
            borderRadius: 15,
            marginRight: -productLabelsSpacing,
            marginBottom: -productLabelsSpacing,
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        productLabelHolder: {
            backgroundColor: Color.gray(0.94).stringValue,
            marginBottom: productLabelsSpacing,
            marginRight: productLabelsSpacing,
            borderRadius: 8,
            padding: 6,
            paddingLeft: 8,
            paddingRight: 8,
        },
        productLabel: {
            fontSize: 14,
            maxWidth: 200,
        },
    });

    const ProductsView = (props: ProductsViewProps) => {

        const allProductsReduxState = useSelector(state => state.orderingSystem.products);

        const sortedProductsValue = useMemo(() => {
            return compactMap(props.productIds.toArray(), x => allProductsReduxState.get(x))
            .sort(caseInsensitiveStringSort(x => x.title));
        }, [allProductsReduxState, props.productIds]);

        return <View style={styles.root}>
            {sortedProductsValue.map(x => {
                return <View key={x.id} style={styles.productLabelHolder}>
                    <CustomizedText style={styles.productLabel} numberOfLines={1}>
                        {x.title}
                    </CustomizedText>
                </View>
            })}
        </View>

    }
    return ProductsView;
})();


