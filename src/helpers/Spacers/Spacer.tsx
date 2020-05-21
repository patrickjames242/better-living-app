
import React, { useCallback } from 'react';
import { View } from 'react-native';
import Space, { SpaceProps } from './Space';
import { Optional } from '../general';




/* 
    Adds a view in between each child that has a height or/and width of the space property value provided
    If it finds a Space component in its children, it will NOT insert a space on either side of it and will move on to the next item. This allows you to customize the spacing between specific items
*/
const Spacer: React.FC<SpaceProps> = props => {

    const newChildren = (() => {
        const oldChildren = props.children;
        if (oldChildren instanceof Array) {
            const arrayToReturn: React.ReactNode[] = [];

            let previousItem: Optional<React.ReactNode>;

            oldChildren.forEach((item, index) => {
                if (
                    index !== 0 &&
                    (item as React.ReactElement)?.type !== Space && 
                    (previousItem as any)?.type !== Space
                ) {
                    arrayToReturn.push(<Space {...props} />);
                }
                arrayToReturn.push(item);
                previousItem = item;
            });
            return arrayToReturn;
        } else {
            return [props.children];
        }

    })();

    return React.createElement(React.Fragment, null, ...newChildren);
}

export default Spacer;

