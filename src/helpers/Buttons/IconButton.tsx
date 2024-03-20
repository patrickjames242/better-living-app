import React from 'react';
import { CustomColors } from '../colors';
import BouncyButton from './BouncyButton';
import { StyleSheet, Image, ViewProps } from 'react-native';

export interface IconButtonProps extends ViewProps {
  onPress?: () => void;
  iconSource: any;
  iconSize?: number;
}

const IconButton = (() => {
  const styles = StyleSheet.create({
    root: {},
    buttonContentView: {},
    iconImage: {
      // tintColor: CustomColors.themeGreen.stringValue
    },
  });

  const hitSlopVal = 20;
  const hitSlop = {
    left: hitSlopVal,
    right: hitSlopVal,
    top: hitSlopVal,
    bottom: hitSlopVal,
  };

  const IconButton = ({
    iconSource,
    iconSize: propsIconSize,
    onPress,
    ...viewProps
  }: IconButtonProps) => {
    const iconSize = propsIconSize ?? 20;

    return (
      <BouncyButton
        {...viewProps}
        contentViewProps={{ style: styles.buttonContentView }}
        style={[styles.root, viewProps?.style]}
        hitSlop={hitSlop}
        onPress={onPress}
      >
        <Image
          resizeMode="contain"
          style={[
            styles.iconImage,
            {
              height: iconSize,
              width: iconSize,
            },
          ]}
          source={iconSource}
        />
      </BouncyButton>
    );
  };
  return IconButton;
})();

export default IconButton;
