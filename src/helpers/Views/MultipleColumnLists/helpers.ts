import { LayoutRectangle, Dimensions, LayoutChangeEvent } from 'react-native';
import { Optional } from '../../general';
import { useRef, useMemo, useCallback } from 'react';
import { useForceUpdate } from '../../reactHooks';

export type NumberOfColumns = number | ((layout: LayoutRectangle) => number);

export function calculateNumberOfColumns(
  numberOfColumns: NumberOfColumns,
  latestLayout: Optional<LayoutRectangle>,
): number {
  if (typeof numberOfColumns === 'number') {
    return numberOfColumns;
  } else {
    const windowDimensions = Dimensions.get('window');
    const layout: LayoutRectangle = latestLayout ?? {
      width: windowDimensions.width,
      height: windowDimensions.height,
      x: 0,
      y: 0,
    };
    return numberOfColumns(layout);
  }
}

export function useMultipleColumnFunctionality(listViewProps: {
  onLayout?: (layout: LayoutChangeEvent) => void;
  numberOfColumns: NumberOfColumns;
}) {
  const latestLayout = useRef<Optional<LayoutRectangle>>(null);
  const latestLayoutValue = latestLayout.current;
  const propsNumberOfColumns = listViewProps.numberOfColumns;

  const calculatedNumberOfColumns = useMemo(() => {
    return calculateNumberOfColumns(propsNumberOfColumns, latestLayoutValue);
  }, [propsNumberOfColumns, latestLayoutValue]);

  const forceRerender = useForceUpdate();

  const onListViewLayout = useCallback(
    (layout: LayoutChangeEvent) => {
      if (
        // prevents update on 0 height and width layout update when new screen is presented in a navigation stack
        layout.nativeEvent.layout.width === 0 &&
        layout.nativeEvent.layout.height === 0
      ) {
        return;
      }
      latestLayout.current = layout.nativeEvent.layout;
      const newNumberOfColumns = calculateNumberOfColumns(
        propsNumberOfColumns,
        latestLayout.current,
      );
      if (newNumberOfColumns !== calculatedNumberOfColumns) forceRerender();
      listViewProps.onLayout?.(layout);
    },
    [
      calculatedNumberOfColumns,
      forceRerender,
      listViewProps,
      propsNumberOfColumns,
    ],
  );

  return {
    calculatedNumberOfColumns,
    onListViewLayout,
  };
}
