import { Text, TextStyle, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import { height, isAndroid } from '../../utils'

interface Props {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8'
    style?: TextStyle | TextStyle[]
    children: React.ReactNode
    fontFamily?: 'Bold' | 'Regular' | 'Black' | 'Medium' | 'Light'
    numberOfLines?: any,
    classname?: string,
    onPress?: (event: any) => void,
}

const NText: FC<Props> = ({ variant, style, children, numberOfLines, onPress, fontFamily = 'Regular', classname }) => {

    let computedFontSize = RFValue(12, height)

    switch (variant) {
        case 'h1':
            computedFontSize = RFValue(24, height)
            break;
        case 'h2':
            computedFontSize = RFValue(22, height)
            break;
        case 'h3':
            computedFontSize = RFValue(20, height)
            break;
        case 'h4':
            computedFontSize = RFValue(18, height)
            break;
        case 'h5':
            computedFontSize = RFValue(16, height)
            break;
        case 'h6':
            computedFontSize = RFValue(14, height)
            break;
        case 'h7':
            computedFontSize = RFValue(10, height)
            break;
        case 'h8':
            computedFontSize = RFValue(9), height
            break;
        default:
            computedFontSize = RFValue(12, height)
    }

    const propFontFamily = `Roboto-${fontFamily}`

    return (
        <Text
            selectable
            onPress={onPress}
            style={{
                fontSize: isAndroid ? computedFontSize : computedFontSize + 1,
                lineHeight: computedFontSize + (isAndroid ? 8 : 6),
                fontFamily: propFontFamily,
                ...style,
            }}
            className={`${classname}`}
            numberOfLines={numberOfLines ? numberOfLines : undefined}
        >
            {children}
        </Text>
    )
}

export default NText