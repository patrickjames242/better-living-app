import { LayoutRectangle, Dimensions, LayoutChangeEvent } from "react-native";
import { Optional, useForceUpdate } from "../../general";
import { useRef, useMemo } from "react";


export type NumberOfColumns = number | ((layout: LayoutRectangle) => number);


export function calculateNumberOfColumns(numberOfColumns: NumberOfColumns, latestLayout: Optional<LayoutRectangle>): number{
    if (typeof numberOfColumns === 'number'){
        return numberOfColumns;
    } else {
        const windowDimensions = Dimensions.get('window');
        const layout: LayoutRectangle = latestLayout ?? {width: windowDimensions.width, height: windowDimensions.height, x: 0, y: 0};
        return numberOfColumns(layout);
    }
}


export function useMultipleColumnFunctionality(listViewProps: {
    onLayout?: (layout: LayoutChangeEvent) => void,
    numberOfColumns: NumberOfColumns,
}){
    const latestLayout = useRef<Optional<LayoutRectangle>>(null);
    const latestLayoutValue = latestLayout.current;
    const propsNumberOfColumns = listViewProps.numberOfColumns;

    const calculatedNumberOfColumns = useMemo(() => {
        return calculateNumberOfColumns(propsNumberOfColumns, latestLayoutValue);            
    }, [propsNumberOfColumns, latestLayoutValue]);

    const forceRerender = useForceUpdate();

    return {
        calculatedNumberOfColumns,
        onListViewLayout: (layout: LayoutChangeEvent) => {
            latestLayout.current = layout.nativeEvent.layout;
            const newNumberOfColumns = calculateNumberOfColumns(propsNumberOfColumns, latestLayout.current);
            if (newNumberOfColumns !== calculatedNumberOfColumns) forceRerender();
            listViewProps.onLayout?.(layout);
        }
    }
}


