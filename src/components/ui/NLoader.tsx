import { View, Text, Modal, ActivityIndicator, SafeAreaView } from 'react-native'
import React from 'react'
import NText from './NText'
import { Metrics } from '../../utils/metrics'

interface INLoaderProps {
    isLoading: boolean
}

const NLoader: React.FC<INLoaderProps> = ({ isLoading }) => {
  return (
    <Modal transparent visible={isLoading} >
        <SafeAreaView className='bg-dark90/40' style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View className='p-8 bg-light rounded-lg'>
            <NText>Please wait...</NText>
            <View className='h-4' />
            <ActivityIndicator size={Metrics.activity.sm} />
          </View>
        </SafeAreaView>
    </Modal>
  )
}

export default NLoader