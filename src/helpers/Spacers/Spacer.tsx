
import React from 'react';
import Space, { SpaceProps } from './Space';
import { Optional } from '../general';




/* 
    Adds a view in between each child that has a height or/and width of the space property value provided
    If it finds a Space component in its children, it will NOT insert a space on either side of it and will move on to the next item. This allows you to customize the spacing between specific items
*/
const Spacer: React.FC<SpaceProps> = props => {

    return <BaseSpacer renderSpacer={(lhs, rhs) => {
        const eitherSideIsASpace = [lhs.item, rhs.item].some(x => (x as React.ReactElement)?.type === Space);
        if (eitherSideIsASpace){return null;}
        return <Space {...props}/>
    }}>{props.children}</BaseSpacer>

}

export default Spacer;



export interface BaseSpacerChild {
    item: React.ReactNode,
    index: number,
}

export interface BaseSpacerProps {
    renderSpacer: (leftItem: BaseSpacerChild, rightItem: BaseSpacerChild) => Optional<React.ReactElement>,
}

export const BaseSpacer: React.FC<BaseSpacerProps> = props => {
    const newChildren = (() => {
        const oldChildren = props.children;
        if (oldChildren instanceof Array) {
            const arrayToReturn: React.ReactNode[] = [];

            let previousItem: Optional<React.ReactNode> = null;

            oldChildren.forEach((item, index) => {
                if (item == null || typeof item === 'boolean'){return;}

                if (index !== 0 && previousItem != null) {
                    const elementToPush = props.renderSpacer(
                        { item: previousItem, index: index - 1, },
                        { item, index }
                    );
                    elementToPush != null && arrayToReturn.push(elementToPush);
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

