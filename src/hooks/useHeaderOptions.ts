import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppColor } from '../constants/theme';

type HeaderOptions = {
    title?: string;
    headerShown?: boolean;
    headerRight?: () => React.ReactNode;
    headerLeft?: () => React.ReactNode;
    headerStyle?: object;
    headerTintColor?: string;
};

export const useHeaderOptions = (options: HeaderOptions) => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            title: '',
            headerBackTitle: '',
            headerBackButtonDisplayMode: 'minimal',
            headerTintColor: AppColor.light,
            ...options
        });
    }, [navigation, options]);
};
