import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { CustomColors } from '../../../helpers/colors';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import AssetImages from '../../../images/AssetImages';

export enum CreateOrEditTipEditButton_EditButtonType {
  add,
  delete,
}

export interface CreateOrEditTipEditButtonProps {
  buttonType: CreateOrEditTipEditButton_EditButtonType;
  onPress: () => void;
  isEnabled?: boolean;
}

const CreateOrEditTipEditButton = (() => {
  const styles = StyleSheet.create({
    root: {},
    buttonContentView: {
      width: 40,
      height: 40,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteImage: {
      height: '50%',
      width: '50%',
      // tintColor: 'white'
    },
  });

  const CreateOrEditTipEditButton = (props: CreateOrEditTipEditButtonProps) => {
    const backgroundColor = (() => {
      switch (props.buttonType) {
        case CreateOrEditTipEditButton_EditButtonType.delete:
          return CustomColors.redColor;
        default:
          return CustomColors.themeGreen;
      }
    })().stringValue;

    const isEnabled = props.isEnabled ?? true;

    return (
      <BouncyButton
        style={styles.root}
        contentViewProps={{
          style: [
            styles.buttonContentView,
            { backgroundColor, opacity: isEnabled ? 1 : 0.5 },
          ],
        }}
        onPress={props.onPress}
        pointerEvents={isEnabled ? undefined : 'none'}
      >
        <Image
          resizeMode="contain"
          source={(() => {
            switch (props.buttonType) {
              case CreateOrEditTipEditButton_EditButtonType.add:
                return AssetImages.plusIcon.white;
              case CreateOrEditTipEditButton_EditButtonType.delete:
                return AssetImages.deleteIcon;
            }
          })()}
          style={styles.deleteImage}
        />
      </BouncyButton>
    );
  };
  return CreateOrEditTipEditButton;
})();

export default CreateOrEditTipEditButton;
