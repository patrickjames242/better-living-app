
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { MenuEditOrCreateProductCategory } from '../helpers';
import CustomizedText from '../../../../../../helpers/Views/CustomizedText';
import BouncySquareIconButton from '../../../../../../helpers/Buttons/BouncySquareIconButton';
import AssetImages from '../../../../../../images/AssetImages';
import { TextFieldView, TextFieldViewContainer } from '../../../../../../helpers/Views/TextFieldView';
import SpacerView from '../../../../../../helpers/Spacers/SpacerView';
import OrderingSystemFormChildrenProductsSelector from '../../OrderingSystemFormChildrenProductsSelector';
import LayoutConstants from '../../../../../../LayoutConstants';
import { Color, CustomColors } from '../../../../../../helpers/colors';
import { DefaultKeyboardConfigs, Optional } from '../../../../../../helpers/general';


export interface MenuEditOrCreationProductCategoryItemViewProps {
    category: MenuEditOrCreateProductCategory;
    onCategoryChanged: (category: MenuEditOrCreateProductCategory) => void;
    onCategoryDeleted: (id: number) => void;
    errorMessage: Optional<string>;
}

const MenuEditOrCreationProductCategoryItemView = (() => {

    const styles = StyleSheet.create({

        mainContainer: {
            borderRadius: LayoutConstants.forms.innerContainer.borderRadius,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
        },
        sideButtonsHolder: {

        },
        minimizedTitleText: {
            fontSize: 15,
            flex: 1,
        },
        errorMessageText: {

        },
    });

    const totalSideButtonSize = 35;

    const MenuEditOrCreationProductCategoryItemView = ({ category, onCategoryChanged, onCategoryDeleted, errorMessage }: MenuEditOrCreationProductCategoryItemViewProps) => {

        const [isExpanded, setIsExpanded] = useState(false);

        return <TextFieldViewContainer errorMessage={(isExpanded === false && errorMessage) ? errorMessage : undefined}>
            <SpacerView style={[styles.mainContainer, {
                backgroundColor: LayoutConstants.forms.innerContainer.backgroundColor,
            }]} space={12}>
                {isExpanded ?
                    <ExpandedView category={category} onCategoryChanged={onCategoryChanged} errorMessage={errorMessage}/> :
                    <CustomizedText style={styles.minimizedTitleText}>{category.title}</CustomizedText>}
                <SpacerView style={[styles.sideButtonsHolder, {
                    alignSelf: isExpanded ? 'flex-start' : 'center',
                }]} space={10}>
                    <BouncySquareIconButton
                        iconSource={isExpanded ? AssetImages.minimizeIcon : AssetImages.zoomInIcon}
                        iconSize={19}
                        iconPadding={(totalSideButtonSize - 19) / 2}
                        onPress={() => setIsExpanded(v => !v)}
                    />
                    {isExpanded && <BouncySquareIconButton
                        iconSize={18}
                        iconPadding={(totalSideButtonSize - 18) / 2}
                        iconSource={AssetImages.deleteIcon}
                        backgroundColor={CustomColors.redColor.stringValue}
                        onPress={() => onCategoryDeleted(category.customId)}
                    />}
                </SpacerView>
            </SpacerView>
        </TextFieldViewContainer>


    }
    return MenuEditOrCreationProductCategoryItemView;
})();

export default MenuEditOrCreationProductCategoryItemView;



interface ExpandedViewProps {
    category: MenuEditOrCreateProductCategory;
    onCategoryChanged: (category: MenuEditOrCreateProductCategory) => void;
    errorMessage: Optional<string>;
}

const ExpandedView = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
    });

    const ExpandedView = (props: ExpandedViewProps) => {

        return <SpacerView style={styles.root} space={15}>
            <TextFieldView
                topTitleText="Edit Title"
                value={props.category.title}
                onChangeText={title => {
                    props.onCategoryChanged({
                        ...props.category,
                        title,
                    });
                }}
                textInputProps={{
                    inactiveBorderColor: Color.gray(0.91).stringValue,
                    ...DefaultKeyboardConfigs.title,
                }}
                errorMessage={props.errorMessage ?? undefined}
            />
            <OrderingSystemFormChildrenProductsSelector
                itemBackgroundColor={Color.gray(0.91).stringValue}
                value={props.category.productIds}
                onValueChanged={value => {
                    props.onCategoryChanged({
                        ...props.category,
                        productIds: value,
                    });
                }}
            />
        </SpacerView>
    }
    return React.memo(ExpandedView);
})();

