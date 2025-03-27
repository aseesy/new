import { View, Text } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview';
import { height, width } from '../../utils';


const WebRenderer = ({uri}: {uri: string}) => {
  return (
    <View className='flex-1'>
        <WebView
          contentInsetAdjustmentBehavior='automatic'
          contentMode='recommended'
          startInLoadingState
          style={{ height: height, width, resizeMode: 'cover', flex: 1 }}
          injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
          scalesPageToFit={false}
          androidLayerType='hardware'
          source={{ uri }}
        />
    </View>
  )
}

export default WebRenderer