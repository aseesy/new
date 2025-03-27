import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabRoutes } from './routes';
import { AppColor } from '../constants/theme';
import FontAwesome from '@react-native-vector-icons/fontawesome6';
import DrawerPin from '../components/common/DrawerPin';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useWS } from '../Providers/SocketProvider';

const TabStack = createBottomTabNavigator();

export const TabNavigator = () => {

    const { top } = useSafeAreaInsets();
    const { close } = useWS();

    useEffect(() => {

        return () => {
            close()
        }
    }, [])

    return (
        <TabStack.Navigator
            screenOptions={{
                headerBackButtonDisplayMode: 'minimal',
                headerStatusBarHeight: top,
                headerStyle: { backgroundColor: AppColor.secondary },
                headerRight: (props) => <DrawerPin {...props} />,
                headerTintColor: AppColor.light,
                tabBarStyle: {
                    borderColor: AppColor.light20,
                    backgroundColor: AppColor.light50,
                },
                tabBarActiveTintColor: AppColor.primary,
                tabBarLabelStyle: {
                    fontWeight: 'light',
                    color: AppColor.dark,
                }
            }}
        >
            {TabRoutes.map(route => (
                <TabStack.Screen key={route.name} name={route.name} options={{
                    tabBarLabel: route.label,
                    title: route?.label,
                    tabBarIcon: ({ color, size }) => <FontAwesome
                        name={route.icon}
                        iconStyle={'solid'}
                        size={size - 4}
                        color={color}
                    />
                }} component={route.component} />
            ))}
        </TabStack.Navigator>
    );
}