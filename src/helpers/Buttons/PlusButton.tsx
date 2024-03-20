import React from 'react';
import AssetImages from '../../images/AssetImages';
import IconButton from './IconButton';
import { StyleSheet } from 'react-native';

export interface PlusButtonProps {
  onPress?: () => void;
}

const styles = StyleSheet.create({
  icon: {
    paddingLeft: 6,
    paddingRight: 6,
  },
});

const NavigationBarPlusButton = (props: PlusButtonProps) => {
  return (
    <IconButton
      iconSource={AssetImages.plusIcon.green}
      iconSize={20}
      style={styles.icon}
      {...props}
    />
  );
};

export default NavigationBarPlusButton;
