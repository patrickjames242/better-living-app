import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomColors } from '../../../helpers/colors';
import { CustomFont } from '../../../helpers/fonts/fonts';
import Space from '../../../helpers/Spacers/Space';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import LayoutConstants from '../../../LayoutConstants';
import { OrderDetailScreenConstants } from './helpers';

interface OrderDetailTitleContainerProps {
  title?: string;
}

const OrderDetailTitleContainer = (() => {
  const styles = StyleSheet.create({
    root: {
      padding: LayoutConstants.floatingCellStyles.padding,
      borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
      backgroundColor: 'white',
    },
    title: {
      fontSize: OrderDetailScreenConstants.headingFontSize,
      fontFamily: CustomFont.bold,
      color: CustomColors.themeGreen.stringValue,
    },
  });

  const TitleContainer = (
    props: React.PropsWithChildren<OrderDetailTitleContainerProps>,
  ) => {
    return (
      <View style={styles.root}>
        {(() => {
          if (props.title == null) {
            return props.children;
          } else {
            return (
              <>
                <CustomizedText style={styles.title}>
                  {props.title}
                </CustomizedText>
                <Space space={15} />
                {props.children}
              </>
            );
          }
        })()}
      </View>
    );
  };
  return React.memo(TitleContainer);
})();

export default OrderDetailTitleContainer;
