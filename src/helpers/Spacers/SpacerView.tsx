
import React from 'react';
import {View, ViewProps} from 'react-native';
import Spacer from './Spacer';
import { SpaceProps } from './Space';




const SpacerView: React.FC<ViewProps & SpaceProps> = props => {

    const viewProps: ViewProps = (() => {
        const x = {...props};
        delete x.dimension;
        delete x.space;
        delete x.children;
        return x;
    })();

    const spacerProps: SpaceProps = {dimension: props.dimension, space: props.space};

    return <View {...viewProps}>
        <Spacer {...spacerProps}>{props.children}</Spacer>
    </View>
}

export default SpacerView;