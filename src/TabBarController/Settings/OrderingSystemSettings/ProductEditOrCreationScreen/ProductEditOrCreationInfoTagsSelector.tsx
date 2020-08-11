
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextFieldViewContainer } from '../../../../helpers/Views/TextFieldView';
import { Color, CustomColors } from '../../../../helpers/colors';
import CustomizedText from '../../../../helpers/Views/CustomizedText';
import { Set } from 'immutable';
import BouncyButton from '../../../../helpers/Buttons/BouncyButton';
import { useSelector } from '../../../../redux/store';
import { CustomFont } from '../../../../helpers/fonts/fonts';

const infoTagViewSpacing = 10;

export interface ProductEditOrCreationInfoTagsSelectorProps {
    selectedInfoTagIds: Set<number>;
    onSelectedIdsChanged: (ids: Set<number>) => void;
}

const ProductEditOrCreationInfoTagsSelector = (() => {


    const styles = StyleSheet.create({
        tagsHolder: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: -infoTagViewSpacing,
            marginRight: -infoTagViewSpacing,
        },
    });

    function useSortedInfoTags() {
        const infoTagsReduxState = useSelector(state => state.orderingSystem.productInfoTags);
        return useMemo(() => {
            return infoTagsReduxState.toSet().sortBy(x => x.title).toArray();
        }, [infoTagsReduxState]);
    }

    const ProductEditOrCreationInfoTagsSelector = (props: ProductEditOrCreationInfoTagsSelectorProps) => {

        const infoTags = useSortedInfoTags();

        return <TextFieldViewContainer topTitleText="Info Tags">
            <View style={styles.tagsHolder}>
                {infoTags.map(tag => {
                    return <InfoTagItemView
                        key={tag.id}
                        title={tag.title}
                        isSelected={props.selectedInfoTagIds.contains(tag.id)}
                        onPress={() => { 
                            if (props.selectedInfoTagIds.contains(tag.id)){
                                props.onSelectedIdsChanged(props.selectedInfoTagIds.remove(tag.id));
                            } else {
                                props.onSelectedIdsChanged(props.selectedInfoTagIds.add(tag.id));
                            }
                        }}
                    />
                })}
            </View>
        </TextFieldViewContainer>
    }
    return ProductEditOrCreationInfoTagsSelector;
})();

export default ProductEditOrCreationInfoTagsSelector;



interface InfoTagItemViewProps {
    onPress: () => void;
    title: string;
    isSelected: boolean;
}

const InfoTagItemView = (() => {

    const styles = StyleSheet.create({
        contentContainer: {
            borderRadius: 10000,
            padding: 10,
            paddingLeft: 14,
            paddingRight: 14,
            marginBottom: infoTagViewSpacing,
            marginRight: infoTagViewSpacing,
        },
        title: {
            fontSize: 14,
            // fontFamily: CustomFont.medium,
        }
    });

    const InfoTagItemView = (props: InfoTagItemViewProps) => {
        return <BouncyButton onPress={props.onPress} contentViewProps={{ style: [styles.contentContainer, {
            backgroundColor: props.isSelected ? CustomColors.themeGreen.stringValue : Color.gray(0.95).stringValue,
        }] }} bounceScaleValue={0.85}>
            <CustomizedText style={[styles.title, {
                color: props.isSelected ?  'white' : CustomColors.offBlackTitle.stringValue,
                fontFamily: props.isSelected ? CustomFont.medium : CustomFont.regular,
            }]}>{props.title}</CustomizedText>
        </BouncyButton>
    }
    return InfoTagItemView;
})();

