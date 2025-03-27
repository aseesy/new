import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import WebRenderer from '../../components/common/WebRenderer'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColor } from '../../constants/theme';


const Web = () => {

  const navigation = useNavigation();
  const { params } = useRoute();
  const { url, title } = (params || {}) as {
    url: string;
    title: string;
  };

  const { top, left } = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: false,
      headerBackButtonDisplayMode: 'minimal',
      fullScreenGestureEnabled: true,
      title: title,
      headerStyle: { backgroundColor: AppColor.secondary },
      headerTintColor: AppColor.light,
    })
  }, []);

  return (
    <View className='flex-1'>
      <WebRenderer key={url} uri={url} />
    </View>
  )
}

export default Web