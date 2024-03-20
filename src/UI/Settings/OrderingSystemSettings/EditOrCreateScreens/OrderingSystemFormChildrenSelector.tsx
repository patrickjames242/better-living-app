import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Color } from '../../../../helpers/colors';
import CustomizedText from '../../../../helpers/Views/CustomizedText';
import { TextFieldViewContainer } from '../../../../helpers/Views/TextFieldView';
import Spacer from '../../../../helpers/Spacers/Spacer';
import RoundedTextAndIconBouncyButton from '../../../../helpers/Buttons/RoundedTextAndIconBouncyButton';
import AssetImages from '../../../../images/AssetImages';

interface OrderingSystemItem {
  title: string;
  id: number;
}

export interface OrderingSystemFormChildrenSelectorProps {
  itemBackgroundColor?: string;
  containerTitleText: string;
  buttonEditText: string;
  buttonAddText: string;
  value: OrderingSystemItem[];
  onEditOrAddButtonPressed: () => void;
}

const OrderingSystemFormChildrenSelector = (() => {
  const OrderingSystemFormChildrenSelector = (
    props: OrderingSystemFormChildrenSelectorProps,
  ) => {
    const itemsNotEmpty = props.value.length >= 1;

    return (
      <TextFieldViewContainer topTitleText={props.containerTitleText}>
        <Spacer space={13}>
          {itemsNotEmpty && (
            <ChildItemsView
              childItems={props.value}
              itemBackgroundColor={props.itemBackgroundColor}
            />
          )}
          <RoundedTextAndIconBouncyButton
            text={itemsNotEmpty ? props.buttonEditText : props.buttonAddText}
            onPress={props.onEditOrAddButtonPressed}
            iconSource={
              itemsNotEmpty ? AssetImages.editIcon : AssetImages.plusIcon.white
            }
          />
        </Spacer>
      </TextFieldViewContainer>
    );
  };
  return OrderingSystemFormChildrenSelector;
})();

export default OrderingSystemFormChildrenSelector;

interface ChildItemsViewProps {
  childItems: { title: string; id: number }[];
  itemBackgroundColor?: string;
}

const ChildItemsView = (() => {
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

  const ChildItemsView = (props: ChildItemsViewProps) => {
    return (
      <View style={styles.root}>
        {props.childItems.map(x => {
          return (
            <View
              key={x.id}
              style={[
                styles.productLabelHolder,
                {
                  backgroundColor:
                    props.itemBackgroundColor ?? Color.gray(0.94).stringValue,
                },
              ]}
            >
              <CustomizedText style={styles.productLabel} numberOfLines={1}>
                {x.title}
              </CustomizedText>
            </View>
          );
        })}
      </View>
    );
  };
  return ChildItemsView;
})();
