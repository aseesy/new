import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import NText from '../ui/NText'
import FontAwesome from '@react-native-vector-icons/fontawesome6';
import { AppColor } from '../../constants/theme';
import { Metrics } from '../../utils/metrics';

interface CardProps {
    id: number,
    title: string,
    description: string,
    icon: string,
    onPress: (id: number) => void,
}

const Card: React.FC<CardProps> = ({ description, icon, onPress, title, id }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(id)} >
        <View className='my-1.5 bg-secondary flex-row flex-1 items-center rounded-md p-2'>
        <View className='ml-3'>
            <FontAwesome name={icon} iconStyle='solid' color={AppColor.light} size={Metrics.icon.lg} />
        </View>
        <View className='flex-1 px-3'>
            <View className='flex-1'>
                <NText variant='h5' fontFamily='Bold' classname='text-light' >{title}</NText>
            </View>
            <View className='flex-1'>
                <NText variant='h6' classname=' text-light' >{description}</NText>
            </View>
        </View>
        </View>
    </TouchableOpacity>
  )
}

export default Card