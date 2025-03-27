import { View, Image } from 'react-native'
import React from 'react'
import { IMAGES } from '../../../assets/images'
import NText from '../../components/ui/NText'
import NPressable from '../../components/ui/NPressable'
import { navigate } from '../../utils/navigationUtils'
import SvgImage from '../../components/common/SvgImage'

const Welcome = () => {
  return (
    <View className='flex-1 bg-light justify-center'>
      <View className='flex-[0.5]'>
        <View className='h-full w-full ios:overflow-y-hidden'>
          <View className='overflow-hidden'>
            <Image
              style={{
                width: '130%',
                marginLeft: '-25%',
              }}
              resizeMethod='resize'
              resizeMode='stretch'
              source={IMAGES.header}
            />
          </View>
        </View>
      </View>
      <View className='flex-1 justify-center items-center mt-4'>
          <View className='flex-1'>
            <SvgImage
              renderToHardwareTextureAndroid
              height={'100%'}
              width={'100%'}
              svg='LiazenDark'
            />
          </View>
          <View className='mt-2'/>
          <NText classname='text-dark90 text-center' variant='h4' >
            The Go-To App for Co-Parenting
          </NText>
      </View>
      <View className='flex-1 justify-center mx-8 mt-8'>
       <View className='flex-1'>
        <NText variant='h1' fontFamily='Medium' classname='text-center' >
            Hello, Welcome
        </NText>

        <View className='mt-12' />

          <NPressable onPress={() => navigate('/login')} title='Login' icon={'arrow-right'} iconPosition='right' />
          <View className='h-4' />
          <NPressable variant='outline' onPress={() => navigate('/register')} title='Register' borderColor='dark90' textColor='dark' />
       </View>
      </View>
    </View>
  )
}

export default Welcome