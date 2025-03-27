import { Modal, Pressable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import NText from './NText'

interface IProps {
    options: string[],
    visible: boolean,
    onPress: (index: number) => void
    onClose?: () => void
}

const NBottomSheet: React.FC<IProps> = ({options, onClose, onPress, visible}) => {
  return (
    <Modal visible={visible} transparent animationType='slide' style={{backgroundColor: 'transparent'}} renderToHardwareTextureAndroid onRequestClose={onClose} >
        <Pressable className='flex-grow bg-dark/30' onPress={onClose} />
        <View className='p-4 mb-2 bg-light'>
            <View className='pb-4'>
                <NText variant='h4' classname='text-base text-center font-latoBold text-medium50'>Choose an action</NText>
            </View>
            {options?.map((p, index) => (
                <React.Fragment key={p}>
                    <View className='border-t border-t-light50' />
                    <TouchableOpacity onPress={() => onPress(index)} className='py-4' >
                        <NText variant='h4' classname='text-center font-latoBold text-dark90'>{p}</NText>
                    </TouchableOpacity>
                </React.Fragment>
            ))}
        </View>
    </Modal>
  )
}

export default NBottomSheet