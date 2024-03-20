import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Product from '../../../api/orderingSystem/products/Product';
import LayoutConstants from '../../../LayoutConstants';
import MealCreatorConstants from '../../../UI/Menu/MealCreaterScreen/MealCreatorConstants';
import { Color } from '../../colors';
import Space from '../../Spacers/Space';
import SpacerView from '../../Spacers/SpacerView';
import AspectRatioView from '../AspectRatioView';
import ProductImageThumbnailView from './ProductImageThumbnailView';

export interface MealEntryThumbnailViewProps {
  imageUrls: string[];
}

const MealEntryThumbnailView = (() => {
  const styles = StyleSheet.create({
    rootHolder: {
      width: LayoutConstants.productThumbnailImageWidth,
    },
    rootHolderContentView: {},
    rowHolderView: {
      flexDirection: 'row',
      flex: 1,
    },
    imageHolder: {
      borderRadius: 4,
    },
  });

  const spacing = 5;

  const MealEntryThumbnailView = (props: MealEntryThumbnailViewProps) => {
    return (
      <>
        {(() => {
          if (props.imageUrls.length >= 1) {
            return (
              <AspectRatioView
                style={styles.rootHolder}
                heightPercentageOfWidth={
                  LayoutConstants.productImageHeightPercentageOfWidth
                }
                innerHolderViewStyle={styles.rootHolderContentView}
              >
                <SpacerView style={styles.rowHolderView} space={spacing}>
                  <TinyThumbnailView imageUrl={props.imageUrls[0]} />
                  <TinyThumbnailView imageUrl={props.imageUrls[1]} />
                </SpacerView>
                <Space space={spacing} />
                <SpacerView style={styles.rowHolderView} space={spacing}>
                  <TinyThumbnailView imageUrl={props.imageUrls[2]} />
                  <TinyThumbnailView imageUrl={props.imageUrls[3]} />
                </SpacerView>
              </AspectRatioView>
            );
          } else {
            return <ProductImageThumbnailView imageUrl={null} />;
          }
        })()}
      </>
    );
  };
  return React.memo(MealEntryThumbnailView);
})();

export default MealEntryThumbnailView;

interface TinyThumbnailViewProps {
  imageUrl?: string;
}

const TinyThumbnailView = (() => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: Color.gray(0.97).stringValue,
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });

  const TinyThumbnailView = (props: TinyThumbnailViewProps) => {
    return (
      <View style={styles.root}>
        {props.imageUrl && (
          <Image style={styles.image} source={{ uri: props.imageUrl }} />
        )}
      </View>
    );
  };
  return TinyThumbnailView;
})();
