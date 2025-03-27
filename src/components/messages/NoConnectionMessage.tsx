import { View } from 'react-native'
import React from 'react'
import NText from '../ui/NText'
import Icon from '@react-native-vector-icons/fontawesome6'
import { Metrics } from '../../utils/metrics'
import { height } from '../../utils'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const NoConnectionMessage = () => {

  const { top, bottom } = useSafeAreaInsets();
  const calculatedHeigh = height - (top + bottom) - 100;

  return (
    <View className='items-center justify-start h-full' style={{height: calculatedHeigh}} >
      <View className='mt-14' />
      <View className='bg-light50 p-10 rounded-full'>
        <Icon
          name='people-group'
          size={Metrics.icon.xxxl}
          iconStyle='solid'
        />
      </View>
      <View className='mt-8' />
      <NText variant='h2' fontFamily='Medium' >
        No Connections
      </NText>
      <View className='mt-4' />
      <View className='mx-[15%]'>
        <NText classname='text-center'>
          Seems like you have not started a match yet. Tap on “+” icon 
          to start natching.
        </NText>
      </View>
    </View>
  )
}

export default NoConnectionMessage