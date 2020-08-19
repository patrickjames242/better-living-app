
import React from 'react';
import BouncySquareIconButton, { BouncySquareIconButtonProps } from '../BouncySquareIconButton';
import AssetImages from '../../../images/AssetImages';

interface CheckMarkButton extends Partial<BouncySquareIconButtonProps>{

}

const CheckMarkButton = (props: CheckMarkButton) => {
    const isSelected = props.isSelected ?? false;
    return <BouncySquareIconButton {...props} iconSource={props.iconSource ?? AssetImages.checkMarkIcon} isSelected={isSelected} />
}


export default CheckMarkButton;
