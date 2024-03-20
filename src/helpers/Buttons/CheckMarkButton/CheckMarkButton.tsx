import React from 'react';
import BouncySquareIconButton, {
  BouncySquareIconButtonProps,
} from '../BouncySquareIconButton';
import AssetImages from '../../../images/AssetImages';

interface CheckMarkButton extends Partial<BouncySquareIconButtonProps> {}

const CheckMarkButton = (props: CheckMarkButton) => {
  const isSelected = props.isSelected ?? false;
  return (
    <BouncySquareIconButton
      {...props}
      iconSources={
        props.iconSources ?? {
          white: AssetImages.checkMarkIcon.white,
          offBlack: AssetImages.checkMarkIcon.black,
        }
      }
      isSelected={isSelected}
    />
  );
};

export default CheckMarkButton;
