import { TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { NativeStackHeaderRightProps } from '@react-navigation/native-stack'
import Icon from '@react-native-vector-icons/fontawesome6'
import { Metrics } from '../../utils/metrics'
import { toggleDrawer } from '../../utils/navigationUtils'
import { AppColor } from '../../constants/theme'
import { useWS } from '../../Providers/SocketProvider'

const DrawerPin: React.FC<NativeStackHeaderRightProps> = ({ tintColor }) => {

  const { getStatus, retryConnect} = useWS();

  useLayoutEffect(() => {
    retryConnect();
  }, []);

  return (
    <View className='flex-row items-center'>
      <View className='mr-2'>
        <Icon name='circle' iconStyle='solid' size={Metrics.icon.xs} color={getStatus() === 'OPEN' ? AppColor.primary : AppColor.secondary}  />
      </View>
      <TouchableOpacity onPress={toggleDrawer} className='mr-3' >
        <Icon name='bars' iconStyle='solid' color={tintColor} size={Metrics.icon.md} />
      </TouchableOpacity>
    </View>
  )
}

export default DrawerPin