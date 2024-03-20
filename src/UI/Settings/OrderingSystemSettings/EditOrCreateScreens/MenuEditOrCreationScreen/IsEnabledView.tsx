import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextFieldViewContainer } from '../../../../../helpers/Views/TextFieldView';
import CustomizedText from '../../../../../helpers/Views/CustomizedText';
import { useField } from '../../../../../helpers/formik';
import { MenuEditOrCreationValues } from './helpers';
import LayoutConstants from '../../../../../LayoutConstants';
import { CustomSwitch } from '../../../../../helpers/Views/CustomSwitch';

const MenuEditOrCreationIsEnabledView = (() => {
  const styles = StyleSheet.create({
    contentContainer: {
      backgroundColor: LayoutConstants.forms.innerContainer.backgroundColor,
      borderRadius: LayoutConstants.forms.innerContainer.borderRadius,
      padding: 13,
      paddingTop: 11,
      paddingBottom: 11,
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleText: {
      fontSize: 15,
      flex: 1,
    },
  });

  const MenuEditOrCreationIsEnabledView = () => {
    const [, { value }, { setValue }] = useField<
      MenuEditOrCreationValues,
      'isActive'
    >('isActive');

    return (
      <TextFieldViewContainer topTitleText="Enable / Disable">
        <View style={styles.contentContainer}>
          <CustomizedText style={styles.titleText}>
            Enable This Menu
          </CustomizedText>
          <CustomSwitch value={value} onValueChange={setValue} />
        </View>
      </TextFieldViewContainer>
    );
  };
  return MenuEditOrCreationIsEnabledView;
})();

export default MenuEditOrCreationIsEnabledView;
