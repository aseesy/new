import { View, Text, Pressable } from 'react-native'
import React from 'react'
import NText from './NText';

interface ELinkProps {
    onPress?: () => void;
    children?: React.ReactNode;
}

const ELink: React.FC<ELinkProps> = ({children, onPress }) => {
  return (
    <NText variant='h6' onPress={onPress} classname='text-secondary'>{children}</NText>
  )
}

export default ELink