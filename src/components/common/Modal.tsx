import { View, Text, Modal } from 'react-native'
import React from 'react'

interface IProps {
    visible: boolean;
    children?: React.ReactNode;
    onDismiss?: () => void;
}

const NModal: React.FC<IProps> = ({ children, visible, onDismiss }) => {
  return (
    <Modal
        visible={visible}
        onRequestClose={onDismiss}
    >
        {children}
    </Modal>
  )
}

export default NModal