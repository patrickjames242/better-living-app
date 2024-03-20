import React from 'react';
import { View } from 'react-native';

export interface SpaceProps {
  space: number;
  // if undefined, both is used.
  dimension?: SpaceDimension;
}

export enum SpaceDimension {
  onlyHorizontal,
  onlyVertical,
  both,
}

export default function Space(props: SpaceProps) {
  const dimension = props.dimension ?? SpaceDimension.both;
  const height =
    dimension === SpaceDimension.onlyVertical ||
    dimension === SpaceDimension.both
      ? props.space
      : undefined;
  const width =
    dimension === SpaceDimension.onlyHorizontal ||
    dimension === SpaceDimension.both
      ? props.space
      : undefined;
  return <View style={{ height, width }} />;
}
