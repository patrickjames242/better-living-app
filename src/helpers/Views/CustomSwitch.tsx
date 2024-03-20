import React from 'react';
import { Switch, SwitchProps, Platform } from 'react-native';
import { CustomColors } from '../colors';

export function CustomSwitch(props: SwitchProps) {
  return (
    <Switch
      {...Platform.select({
        web: { onTintColor: CustomColors.themeGreen.stringValue },
        default: {
          trackColor: {
            true: CustomColors.themeGreen.stringValue,
            false: 'gray',
          },
        },
      })}
      {...props}
    />
  );
}
