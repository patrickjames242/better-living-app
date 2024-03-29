import React, { CSSProperties, useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import { Color, CustomColors } from '../../../helpers/colors';
import LayoutConstants from '../../../LayoutConstants';
import {
  windowDimensionsDidChangeNotification,
  WindowDimensions,
} from '../helpers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotificationListener } from '../../../helpers/Notification';
import {
  getInfoForTabBarSelection,
  TabBarSelection,
  useTabBarSelectionsForCurrentUser,
} from '../tabBarSelectionsHelpers';

interface SideTabBarProps {
  selectedTab: TabBarSelection;
  onTabPress: (selection: TabBarSelection) => void;
}

const SideTabBar = (() => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      // backgroundColor: CustomColors.mainBackgroundColor.stringValue,
    },
    scrollView: {
      height: 200,
    },

    scrollViewContentView: {
      padding: LayoutConstants.sideMenuBar.padding,
    },
  });

  const marginSizes = {
    tallScreen: 30,
    shortScreen: 20,
  };

  function useItemMarginSize() {
    const getMarginSize = useCallback((dimensions: WindowDimensions) => {
      return dimensions.height > 500
        ? marginSizes.tallScreen
        : marginSizes.shortScreen;
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initialItemMarginSize = useMemo(
      () => getMarginSize(Dimensions.get('window')),
      [],
    );

    const [itemMarginSize, setItemMarginSize] = useState(initialItemMarginSize);

    useNotificationListener(
      windowDimensionsDidChangeNotification,
      dimensions => {
        setItemMarginSize(getMarginSize(dimensions));
      },
    );

    return itemMarginSize;
  }

  return function SideTabBar(props: SideTabBarProps) {
    const safeAreaInsets = useSafeAreaInsets();

    const itemMarginSize = useItemMarginSize();
    const tabBarSelections = useTabBarSelectionsForCurrentUser();

    return (
      <View style={styles.root}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollViewContentView,
            {
              paddingTop:
                safeAreaInsets.top + LayoutConstants.sideMenuBar.padding,
            },
          ]}
        >
          {(() => {
            return tabBarSelections.map((item, index) => {
              const info = getInfoForTabBarSelection(item);
              return (
                <SideBarItem
                  marginSize={itemMarginSize}
                  isSelected={props.selectedTab === item}
                  onPress={() => props.onTabPress(item)}
                  key={index}
                  icons={info.icons}
                  isFirstInList={index === 0}
                />
              );
            });
          })()}
        </ScrollView>
      </View>
    );
  };
})();

export default SideTabBar;

interface SideTabBarItemProps {
  icons: {
    png: any;
    svg: (props: { color: Color; style: CSSProperties }) => JSX.Element;
  };
  isSelected: boolean;
  onPress: () => void;
  isFirstInList?: boolean;
  marginSize: number;
}

const SideBarItem = (() => {
  const imageSize = LayoutConstants.sideMenuBar.barItem.imageSize;

  const styles = StyleSheet.create({
    root: {},
    contentView: {
      padding: LayoutConstants.sideMenuBar.barItem.padding,
      borderRadius: 15,
      alignSelf: 'flex-start',
      ...(Platform.OS === 'android' ? {} : { shadowRadius: 25 }),
    },
    image: {
      width: imageSize,
      height: imageSize,
      resizeMode: 'contain',
    },
  });

  return function SideBarItem(props: SideTabBarItemProps) {
    const color = props.isSelected ? Color.gray(1) : CustomColors.themeGreen;

    return (
      <BouncyButton
        onPress={props.onPress}
        bounceScaleValue={0.8}
        contentViewProps={{
          style: [
            styles.contentView,
            {
              marginTop:
                props.isFirstInList ?? false ? undefined : props.marginSize,
              backgroundColor: props.isSelected
                ? CustomColors.themeGreen.stringValue
                : 'white',
              ...(Platform.OS === 'android'
                ? {}
                : {
                    shadowColor: props.isSelected
                      ? CustomColors.themeGreen.stringValue
                      : 'black',
                    shadowOpacity: props.isSelected ? 0.5 : 0.05,
                  }),
            },
          ],
        }}
      >
        {(() => {
          switch (Platform.OS) {
            case 'web':
              return (
                <props.icons.svg
                  color={color}
                  style={{ width: imageSize, height: imageSize }}
                />
              );
            default:
              return (
                <Image
                  source={props.icons.png}
                  style={[styles.image, { tintColor: color.stringValue }]}
                />
              );
          }
        })()}
      </BouncyButton>
    );
  };
})();
