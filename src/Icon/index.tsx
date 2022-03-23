import React, { useCallback } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import styles from './IconStyle';

export interface StateProps {}

export interface DispatchProps {}

export interface OwnProps {
  viewStyle: any;
  action: Function;
  color: string;
  icon: string;
  style: any;
}

export type IconProps = StateProps & DispatchProps & OwnProps;

const Icon = (props: IconProps) => {
  const { viewStyle, action, color = 'black', icon, style } = props;

  const renderIcon = useCallback(() => {
    const combinedStyle = {
      ...styles.defaultIcon,
      ...style,
      tintColor: color,
    };

    switch (icon) {
      default:
        return (
          <Image
            style={combinedStyle}
            resizeMode="contain"
            source={require(`./assets/close.png`)}
          />
        );
    }
  }, [icon, style, color]);

  return action ? (
    <TouchableOpacity
      onPress={() => action()}
      activeOpacity={0.75}
      style={{ ...styles.container, ...viewStyle }}
    >
      {renderIcon()}
    </TouchableOpacity>
  ) : (
    <View style={{ ...styles.container, ...viewStyle }}>{renderIcon()}</View>
  );
};

export default Icon;
