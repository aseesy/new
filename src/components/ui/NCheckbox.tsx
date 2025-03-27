import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Fontawesome from '@react-native-vector-icons/fontawesome6';
import { Metrics } from '../../utils/metrics';
import NText from './NText';
import ELink from './ELink';

interface NCheckboxProps {
    label?: React.ReactNode | string;
    value?: boolean;
    onChange: (value: boolean) => void;
}

const NCheckbox: React.FC<NCheckboxProps> = ({ onChange, label, value }) => {
  return (
    <Pressable className='flex-row items-start gap-x-2' onPress={() => onChange(!value)} >
      <Fontawesome name={value ? 'square-check' : 'square'} size={Metrics.icon.md} iconStyle='regular' />
      <View>
        <NText variant='h6'>
            {label}
        </NText>
      </View>
    </Pressable>
  )
}

export default NCheckbox