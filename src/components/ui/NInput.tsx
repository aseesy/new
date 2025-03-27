import React, { FC, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { AppColor } from '../../constants/theme';
import FontAwesome from '@react-native-vector-icons/fontawesome6';
import NText from './NText';
import { height, isAndroid } from '../../utils';

interface NInputProps extends TextInputProps {
  label?: string;
  value?: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  iconColor?: string;
  error?: string | boolean;
  required?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  rounded?: boolean;
  labelStyle?: TextStyle;
  secureTextEntry?: boolean;
  onIconPress?: () => void;
  iconType?: 'solid' | 'regular';
}

const NInput: FC<NInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  icon,
  iconPosition = 'left',
  iconSize = 20,
  iconColor = AppColor.light20,
  iconType = 'regular',
  error,
  required = false,
  style,
  inputStyle,
  labelStyle,
  secureTextEntry = false,
  rounded=false,
  onIconPress,
  ...props
}) => {

  const [secureView, toggleSecure] = useState<boolean>(secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label?
      <View style={styles.labelContainer}>
        <NText variant='h5' style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </NText>
      </View>:null}

      {/* Input Field */}
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputError : {},
          props?.readOnly ? { backgroundColor: AppColor.light20 } : {},
          icon && iconPosition === 'left' ? { paddingLeft: 30 } : {},
          icon && iconPosition === 'right' ? { paddingRight: 30 } : {},
        ]}
      >
        {icon && iconPosition === 'left' && (
          <FontAwesome
            name={icon}
            iconStyle={iconType}
            size={iconSize}
            color={iconColor}
            style={styles.icon}
          />
        )}

        {icon && iconPosition === 'left' && <View className='w-2' />}

        <TextInput
          value={value}
          autoCapitalize='none'
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={AppColor.medium50}
          style={[styles.input, inputStyle]}
          secureTextEntry={secureView}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <TouchableOpacity onPress={onIconPress} disabled={onIconPress === undefined} style={styles.iconRight}>
            <FontAwesome
              name={icon}
              size={iconSize}
              iconStyle={iconType}
              color={iconColor}
            />
          </TouchableOpacity>
        )}

        {!icon && secureTextEntry && (
          <FontAwesome
            onPress={() => toggleSecure(prev => !prev)}
            name={secureView ? 'eye-slash' : 'eye'}
            size={iconSize}
            color={iconColor}
            style={styles.iconRight}
          />
        )}
      </View>

      {/* Error message */}
      {error && <NText style={styles.errorText}>{error}</NText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    color: AppColor.dark90,
  },
  required: {
    color: AppColor.magenta,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: isAndroid ? 0 : 10,
    paddingHorizontal: 12,
    backgroundColor: AppColor.light,
    borderColor: AppColor.light20,
  },
  inputError: {
    borderColor: AppColor.magenta,
  },
  input: {
    flex: 1,
    fontSize: RFValue(18, height),
    color: AppColor.dark90,
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  iconRight: {
    position: 'absolute',
    right: 10,
  },
  errorText: {
    fontSize: RFValue(12, height),
    color: AppColor.magenta,
    marginTop: 4,
  },
});

export default NInput;
