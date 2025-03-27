import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, View, Pressable } from 'react-native';
import { AppColor } from '../../constants/theme';
import NText from './NText';
import FontAwesome from '@react-native-vector-icons/fontawesome6';

type ButtonVariant = 'fill' | 'outline';

// Extend the AppColor type for strongly typed color props
type AppColorType = keyof typeof AppColor;

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: ViewStyle;
  textVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8';
  backgroundColor?: AppColorType; // Optional custom background color
  borderColor?: AppColorType; // Optional custom border color
  textColor?: AppColorType; // Optional custom text color
  icon?: any; // Icon name from FontAwesome6
  iconPosition?: 'left' | 'right'; // Icon position
  iconSize?: number; // Icon size
  iconColor?: AppColorType; // Icon color
  iconStyle?: 'regular' | 'solid' | 'brand'; // Icon style
  fontFamily?: 'Bold' | 'Regular' | 'Black' | 'Medium' | 'Light',
}

const NPressable: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'fill',
  disabled = false,
  loading = false,
  style,
  textStyle,
  textVariant = 'h6',
  fontFamily = 'Medium',
  backgroundColor,
  borderColor,
  textColor,
  icon,
  iconPosition = 'left',
  iconSize = 16,
  iconColor = 'light',
  iconStyle = 'solid'
}) => {
  // Font size mapping for the textVariant
  const fontSizeMap: { [key in ButtonProps['textVariant']]: number } = {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    h7: 14,
    h8: 12,
  };

  // Determine default colors based on variant
  const defaultBackgroundColor =
    variant === 'fill' ? AppColor.primary : 'transparent';
  const defaultBorderColor =
    variant === 'outline' ? AppColor.primary : 'transparent';
  const defaultTextColor =
    variant === 'fill' ? AppColor.light : AppColor.primary;

  // Resolve custom or default colors
  const resolvedBackgroundColor =
    backgroundColor && AppColor[backgroundColor]
      ? AppColor[backgroundColor]
      : defaultBackgroundColor;
  const resolvedBorderColor =
    borderColor && AppColor[borderColor]
      ? AppColor[borderColor]
      : defaultBorderColor;
  const resolvedTextColor =
    textColor && AppColor[textColor] ? AppColor[textColor] : defaultTextColor;
  const resolvedIconColor =
    iconColor && AppColor[iconColor] ? AppColor[iconColor] : resolvedTextColor;

  // Final styles with overrides
  const buttonStyle: ViewStyle = {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // Ensure icon and text are inline
    opacity: disabled || loading ? 0.6 : 1,
    backgroundColor: resolvedBackgroundColor,
    borderWidth: variant === 'outline' ? 1 : 1,
    borderColor: variant === 'fill' ? 'transparent' : resolvedBorderColor,
    ...style,
  };


  const fontSize = fontSizeMap[textVariant]; // Get the font size based on textVariant

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        buttonStyle,
        !disabled && !loading ? { opacity: 0.9 } : {}, // Slightly reduce opacity on press
      ]}
    >
      {({ pressed }) => loading ? (
        <ActivityIndicator size="small" color={resolvedTextColor} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', opacity: pressed ? 0.7 : 1 }}>
          {icon && iconPosition === 'left' && (
            <FontAwesome
              name={icon}
              size={iconSize}
              iconStyle={iconStyle}
              color={resolvedIconColor}
              style={{ marginRight: 8 }}
            />
          )}
          <NText
            variant={textVariant}
            fontFamily={fontFamily}
            style={{
              color: resolvedTextColor,
              textAlign: 'center',
              fontSize, // Apply font size dynamically
              ...textStyle,
            }}
          >
            {title}
          </NText>
          {icon && iconPosition === 'right' && (
            <FontAwesome
              name={icon}
              iconStyle={iconStyle}
              size={iconSize}
              color={resolvedIconColor}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </Pressable>
  );
};

export default NPressable;
