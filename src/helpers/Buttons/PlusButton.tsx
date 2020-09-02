import React from 'react';
import AssetImages from "../../images/AssetImages";
import IconButton from './IconButton';

export interface PlusButtonProps {
    onPress?: () => void;
}


const PlusButton = (props: PlusButtonProps) => {
    return <IconButton
        iconSource={AssetImages.plusIcon}
        iconSize={20} {...props}
    />
}

export default PlusButton;
