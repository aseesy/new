import { View } from 'react-native'
import React from 'react'
import RNPickerSelect, { Item } from 'react-native-picker-select';
import Icon from '@react-native-vector-icons/fontawesome6';
import { AppColor } from '../../constants/theme';
import NText from './NText';
import { isIos } from '../../utils';

interface ESelectProps {
    data: Item[];
    selectedValue?: string,
    onChange: (itemValue: string, itemIndex: number) => void,
    placeholder?: string
    title?: string;
}

const NSelect: React.FC<ESelectProps> = ({selectedValue, onChange, data, placeholder = 'Select...', title}) => {
  return (
    <View>
      {title ? 
      (
        <>
      <NText variant='h5'>
          {title}
      </NText>
      <View className='mt-2' />
      </>
      ) : null}
      <View className='border border-light20 rounded-lg p-1 ios:p-4' >
        <RNPickerSelect
          darkTheme={isIos}
          onValueChange={onChange}
          value={selectedValue}
          placeholder={{label: placeholder, value: placeholder}}
          items={data}
          pickerProps={{ mode: 'dropdown' }}
          useNativeAndroidPickerStyle={false}
          Icon={isIos ? () => <Icon name='chevron-down' color={AppColor.medium50} iconStyle='solid' /> : undefined}
          style={{ inputIOSContainer: { pointerEvents: "none" } }}
        />
      </View>
    </View>
  )
}

export default NSelect